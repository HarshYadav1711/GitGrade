import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err.response?.status === 404) {
    return res.status(404).json({
      error: 'Repository not found. Please check the URL and ensure the repository is public.',
    });
  }

  if (err.response?.status === 403) {
    return res.status(403).json({
      error: 'GitHub API rate limit exceeded. Please try again later or provide a GitHub token.',
    });
  }

  res.status(err.status || 500).json({
    error: err.message || 'An unexpected error occurred',
  });
};

