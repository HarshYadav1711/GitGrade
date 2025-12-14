import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { analyzeRepository } from './services/analyzer';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main analysis endpoint
app.post('/api/analyze', async (req, res, next) => {
  try {
    const { repoUrl } = req.body;
    
    if (!repoUrl) {
      return res.status(400).json({ error: 'Repository URL is required' });
    }

    // Validate GitHub URL format
    const githubUrlRegex = /^https?:\/\/github\.com\/([\w\-\.]+)\/([\w\-\.]+)(?:\/)?$/;
    const match = repoUrl.match(githubUrlRegex);
    
    if (!match) {
      return res.status(400).json({ error: 'Invalid GitHub repository URL' });
    }

    const [, owner, repo] = match;
    
    const analysis = await analyzeRepository(owner, repo);
    res.json(analysis);
  } catch (error: any) {
    next(error);
  }
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 GitGrade Backend running on port ${PORT}`);
});

