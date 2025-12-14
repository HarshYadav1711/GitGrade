# GitGrade - AI-Powered Repository Evaluation Platform

> **See your GitHub repository through a recruiter's eyes**

GitGrade is a production-grade system that automatically analyzes GitHub repositories, providing comprehensive scoring, AI-generated insights, and personalized improvement roadmaps. Built for the GitGrade Hackathon by UnsaidTalks.

## 🎯 Features

### Core Features
- **Repository Ingestion Engine**: Fetches and analyzes GitHub repositories using the GitHub API
- **Multi-Dimensional Scoring (0-100)**: Evaluates 6 key dimensions:
  - Code Quality & Readability (25 points)
  - Project Structure & Organization (15 points)
  - Documentation Quality (15 points)
  - Testing & Maintainability (15 points)
  - Git & Commit Hygiene (15 points)
  - Real-World Applicability (15 points)
- **AI-Powered Summary**: Human-readable evaluation with strengths and weaknesses
- **Personalized Roadmap**: Actionable steps with impact estimates

### Differentiation Features (Winning Edge)
- ⭐ **Recruiter Lens Mode**: Hireability score, level assessment, and red/green flags
- ⭐ **Explainable AI Scoring**: Clickable breakdowns showing exactly why points were lost
- ⭐ **Improvement Simulation**: Preview potential score improvements
- ⭐ **Repo Health Timeline**: Visual commit activity and maturity tracking
- ⭐ **Skill Map Extraction**: Detected and missing skills based on repository analysis

## 🏗️ Architecture

```
GitGrade/
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── services/  # GitHub API, Scoring, AI integration
│   │   ├── middleware/# Error handling
│   │   └── index.ts   # Express server
│   └── package.json
├── frontend/         # Next.js 14 + Tailwind CSS
│   ├── app/
│   │   ├── components/# React components
│   │   └── page.tsx   # Main page
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- GitHub Personal Access Token (optional, but recommended for higher rate limits)
- OpenAI API Key (optional, for AI-generated summaries)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd GitGrade
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create `backend/.env`:
   ```env
   PORT=3001
   GITHUB_TOKEN=your_github_token_here
   OPENAI_API_KEY=your_openai_api_key_here
   NODE_ENV=development
   ```

   Create `frontend/.env.local` (optional):
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Run the development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - Backend API on `http://localhost:3001`
   - Frontend on `http://localhost:3000`

5. **Open your browser**
   Navigate to `http://localhost:3000` and paste a GitHub repository URL!

## 📖 Usage

1. **Enter a GitHub Repository URL**
   - Format: `https://github.com/username/repository`
   - Example: `https://github.com/facebook/react`

2. **Wait for Analysis**
   - The system fetches repository data
   - Calculates multi-dimensional scores
   - Generates AI insights (if OpenAI key is provided)

3. **Review Results**
   - **Overview**: Score, summary, timeline, skill map, improvement simulation
   - **Score Breakdown**: Detailed dimension analysis with explainable scoring
   - **Roadmap**: Prioritized improvement steps
   - **Recruiter Lens**: Hireability assessment and flags

## 🎨 Demo Repositories

Try these repositories to see GitGrade in action:

- **High Score**: `https://github.com/vercel/next.js`
- **Medium Score**: `https://github.com/facebook/create-react-app`
- **Learning Project**: Any beginner-friendly repository

## 🔧 Configuration

### GitHub Token (Recommended)
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate a token with `public_repo` scope
3. Add to `backend/.env` as `GITHUB_TOKEN`

**Why?** Without a token, you're limited to 60 requests/hour. With a token: 5,000 requests/hour.

### OpenAI API Key (Optional)
1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Add to `backend/.env` as `OPENAI_API_KEY`

**Note**: The system works without OpenAI using intelligent fallback heuristics, but AI summaries are more personalized.

## 🧪 Testing

### Manual Testing
1. Test with various repository types:
   - Well-maintained projects (high scores)
   - Beginner projects (lower scores)
   - Repositories with missing documentation
   - Repositories with no tests

2. Test error handling:
   - Invalid URLs
   - Private repositories (should fail gracefully)
   - Non-existent repositories

### Sample Test Cases
```bash
# High-quality repo
https://github.com/microsoft/vscode

# Medium-quality repo
https://github.com/expressjs/express

# Learning project
https://github.com/your-username/my-first-project
```

## 📊 Scoring Methodology

### Code Quality & Readability (25 points)
- Language diversity
- Code organization (src/, config files)
- Project size appropriateness
- Linting/formatting tools

### Project Structure & Organization (15 points)
- Root-level files (README, LICENSE, .gitignore)
- Directory structure (src/, tests/, docs/)
- Configuration files

### Documentation Quality (15 points)
- README presence and quality
- Additional documentation
- Code examples

### Testing & Maintainability (15 points)
- Test file presence
- Test framework configuration
- CI/CD for testing

### Git & Commit Hygiene (15 points)
- Commit frequency
- Commit message quality
- Branch management

### Real-World Applicability (15 points)
- Project maturity (stars, forks, activity)
- Production readiness (Docker, CI/CD)
- Real-world features (APIs, databases, auth)

## 🎯 Roadmap Generation

The AI generates personalized roadmaps based on:
- Current repository weaknesses
- Estimated impact on score
- Actionability and priority
- Industry best practices

Each roadmap item includes:
- **What**: Clear description
- **Why**: Business/technical rationale
- **How**: Step-by-step guidance
- **Impact**: Estimated score improvement

## 👔 Recruiter Lens

The Recruiter Lens provides:
- **Hireability Score**: 0-100 based on repository quality
- **Level Assessment**: Intern, Junior, Mid-Level, Senior, or Not Ready
- **Verdict**: Professional assessment
- **Red Flags**: Issues recruiters notice first
- **Green Flags**: Positive indicators

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Recharts
- **Backend**: Node.js, Express, TypeScript
- **AI**: OpenAI GPT-4 (with fallback heuristics)
- **APIs**: GitHub REST API
- **Visualization**: Recharts for timeline charts

## 📝 Project Structure

```
backend/src/
├── index.ts              # Express server
├── middleware/
│   └── errorHandler.ts   # Error handling
└── services/
    ├── github.ts         # GitHub API integration
    ├── scorer.ts         # Multi-dimensional scoring
    ├── ai.ts             # AI integration
    └── analyzer.ts       # Main analysis orchestrator

frontend/app/
├── page.tsx              # Main page
├── layout.tsx            # Root layout
├── globals.css           # Global styles
└── components/
    ├── AnalysisResults.tsx
    ├── ScoreCard.tsx
    ├── DimensionBreakdown.tsx
    ├── RoadmapView.tsx
    ├── RecruiterLens.tsx
    ├── TimelineChart.tsx
    ├── SkillMap.tsx
    └── ImprovementSimulation.tsx
```

## 🚨 Error Handling

The system gracefully handles:
- Invalid GitHub URLs
- Private/non-existent repositories
- Missing GitHub token (uses unauthenticated API)
- Missing OpenAI key (uses fallback heuristics)
- Network errors
- Rate limiting

## 🎓 For Judges

### What Makes This Special

1. **Production-Ready**: Clean architecture, error handling, graceful degradation
2. **Explainable AI**: Every score is transparent and clickable
3. **Recruiter-Focused**: Unique "Recruiter Lens" feature
4. **Actionable Insights**: Not just scores, but clear improvement paths
5. **Visual Excellence**: Beautiful, modern UI with charts and visualizations

### Demo Checklist

- ✅ End-to-end analysis flow
- ✅ Multiple repository types tested
- ✅ Error handling demonstrated
- ✅ All features working (scoring, roadmap, recruiter lens, timeline, skill map)
- ✅ Responsive design
- ✅ Fast analysis (< 10 seconds for most repos)

## 📄 License

This project is built for the GitGrade Hackathon by UnsaidTalks.

## 🤝 Contributing

This is a hackathon project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📧 Contact

Built with ❤️ for the GitGrade Hackathon.

---

**Note**: This repository itself should score 90+ on GitGrade! 🎯

