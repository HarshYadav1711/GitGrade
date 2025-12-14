# Deployment Guide

## Vercel Deployment (Frontend)

### Option 1: Deploy from Frontend Directory (Recommended)

1. In Vercel dashboard, set the **Root Directory** to `frontend`
2. Vercel will automatically detect Next.js
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com
   ```

### Option 2: Deploy from Root with Configuration

1. Point Vercel to the root directory
2. Set **Root Directory** to `frontend` in Vercel project settings
3. Or use the `vercel.json` in the frontend directory

## Backend Deployment

Deploy the backend separately on:
- **Railway**: https://railway.app
- **Render**: https://render.com
- **Fly.io**: https://fly.io
- **Heroku**: https://heroku.com

### Railway Deployment (Recommended)

1. Connect your GitHub repo
2. Set root directory to `backend`
3. Add environment variables:
   ```
   PORT=3001
   GITHUB_TOKEN=your_token
   OPENAI_API_KEY=your_key
   NODE_ENV=production
   ```
4. Railway will auto-detect Node.js and deploy

### Render Deployment

1. Create a new Web Service
2. Connect GitHub repo
3. Set:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Add environment variables

## Environment Variables

### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### Backend (Railway/Render)
```
PORT=3001
GITHUB_TOKEN=your_github_token
OPENAI_API_KEY=your_openai_key
NODE_ENV=production
```

## Quick Deploy Steps

### 1. Deploy Backend First
```bash
# On Railway or Render
cd backend
# Follow platform-specific deployment steps
```

### 2. Get Backend URL
- Railway: `https://your-app.railway.app`
- Render: `https://your-app.onrender.com`

### 3. Deploy Frontend
```bash
# On Vercel
# Set Root Directory: frontend
# Add env var: NEXT_PUBLIC_API_URL=https://your-backend-url
```

## Troubleshooting

### Vercel Build Error
- **Issue**: Trying to build backend
- **Solution**: Set Root Directory to `frontend` in Vercel settings

### CORS Errors
- **Issue**: Frontend can't reach backend
- **Solution**: Ensure backend CORS allows your frontend domain

### API Connection Issues
- **Issue**: Frontend shows connection errors
- **Solution**: Check `NEXT_PUBLIC_API_URL` is set correctly

## Production Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend environment variables set
- [ ] GitHub token configured (for higher rate limits)
- [ ] OpenAI key configured (optional)
- [ ] CORS configured on backend
- [ ] Test end-to-end flow

