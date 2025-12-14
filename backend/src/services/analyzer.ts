import { GitHubService, RepositoryData } from './github';
import { ScoringEngine, ScoringResult } from './scorer';
import { AIService, AIServiceResult } from './ai';

export interface AnalysisResult {
  repository: {
    name: string;
    fullName: string;
    description: string;
    url: string;
    languages: Record<string, number>;
    stars: number;
    forks: number;
    createdAt: string;
    updatedAt: string;
  };
  scoring: ScoringResult;
  aiAnalysis: AIServiceResult;
  timeline: {
    commits: Array<{
      date: string;
      count: number;
    }>;
    activityScore: number;
  };
  metadata: {
    analyzedAt: string;
    analysisVersion: string;
  };
}

export async function analyzeRepository(
  owner: string,
  repo: string
): Promise<AnalysisResult> {
  const githubService = new GitHubService();
  const scoringEngine = new ScoringEngine();
  const aiService = new AIService();

  // Fetch repository data
  console.log(`Fetching data for ${owner}/${repo}...`);
  const repoData = await githubService.fetchRepositoryData(owner, repo);

  // Calculate scores
  console.log('Calculating scores...');
  const scoring = scoringEngine.score(repoData);

  // Generate AI analysis
  console.log('Generating AI analysis...');
  const aiAnalysis = await aiService.generateAnalysis(repoData, scoring);

  // Build timeline
  const timeline = buildTimeline(repoData.commits);

  return {
    repository: {
      name: repoData.repo.name,
      fullName: repoData.repo.full_name,
      description: repoData.repo.description || '',
      url: `https://github.com/${owner}/${repo}`,
      languages: repoData.languages,
      stars: repoData.repo.stargazers_count,
      forks: repoData.repo.forks_count,
      createdAt: repoData.repo.created_at,
      updatedAt: repoData.repo.updated_at,
    },
    scoring,
    aiAnalysis,
    timeline,
    metadata: {
      analyzedAt: new Date().toISOString(),
      analysisVersion: '1.0.0',
    },
  };
}

function buildTimeline(commits: any[]): {
  commits: Array<{ date: string; count: number }>;
  activityScore: number;
} {
  // Group commits by date
  const commitsByDate: Record<string, number> = {};
  
  commits.forEach(commit => {
    const date = new Date(commit.commit.author.date).toISOString().split('T')[0];
    commitsByDate[date] = (commitsByDate[date] || 0) + 1;
  });

  // Convert to array and sort
  const timeline = Object.entries(commitsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Calculate activity score (0-100)
  // Based on: frequency, recency, consistency
  const now = Date.now();
  const daysSinceFirst = commits.length > 0
    ? (now - new Date(commits[commits.length - 1].commit.author.date).getTime()) / (1000 * 60 * 60 * 24)
    : 0;
  const daysSinceLast = commits.length > 0
    ? (now - new Date(commits[0].commit.author.date).getTime()) / (1000 * 60 * 60 * 24)
    : 0;
  
  const frequency = commits.length / Math.max(daysSinceFirst, 1);
  const recency = Math.max(0, 100 - (daysSinceLast / 30) * 100); // Penalize if last commit > 30 days ago
  const consistency = timeline.length > 0 ? Math.min(100, (timeline.length / Math.max(daysSinceFirst, 1)) * 100) : 0;
  
  const activityScore = Math.round(
    (frequency * 0.4 + recency * 0.3 + consistency * 0.3) * 10
  );

  return {
    commits: timeline,
    activityScore: Math.min(100, activityScore),
  };
}

