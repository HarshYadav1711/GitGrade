import OpenAI from 'openai';
import { RepositoryData } from './github';
import { ScoringResult } from './scorer';

export interface AISummary {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  overallImpression: string;
}

export interface RoadmapItem {
  priority: number;
  title: string;
  description: string;
  why: string;
  how: string;
  estimatedImpact: number;
}

export interface AIServiceResult {
  summary: AISummary;
  roadmap: RoadmapItem[];
  recruiterLens: {
    hireabilityScore: number;
    level: 'Intern' | 'Junior' | 'Mid-Level' | 'Senior' | 'Not Ready';
    verdict: string;
    redFlags: string[];
    greenFlags: string[];
  };
  skillMap: {
    detected: string[];
    missing: string[];
  };
}

export class AIService {
  private client: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  async generateAnalysis(
    repoData: RepositoryData,
    scoring: ScoringResult
  ): Promise<AIServiceResult> {
    // If no OpenAI key, use fallback heuristics
    if (!this.client) {
      return this.generateFallbackAnalysis(repoData, scoring);
    }

    try {
      const prompt = this.buildPrompt(repoData, scoring);
      const response = await this.client.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: `You are an expert software engineer and recruiter evaluating GitHub repositories. 
            Provide honest, professional, and actionable feedback. Be specific and avoid generic responses.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = response.choices[0]?.message?.content || '';
      return this.parseAIResponse(content, repoData, scoring);
    } catch (error) {
      console.error('AI generation error:', error);
      return this.generateFallbackAnalysis(repoData, scoring);
    }
  }

  private buildPrompt(repoData: RepositoryData, scoring: ScoringResult): string {
    return `Analyze this GitHub repository and provide:

1. A concise summary (2-3 sentences) of the repository's overall quality
2. Top 3 strengths
3. Top 3 weaknesses
4. A personalized roadmap with 5 actionable items (each with: priority, title, description, why it matters, how to do it, estimated impact 0-100)
5. Recruiter assessment: hireability score (0-100), level (Intern/Junior/Mid-Level/Senior/Not Ready), verdict, red flags, green flags
6. Detected skills and missing skills

Repository: ${repoData.repo.full_name}
Description: ${repoData.repo.description || 'No description'}
Languages: ${Object.keys(repoData.languages).join(', ')}
Score: ${scoring.percentage}/100 (${scoring.grade})
Commits: ${repoData.commits.length}
Has README: ${repoData.readme ? 'Yes' : 'No'}
Test files: ${repoData.structure.filter(item => item.path.includes('test') || item.path.includes('spec')).length}
CI/CD: ${repoData.workflows.length > 0 ? 'Yes' : 'No'}

Format your response as JSON:
{
  "summary": {
    "summary": "...",
    "strengths": ["...", "...", "..."],
    "weaknesses": ["...", "...", "..."],
    "overallImpression": "..."
  },
  "roadmap": [
    {
      "priority": 1,
      "title": "...",
      "description": "...",
      "why": "...",
      "how": "...",
      "estimatedImpact": 85
    }
  ],
  "recruiterLens": {
    "hireabilityScore": 75,
    "level": "Junior",
    "verdict": "...",
    "redFlags": ["..."],
    "greenFlags": ["..."]
  },
  "skillMap": {
    "detected": ["..."],
    "missing": ["..."]
  }
}`;
  }

  private parseAIResponse(
    content: string,
    repoData: RepositoryData,
    scoring: ScoringResult
  ): AIServiceResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed as AIServiceResult;
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    // Fallback if parsing fails
    return this.generateFallbackAnalysis(repoData, scoring);
  }

  private generateFallbackAnalysis(
    repoData: RepositoryData,
    scoring: ScoringResult
  ): AIServiceResult {
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const redFlags: string[] = [];
    const greenFlags: string[] = [];
    const detectedSkills: string[] = [];
    const missingSkills: string[] = [];

    // Analyze strengths
    if (scoring.percentage >= 70) {
      strengths.push('Solid foundational structure');
    }
    if (repoData.readme) {
      strengths.push('Documentation present');
      greenFlags.push('Has README');
    }
    if (repoData.commits.length >= 20) {
      strengths.push('Active development history');
      greenFlags.push('Consistent commit history');
    }
    if (repoData.workflows.length > 0) {
      strengths.push('CI/CD pipeline configured');
      greenFlags.push('Automated workflows');
      detectedSkills.push('CI/CD');
    }

    // Analyze weaknesses
    const testFiles = repoData.structure.filter(item => 
      item.path.includes('test') || item.path.includes('spec')
    ).length;
    
    if (testFiles === 0) {
      weaknesses.push('No test files detected');
      redFlags.push('Missing tests');
      missingSkills.push('Testing');
    }
    
    if (!repoData.readme) {
      weaknesses.push('No README file');
      redFlags.push('Missing documentation');
    }
    
    if (repoData.commits.length < 10) {
      weaknesses.push('Limited commit history');
      redFlags.push('Insufficient git activity');
    }

    // Detect skills from languages and structure
    const languages = Object.keys(repoData.languages);
    if (languages.includes('JavaScript') || languages.includes('TypeScript')) {
      detectedSkills.push('JavaScript/TypeScript');
    }
    if (languages.includes('Python')) {
      detectedSkills.push('Python');
    }
    if (languages.includes('Java')) {
      detectedSkills.push('Java');
    }
    if (repoData.structure.some(item => item.path.includes('api/'))) {
      detectedSkills.push('REST APIs');
    }
    if (repoData.structure.some(item => item.path.includes('react'))) {
      detectedSkills.push('React');
    }
    if (repoData.structure.some(item => item.path.includes('database'))) {
      detectedSkills.push('Database Design');
    }

    // Missing skills
    if (testFiles === 0) missingSkills.push('Testing');
    if (repoData.workflows.length === 0) missingSkills.push('CI/CD');
    if (!repoData.structure.some(item => item.path.includes('docker'))) {
      missingSkills.push('Containerization');
    }

    // Generate roadmap
    const roadmap: RoadmapItem[] = [];
    let priority = 1;

    if (testFiles === 0) {
      roadmap.push({
        priority: priority++,
        title: 'Add Unit Tests',
        description: 'Implement comprehensive test coverage for core functionality',
        why: 'Tests improve reliability and demonstrate professional development practices',
        how: 'Use Jest (JavaScript) or pytest (Python) to write tests for your main functions and API endpoints',
        estimatedImpact: 20,
      });
    }

    if (!repoData.readme || (repoData.readme && repoData.readme.length < 500)) {
      roadmap.push({
        priority: priority++,
        title: 'Enhance README',
        description: 'Create a comprehensive README with setup instructions, features, and usage examples',
        why: 'A good README is the first thing recruiters and collaborators see',
        how: 'Include: project description, installation steps, usage examples, tech stack, and contribution guidelines',
        estimatedImpact: 15,
      });
    }

    if (repoData.workflows.length === 0) {
      roadmap.push({
        priority: priority++,
        title: 'Set Up CI/CD',
        description: 'Configure GitHub Actions for automated testing and deployment',
        why: 'CI/CD shows production-ready mindset and automation skills',
        how: 'Create .github/workflows/ci.yml with test and build steps',
        estimatedImpact: 15,
      });
    }

    if (repoData.commits.length < 20) {
      roadmap.push({
        priority: priority++,
        title: 'Improve Commit History',
        description: 'Make more frequent, meaningful commits with clear messages',
        why: 'Good commit history shows consistent development and collaboration skills',
        how: 'Follow conventional commit format: "feat:", "fix:", "docs:" prefixes',
        estimatedImpact: 10,
      });
    }

    roadmap.push({
      priority: priority++,
      title: 'Add Code Quality Tools',
      description: 'Configure ESLint, Prettier, or similar tools',
      why: 'Code quality tools ensure consistency and catch errors early',
      how: 'Install and configure linting/formatting tools for your language',
      estimatedImpact: 10,
    });

    // Determine hireability
    let hireabilityScore = scoring.percentage;
    let level: 'Intern' | 'Junior' | 'Mid-Level' | 'Senior' | 'Not Ready' = 'Not Ready';
    
    if (scoring.percentage >= 80 && testFiles > 0 && repoData.workflows.length > 0) {
      level = 'Mid-Level';
    } else if (scoring.percentage >= 60 && repoData.readme && repoData.commits.length >= 10) {
      level = 'Junior';
    } else if (scoring.percentage >= 40) {
      level = 'Intern';
    }

    const verdict = `This repository shows ${scoring.percentage >= 70 ? 'solid' : scoring.percentage >= 50 ? 'developing' : 'basic'} skills. ${level === 'Not Ready' ? 'Needs significant improvement before job readiness.' : `Suitable for ${level} positions.`}`;

    return {
      summary: {
        summary: `This repository ${scoring.percentage >= 70 ? 'demonstrates solid foundational skills' : scoring.percentage >= 50 ? 'shows developing capabilities' : 'needs significant improvement'} with ${strengths.length > 0 ? strengths[0] : 'basic structure'}, but ${weaknesses.length > 0 ? weaknesses[0] : 'lacks professional polish'}.`,
        strengths,
        weaknesses,
        overallImpression: `Overall grade: ${scoring.grade} (${scoring.percentage}/100). ${scoring.percentage >= 70 ? 'Ready for professional development' : 'Needs improvement in key areas'}.`,
      },
      roadmap,
      recruiterLens: {
        hireabilityScore,
        level,
        verdict,
        redFlags,
        greenFlags,
      },
      skillMap: {
        detected: detectedSkills,
        missing: missingSkills,
      },
    };
  }
}

