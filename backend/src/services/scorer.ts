import { RepositoryData } from './github';

export interface DimensionScore {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  reasons: string[];
  signals: Record<string, any>;
}

export interface ScoringResult {
  dimensions: DimensionScore[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
}

export class ScoringEngine {
  score(data: RepositoryData): ScoringResult {
    const dimensions: DimensionScore[] = [
      this.scoreCodeQuality(data),
      this.scoreProjectStructure(data),
      this.scoreDocumentation(data),
      this.scoreTesting(data),
      this.scoreGitHygiene(data),
      this.scoreRealWorldApplicability(data),
    ];

    const totalScore = dimensions.reduce((sum, dim) => sum + dim.score, 0);
    const maxScore = dimensions.reduce((sum, dim) => sum + dim.maxScore, 0);
    const percentage = Math.round((totalScore / maxScore) * 100);
    const grade = this.getGrade(percentage);

    return {
      dimensions,
      totalScore,
      maxScore,
      percentage,
      grade,
    };
  }

  private scoreCodeQuality(data: RepositoryData): DimensionScore {
    let score = 0;
    const maxScore = 25;
    const reasons: string[] = [];
    const signals: Record<string, any> = {};

    // Language diversity (0-5)
    const languageCount = Object.keys(data.languages).length;
    signals.languageCount = languageCount;
    if (languageCount >= 3) {
      score += 5;
      reasons.push('Good language diversity');
    } else if (languageCount >= 2) {
      score += 3;
      reasons.push('Moderate language diversity');
    } else if (languageCount >= 1) {
      score += 1;
      reasons.push('Limited language diversity');
    }

    // Code organization (0-8)
    const hasSrc = data.structure.some(item => item.path.startsWith('src/') || item.path.startsWith('lib/'));
    const hasConfig = data.structure.some(item => 
      item.path.includes('config') || item.path.includes('package.json') || item.path.includes('requirements.txt')
    );
    signals.hasSrc = hasSrc;
    signals.hasConfig = hasConfig;
    
    if (hasSrc && hasConfig) {
      score += 8;
      reasons.push('Well-organized code structure');
    } else if (hasSrc || hasConfig) {
      score += 4;
      reasons.push('Basic code organization');
    } else {
      reasons.push('Lacks clear code organization');
    }

    // File size and complexity (0-7)
    const totalFiles = data.structure.filter(item => item.type === 'blob').length;
    signals.totalFiles = totalFiles;
    
    if (totalFiles >= 20 && totalFiles <= 200) {
      score += 7;
      reasons.push('Appropriate project size');
    } else if (totalFiles >= 10) {
      score += 4;
      reasons.push('Moderate project size');
    } else if (totalFiles >= 5) {
      score += 2;
      reasons.push('Small project size');
    } else {
      reasons.push('Very few files detected');
    }

    // Code quality indicators (0-5)
    const hasLinter = data.structure.some(item => 
      item.path.includes('.eslintrc') || 
      item.path.includes('.prettierrc') || 
      item.path.includes('pyproject.toml') ||
      item.path.includes('tsconfig.json')
    );
    signals.hasLinter = hasLinter;
    
    if (hasLinter) {
      score += 5;
      reasons.push('Code quality tools configured');
    } else {
      reasons.push('No linting/formatting config detected');
    }

    return {
      name: 'Code Quality & Readability',
      score: Math.min(score, maxScore),
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      reasons,
      signals,
    };
  }

  private scoreProjectStructure(data: RepositoryData): DimensionScore {
    let score = 0;
    const maxScore = 15;
    const reasons: string[] = [];
    const signals: Record<string, any> = {};

    // Root level organization (0-5)
    const hasReadme = data.readme !== null;
    const hasLicense = data.structure.some(item => item.path.toLowerCase() === 'license' || item.path.toLowerCase() === 'license.txt');
    const hasGitignore = data.structure.some(item => item.path.toLowerCase() === '.gitignore');
    const hasContributing = data.structure.some(item => item.path.toLowerCase().includes('contributing'));
    
    signals.hasReadme = hasReadme;
    signals.hasLicense = hasLicense;
    signals.hasGitignore = hasGitignore;
    signals.hasContributing = hasContributing;

    let rootScore = 0;
    if (hasReadme) rootScore += 2;
    if (hasLicense) rootScore += 1;
    if (hasGitignore) rootScore += 1;
    if (hasContributing) rootScore += 1;
    
    score += rootScore;
    if (rootScore >= 4) {
      reasons.push('Excellent root-level organization');
    } else if (rootScore >= 2) {
      reasons.push('Basic root-level organization');
    } else {
      reasons.push('Missing standard repository files');
    }

    // Directory structure (0-5)
    const hasSrc = data.structure.some(item => item.path.startsWith('src/') || item.path.startsWith('lib/'));
    const hasTests = data.structure.some(item => 
      item.path.includes('test') || item.path.includes('spec') || item.path.includes('__tests__')
    );
    const hasDocs = data.structure.some(item => 
      item.path.includes('docs/') || item.path.includes('documentation/')
    );
    
    signals.hasSrc = hasSrc;
    signals.hasTests = hasTests;
    signals.hasDocs = hasDocs;

    let dirScore = 0;
    if (hasSrc) dirScore += 2;
    if (hasTests) dirScore += 2;
    if (hasDocs) dirScore += 1;
    
    score += dirScore;
    if (dirScore >= 4) {
      reasons.push('Well-structured directories');
    } else if (dirScore >= 2) {
      reasons.push('Basic directory structure');
    } else {
      reasons.push('Flat or unstructured directory layout');
    }

    // Configuration files (0-5)
    const hasPackageJson = data.structure.some(item => item.path === 'package.json');
    const hasRequirements = data.structure.some(item => item.path === 'requirements.txt' || item.path === 'Pipfile');
    const hasDocker = data.structure.some(item => item.path.includes('Dockerfile') || item.path.includes('docker-compose'));
    const hasEnvExample = data.structure.some(item => item.path.includes('.env.example'));
    
    signals.hasPackageJson = hasPackageJson;
    signals.hasRequirements = hasRequirements;
    signals.hasDocker = hasDocker;
    signals.hasEnvExample = hasEnvExample;

    let configScore = 0;
    if (hasPackageJson || hasRequirements) configScore += 2;
    if (hasDocker) configScore += 2;
    if (hasEnvExample) configScore += 1;
    
    score += configScore;
    if (configScore >= 4) {
      reasons.push('Good configuration management');
    } else if (configScore >= 2) {
      reasons.push('Basic configuration files');
    } else {
      reasons.push('Missing configuration files');
    }

    return {
      name: 'Project Structure & Organization',
      score: Math.min(score, maxScore),
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      reasons,
      signals,
    };
  }

  private scoreDocumentation(data: RepositoryData): DimensionScore {
    let score = 0;
    const maxScore = 15;
    const reasons: string[] = [];
    const signals: Record<string, any> = {};

    // README presence and quality (0-8)
    const hasReadme = data.readme !== null;
    signals.hasReadme = hasReadme;
    
    if (hasReadme) {
      const readmeLength = data.readme?.length || 0;
      signals.readmeLength = readmeLength;
      
      if (readmeLength > 1000) {
        score += 8;
        reasons.push('Comprehensive README');
      } else if (readmeLength > 500) {
        score += 5;
        reasons.push('Moderate README content');
      } else if (readmeLength > 100) {
        score += 3;
        reasons.push('Basic README present');
      } else {
        score += 1;
        reasons.push('Minimal README content');
      }
    } else {
      reasons.push('No README file found');
    }

    // Additional documentation (0-4)
    const hasDocs = data.structure.some(item => 
      item.path.includes('docs/') || item.path.includes('documentation/')
    );
    const hasContributing = data.structure.some(item => 
      item.path.toLowerCase().includes('contributing')
    );
    const hasChangelog = data.structure.some(item => 
      item.path.toLowerCase().includes('changelog') || item.path.toLowerCase().includes('history')
    );
    
    signals.hasDocs = hasDocs;
    signals.hasContributing = hasContributing;
    signals.hasChangelog = hasChangelog;

    let extraDocs = 0;
    if (hasDocs) extraDocs += 2;
    if (hasContributing) extraDocs += 1;
    if (hasChangelog) extraDocs += 1;
    
    score += extraDocs;
    if (extraDocs >= 3) {
      reasons.push('Additional documentation present');
    } else if (extraDocs >= 1) {
      reasons.push('Some additional documentation');
    } else {
      reasons.push('No additional documentation');
    }

    // Code comments and docstrings (0-3)
    // This is a heuristic - we check for common comment patterns in file names
    const hasCodeComments = data.structure.some(item => 
      item.path.includes('example') || item.path.includes('demo')
    );
    signals.hasCodeComments = hasCodeComments;
    
    if (hasCodeComments) {
      score += 3;
      reasons.push('Code examples or demos present');
    } else {
      reasons.push('No code examples detected');
    }

    return {
      name: 'Documentation Quality',
      score: Math.min(score, maxScore),
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      reasons,
      signals,
    };
  }

  private scoreTesting(data: RepositoryData): DimensionScore {
    let score = 0;
    const maxScore = 15;
    const reasons: string[] = [];
    const signals: Record<string, any> = {};

    // Test files presence (0-8)
    const testFiles = data.structure.filter(item => 
      item.path.includes('test') || 
      item.path.includes('spec') || 
      item.path.includes('__tests__') ||
      item.path.includes('__test__') ||
      item.path.endsWith('.test.js') ||
      item.path.endsWith('.test.ts') ||
      item.path.endsWith('.spec.js') ||
      item.path.endsWith('.spec.ts') ||
      item.path.endsWith('_test.py') ||
      item.path.endsWith('test_.py')
    );
    
    const testFileCount = testFiles.length;
    signals.testFileCount = testFileCount;
    signals.testFiles = testFiles.map(f => f.path);

    if (testFileCount >= 10) {
      score += 8;
      reasons.push('Comprehensive test coverage');
    } else if (testFileCount >= 5) {
      score += 5;
      reasons.push('Moderate test coverage');
    } else if (testFileCount >= 2) {
      score += 3;
      reasons.push('Basic test files present');
    } else if (testFileCount >= 1) {
      score += 1;
      reasons.push('Minimal test files');
    } else {
      reasons.push('No test files detected');
    }

    // Test configuration (0-4)
    const hasTestConfig = data.structure.some(item => 
      item.path.includes('jest.config') ||
      item.path.includes('pytest.ini') ||
      item.path.includes('vitest.config') ||
      item.path.includes('mocha.opts') ||
      item.path.includes('test/') ||
      item.path.includes('tests/')
    );
    signals.hasTestConfig = hasTestConfig;
    
    if (hasTestConfig) {
      score += 4;
      reasons.push('Test framework configured');
    } else {
      reasons.push('No test configuration detected');
    }

    // CI/CD for testing (0-3)
    const hasTestWorkflow = data.workflows.some(workflow => 
      workflow.name?.toLowerCase().includes('test') ||
      workflow.path?.includes('test')
    );
    signals.hasTestWorkflow = hasTestWorkflow;
    
    if (hasTestWorkflow) {
      score += 3;
      reasons.push('Automated testing in CI/CD');
    } else {
      reasons.push('No automated testing pipeline');
    }

    return {
      name: 'Testing & Maintainability',
      score: Math.min(score, maxScore),
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      reasons,
      signals,
    };
  }

  private scoreGitHygiene(data: RepositoryData): DimensionScore {
    let score = 0;
    const maxScore = 15;
    const reasons: string[] = [];
    const signals: Record<string, any> = {};

    // Commit frequency and consistency (0-6)
    const commitCount = data.commits.length;
    signals.commitCount = commitCount;
    
    if (commitCount >= 50) {
      score += 6;
      reasons.push('Active commit history');
    } else if (commitCount >= 20) {
      score += 4;
      reasons.push('Moderate commit activity');
    } else if (commitCount >= 10) {
      score += 2;
      reasons.push('Basic commit history');
    } else {
      reasons.push('Limited commit history');
    }

    // Commit message quality (0-5)
    const commitMessages = data.commits.slice(0, 20).map(c => c.commit.message.toLowerCase());
    const goodCommitPatterns = [
      /^(feat|fix|docs|style|refactor|test|chore)/,
      /^add/,
      /^update/,
      /^fix/,
      /^implement/,
    ];
    
    const goodCommits = commitMessages.filter(msg => 
      goodCommitPatterns.some(pattern => pattern.test(msg))
    ).length;
    
    const commitQuality = commitMessages.length > 0 
      ? (goodCommits / commitMessages.length) * 100 
      : 0;
    
    signals.commitQuality = Math.round(commitQuality);
    signals.goodCommits = goodCommits;
    signals.totalCommitsAnalyzed = commitMessages.length;

    if (commitQuality >= 70) {
      score += 5;
      reasons.push('Well-structured commit messages');
    } else if (commitQuality >= 50) {
      score += 3;
      reasons.push('Moderate commit message quality');
    } else if (commitQuality >= 30) {
      score += 1;
      reasons.push('Basic commit messages');
    } else {
      reasons.push('Poor commit message quality');
    }

    // Branch management (0-4)
    const branchCount = data.branches.length;
    signals.branchCount = branchCount;
    
    if (branchCount >= 3) {
      score += 4;
      reasons.push('Good branch management');
    } else if (branchCount >= 2) {
      score += 2;
      reasons.push('Basic branch usage');
    } else {
      reasons.push('Single branch (main/master only)');
    }

    return {
      name: 'Git & Commit Hygiene',
      score: Math.min(score, maxScore),
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      reasons,
      signals,
    };
  }

  private scoreRealWorldApplicability(data: RepositoryData): DimensionScore {
    let score = 0;
    const maxScore = 15;
    const reasons: string[] = [];
    const signals: Record<string, any> = {};

    // Project maturity indicators (0-5)
    const hasStars = data.repo.stargazers_count > 0;
    const hasForks = data.repo.forks_count > 0;
    const hasIssues = data.repo.has_issues;
    const isActive = new Date(data.repo.updated_at).getTime() > Date.now() - 90 * 24 * 60 * 60 * 1000; // 90 days
    
    signals.stars = data.repo.stargazers_count;
    signals.forks = data.repo.forks_count;
    signals.hasIssues = hasIssues;
    signals.isActive = isActive;

    let maturityScore = 0;
    if (hasStars) maturityScore += 1;
    if (hasForks) maturityScore += 1;
    if (hasIssues) maturityScore += 1;
    if (isActive) maturityScore += 2;
    
    score += maturityScore;
    if (maturityScore >= 4) {
      reasons.push('Active and engaged project');
    } else if (maturityScore >= 2) {
      reasons.push('Moderate project engagement');
    } else {
      reasons.push('Limited project engagement');
    }

    // Production readiness (0-5)
    const hasDocker = data.structure.some(item => 
      item.path.includes('Dockerfile') || item.path.includes('docker-compose')
    );
    const hasCI = data.workflows.length > 0;
    const hasEnvConfig = data.structure.some(item => 
      item.path.includes('.env.example') || item.path.includes('config')
    );
    const hasDeployScripts = data.structure.some(item => 
      item.path.includes('deploy') || item.path.includes('scripts')
    );
    
    signals.hasDocker = hasDocker;
    signals.hasCI = hasCI;
    signals.hasEnvConfig = hasEnvConfig;
    signals.hasDeployScripts = hasDeployScripts;

    let prodScore = 0;
    if (hasDocker) prodScore += 2;
    if (hasCI) prodScore += 2;
    if (hasEnvConfig) prodScore += 1;
    if (hasDeployScripts) prodScore += 1;
    
    score += prodScore;
    if (prodScore >= 4) {
      reasons.push('Production-ready infrastructure');
    } else if (prodScore >= 2) {
      reasons.push('Some production considerations');
    } else {
      reasons.push('Missing production infrastructure');
    }

    // Real-world features (0-5)
    const hasAPI = data.structure.some(item => 
      item.path.includes('api/') || 
      item.path.includes('routes/') ||
      item.path.includes('endpoints/')
    );
    const hasDatabase = data.structure.some(item => 
      item.path.includes('db/') ||
      item.path.includes('database/') ||
      item.path.includes('models/') ||
      item.path.includes('schema')
    );
    const hasAuth = data.structure.some(item => 
      item.path.includes('auth/') ||
      item.path.includes('login') ||
      item.path.includes('jwt') ||
      item.path.includes('oauth')
    );
    
    signals.hasAPI = hasAPI;
    signals.hasDatabase = hasDatabase;
    signals.hasAuth = hasAuth;

    let featureScore = 0;
    if (hasAPI) featureScore += 2;
    if (hasDatabase) featureScore += 2;
    if (hasAuth) featureScore += 1;
    
    score += featureScore;
    if (featureScore >= 4) {
      reasons.push('Real-world application features');
    } else if (featureScore >= 2) {
      reasons.push('Some real-world features');
    } else {
      reasons.push('Limited real-world features');
    }

    return {
      name: 'Real-World Applicability',
      score: Math.min(score, maxScore),
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      reasons,
      signals,
    };
  }

  private getGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  }
}

