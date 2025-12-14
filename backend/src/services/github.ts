import axios, { AxiosInstance } from 'axios';

export interface GitHubRepo {
  name: string;
  full_name: string;
  description: string;
  language: string;
  languages_url: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  default_branch: string;
  size: number;
  has_issues: boolean;
  has_projects: boolean;
  has_wiki: boolean;
  archived: boolean;
  disabled: boolean;
}

export interface GitHubCommit {
  sha: string;
  commit: {
    message: string;
    author: {
      name: string;
      email: string;
      date: string;
    };
  };
  author: {
    login: string;
  };
}

export interface GitHubContent {
  name: string;
  path: string;
  type: 'file' | 'dir';
  size?: number;
  download_url?: string;
  content?: string;
}

export interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  size?: number;
  sha: string;
  url: string;
}

export interface RepositoryData {
  repo: GitHubRepo;
  languages: Record<string, number>;
  commits: GitHubCommit[];
  readme: string | null;
  structure: GitHubTreeItem[];
  branches: string[];
  pullRequests: any[];
  workflows: any[];
}

export class GitHubService {
  private api: AxiosInstance;
  private token: string | undefined;

  constructor() {
    this.token = process.env.GITHUB_TOKEN;
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        ...(this.token && { 'Authorization': `token ${this.token}` }),
      },
    });
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepo> {
    const response = await this.api.get<GitHubRepo>(`/repos/${owner}/${repo}`);
    return response.data;
  }

  async getLanguages(owner: string, repo: string): Promise<Record<string, number>> {
    try {
      const response = await this.api.get<Record<string, number>>(
        `/repos/${owner}/${repo}/languages`
      );
      return response.data;
    } catch (error) {
      return {};
    }
  }

  async getCommits(owner: string, repo: string, perPage: number = 100): Promise<GitHubCommit[]> {
    try {
      const response = await this.api.get<GitHubCommit[]>(
        `/repos/${owner}/${repo}/commits`,
        { params: { per_page: perPage } }
      );
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getReadme(owner: string, repo: string): Promise<string | null> {
    try {
      // First, get the README file info
      const readmeResponse = await this.api.get(`/repos/${owner}/${repo}/readme`);
      const downloadUrl = readmeResponse.data.download_url;
      
      if (!downloadUrl) {
        return null;
      }
      
      // Fetch the raw content
      const contentResponse = await axios.get(downloadUrl, {
        responseType: 'text',
      });
      
      return contentResponse.data || null;
    } catch (error) {
      return null;
    }
  }

  async getRepositoryStructure(owner: string, repo: string, branch: string = 'main'): Promise<GitHubTreeItem[]> {
    try {
      // Try to get the default branch first
      const repoInfo = await this.getRepository(owner, repo);
      const defaultBranch = repoInfo.default_branch || branch;
      
      // Get the tree recursively
      const refResponse = await this.api.get(`/repos/${owner}/${repo}/git/ref/heads/${defaultBranch}`);
      const sha = refResponse.data.object.sha;
      
      const treeResponse = await this.api.get(`/repos/${owner}/${repo}/git/trees/${sha}`, {
        params: { recursive: '1' },
      });
      
      return treeResponse.data.tree || [];
    } catch (error) {
      // Fallback: try to get contents from root
      try {
        const contentsResponse = await this.api.get(`/repos/${owner}/${repo}/contents`);
        // Convert contents to tree format
        return Array.isArray(contentsResponse.data)
          ? contentsResponse.data.map((item: any) => ({
              path: item.path,
              type: item.type === 'file' ? 'blob' : 'tree',
              sha: item.sha,
              mode: item.type === 'file' ? '100644' : '040000',
            }))
          : [];
      } catch {
        return [];
      }
    }
  }

  async getBranches(owner: string, repo: string): Promise<string[]> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/branches`);
      return response.data.map((branch: any) => branch.name);
    } catch (error) {
      return [];
    }
  }

  async getPullRequests(owner: string, repo: string): Promise<any[]> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/pulls`, {
        params: { state: 'all', per_page: 10 },
      });
      return response.data;
    } catch (error) {
      return [];
    }
  }

  async getWorkflows(owner: string, repo: string): Promise<any[]> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/actions/workflows`);
      return response.data.workflows || [];
    } catch (error) {
      return [];
    }
  }

  async fetchRepositoryData(owner: string, repo: string): Promise<RepositoryData> {
    const [repoData, languages, commits, readme, structure, branches, pullRequests, workflows] = 
      await Promise.all([
        this.getRepository(owner, repo),
        this.getLanguages(owner, repo),
        this.getCommits(owner, repo),
        this.getReadme(owner, repo),
        this.getRepositoryStructure(owner, repo),
        this.getBranches(owner, repo),
        this.getPullRequests(owner, repo),
        this.getWorkflows(owner, repo),
      ]);

    return {
      repo: repoData,
      languages,
      commits,
      readme,
      structure,
      branches,
      pullRequests,
      workflows,
    };
  }
}

