// Shared types for the backend

export interface AnalysisRequest {
  repoUrl: string;
}

export interface AnalysisResponse {
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
  scoring: {
    dimensions: Array<{
      name: string;
      score: number;
      maxScore: number;
      percentage: number;
      reasons: string[];
      signals: Record<string, any>;
    }>;
    totalScore: number;
    maxScore: number;
    percentage: number;
    grade: string;
  };
  aiAnalysis: {
    summary: {
      summary: string;
      strengths: string[];
      weaknesses: string[];
      overallImpression: string;
    };
    roadmap: Array<{
      priority: number;
      title: string;
      description: string;
      why: string;
      how: string;
      estimatedImpact: number;
    }>;
    recruiterLens: {
      hireabilityScore: number;
      level: string;
      verdict: string;
      redFlags: string[];
      greenFlags: string[];
    };
    skillMap: {
      detected: string[];
      missing: string[];
    };
  };
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

