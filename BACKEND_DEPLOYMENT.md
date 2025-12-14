# Backend Deployment Guide

This guide covers deploying the GitGrade backend to various platforms.

## 🚀 Option 1: Railway (Recommended - Easiest)

Railway is the easiest option with automatic deployments from GitHub.

### Step-by-Step:

1. **Sign up/Login**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `GitGrade` repository

3. **Configure Service**
   - Railway will detect it's a Node.js project
   - Click on the service
   - Go to **Settings** → **Root Directory**
   - Set to: `backend`
   - Click "Save"

4. **Set Environment Variables**
   - Go to **Variables** tab
   - Add these variables:
     ```
     PORT=3001
     GITHUB_TOKEN=your_github_token_here
     OPENAI_API_KEY=your_openai_api_key_here
     NODE_ENV=production
     ```
   - Click "Add" for each variable

5. **Deploy**
   - Railway will automatically start building
   - Wait for deployment to complete (2-3 minutes)
   - Your backend URL will be: `https://your-app-name.railway.app`

6. **Get Your Backend URL**
   - Go to **Settings** → **Networking**
   - Copy the generated domain (e.g., `gitgrade-backend.railway.app`)
   - Use this URL in your frontend's `NEXT_PUBLIC_API_URL`

---

## 🌐 Option 2: Render (Free Tier Available)

Render offers a free tier with automatic deployments.

### Step-by-Step:

1. **Sign up/Login**
   - Go to https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the `GitGrade` repository

3. **Configure Service**
   - **Name**: `gitgrade-backend` (or any name)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free (or choose paid for better performance)

4. **Set Environment Variables**
   - Scroll down to "Environment Variables"
   - Click "Add Environment Variable" for each:
     ```
     PORT=3001
     GITHUB_TOKEN=your_github_token_here
     OPENAI_API_KEY=your_openai_api_key_here
     NODE_ENV=production
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy (3-5 minutes)
   - Your backend URL: `https://gitgrade-backend.onrender.com`

6. **Note**: Free tier services spin down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

## ✈️ Option 3: Fly.io

Fly.io offers global deployment with good performance.

### Step-by-Step:

1. **Install Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   
   # Or download from https://fly.io/docs/getting-started/installing-flyctl/
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Initialize Fly App**
   ```bash
   cd backend
   fly launch
   ```
   - Follow prompts
   - Don't deploy yet (we need to configure first)

4. **Create `fly.toml`** (if not auto-generated)
   ```toml
   app = "your-app-name"
   primary_region = "iad"  # or your preferred region
   
   [build]
     builder = "paketobuildpacks/builder:base"
   
   [http_service]
     internal_port = 3001
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
     processes = ["app"]
   
   [[services]]
     http_checks = []
     internal_port = 3001
     processes = ["app"]
     protocol = "tcp"
     script_checks = []
   ```

5. **Set Secrets (Environment Variables)**
   ```bash
   fly secrets set PORT=3001
   fly secrets set GITHUB_TOKEN=your_github_token_here
   fly secrets set OPENAI_API_KEY=your_openai_api_key_here
   fly secrets set NODE_ENV=production
   ```

6. **Deploy**
   ```bash
   fly deploy
   ```

7. **Get URL**
   ```bash
   fly info
   ```
   - Your backend URL: `https://your-app-name.fly.dev`

---

## 🐳 Option 4: Docker + Any Platform

If you prefer Docker, create a Dockerfile:

### Create `backend/Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3001

# Start server
CMD ["npm", "start"]
```

### Create `backend/.dockerignore`:
```
node_modules
dist
.env
*.log
.git
```

Then deploy to:
- **Railway**: Will auto-detect Dockerfile
- **Render**: Select "Docker" as environment
- **Fly.io**: Use `fly deploy` (auto-detects Dockerfile)
- **AWS ECS / Google Cloud Run / Azure**: Use standard Docker deployment

---

## 🔧 Post-Deployment Checklist

After deploying, verify:

1. **Health Check**
   ```bash
   curl https://your-backend-url.com/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Test API Endpoint**
   ```bash
   curl -X POST https://your-backend-url.com/api/analyze \
     -H "Content-Type: application/json" \
     -d '{"repoUrl":"https://github.com/vercel/next.js"}'
   ```

3. **Update Frontend**
   - Set `NEXT_PUBLIC_API_URL` in Vercel to your backend URL
   - Test the full flow from frontend

4. **CORS Configuration**
   - The backend already has CORS enabled for all origins
   - If you need to restrict, update `backend/src/index.ts`

---

## 🐛 Troubleshooting

### Build Fails
- **Issue**: TypeScript compilation errors
- **Solution**: Run `npm run build` locally first to check for errors

### Port Issues
- **Issue**: Service not starting
- **Solution**: Ensure `PORT` env var is set (platforms usually provide this automatically)

### Environment Variables Not Working
- **Issue**: API keys not being read
- **Solution**: 
  - Verify variable names match exactly (case-sensitive)
  - Restart the service after adding variables
  - Check logs for errors

### CORS Errors
- **Issue**: Frontend can't connect
- **Solution**: 
  - Verify backend URL is correct
  - Check CORS is enabled in `backend/src/index.ts`
  - Ensure frontend domain is allowed

### Rate Limiting
- **Issue**: GitHub API rate limits
- **Solution**: 
  - Add `GITHUB_TOKEN` to increase limit from 60 to 5,000/hour
  - Get token from: https://github.com/settings/tokens

---

## 📊 Platform Comparison

| Platform | Free Tier | Ease of Use | Auto-Deploy | Best For |
|----------|-----------|-------------|-------------|----------|
| **Railway** | Limited | ⭐⭐⭐⭐⭐ | ✅ Yes | Quick setup |
| **Render** | ✅ Yes | ⭐⭐⭐⭐ | ✅ Yes | Free hosting |
| **Fly.io** | Limited | ⭐⭐⭐ | ✅ Yes | Global performance |
| **Heroku** | ❌ No | ⭐⭐⭐⭐ | ✅ Yes | Familiar platform |

---

## 🎯 Recommended: Railway

**Why Railway?**
- ✅ Easiest setup (5 minutes)
- ✅ Automatic deployments from GitHub
- ✅ No configuration files needed
- ✅ Good free tier for testing
- ✅ Automatic HTTPS
- ✅ Built-in monitoring

**Quick Start:**
1. Sign up at railway.app
2. Connect GitHub repo
3. Set root directory to `backend`
4. Add environment variables
5. Done! 🎉

---

## 📝 Environment Variables Reference

```env
# Required
PORT=3001                    # Server port (usually auto-set by platform)
NODE_ENV=production          # Environment mode

# Recommended
GITHUB_TOKEN=ghp_xxxxx      # GitHub Personal Access Token (increases rate limit)

# Optional
OPENAI_API_KEY=sk-xxxxx     # OpenAI API key (for AI summaries, fallback available)
```

---

## 🔗 Next Steps

After backend is deployed:

1. **Copy your backend URL** (e.g., `https://gitgrade-backend.railway.app`)

2. **Update frontend** in Vercel:
   - Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url`

3. **Test end-to-end**:
   - Open your frontend URL
   - Try analyzing a repository
   - Verify it connects to your backend

---

**Need help?** Check the main README.md or open an issue!

