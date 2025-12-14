# GitGrade Setup Guide

## Quick Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm run install:all
```

### Step 2: Configure Environment Variables

#### Backend Configuration
Create `backend/.env`:
```env
PORT=3001
GITHUB_TOKEN=your_github_token_here
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

**Getting a GitHub Token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select `public_repo` scope
4. Copy the token to `backend/.env`

**Getting an OpenAI API Key (Optional):**
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Copy to `backend/.env`

**Note**: The system works without OpenAI using intelligent fallback heuristics.

#### Frontend Configuration (Optional)
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Step 3: Start Development Servers
```bash
npm run dev
```

This starts:
- Backend API: http://localhost:3001
- Frontend: http://localhost:3000

### Step 4: Test the Application
1. Open http://localhost:3000
2. Enter a GitHub repository URL (e.g., `https://github.com/vercel/next.js`)
3. Click "Analyze"
4. Review the results!

## Troubleshooting

### Port Already in Use
If port 3000 or 3001 is in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Change port in `frontend/package.json` scripts

### GitHub API Rate Limits
Without a token: 60 requests/hour
With a token: 5,000 requests/hour

**Solution**: Add a GitHub token to `backend/.env`

### OpenAI API Errors
If you see OpenAI errors:
- Check your API key is correct
- Ensure you have credits
- The system will fall back to heuristics automatically

### Build Errors
```bash
# Clean and reinstall
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all
```

## Production Build

### Build
```bash
npm run build
```

### Start Production Servers
```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm start
```

## Docker Setup (Optional)

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - PORT=3001
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Need Help?

- Check the README.md for detailed documentation
- Review DEMO.md for demo scripts
- Open an issue on GitHub

