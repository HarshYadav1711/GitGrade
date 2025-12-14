# GitGrade - Quick Start Guide

## 🚀 Get Running in 2 Minutes

### 1. Install
```bash
npm run install:all
```

### 2. Configure (Optional but Recommended)
Create `backend/.env`:
```env
PORT=3001
GITHUB_TOKEN=your_token_here
OPENAI_API_KEY=your_key_here
```

**Note**: Works without API keys using fallback heuristics!

### 3. Run
```bash
npm run dev
```

### 4. Test
Open http://localhost:3000 and try:
- `https://github.com/vercel/next.js`
- `https://github.com/expressjs/express`

## 🎯 Key Features to Demo

1. **Score Card**: Overall 0-100 score with grade
2. **AI Summary**: Strengths and weaknesses
3. **Score Breakdown**: Click any dimension for details
4. **Roadmap**: Prioritized improvement steps
5. **Recruiter Lens**: Hireability assessment
6. **Timeline**: Commit activity visualization
7. **Skill Map**: Detected vs missing skills
8. **Improvement Simulation**: Predicted score gains

## 📊 What Makes It Special

- ✅ **Recruiter Lens**: Unique feature showing hireability
- ✅ **Explainable Scoring**: Every point is justified
- ✅ **Actionable Roadmap**: Not just scores, but steps to improve
- ✅ **Production-Ready**: Error handling, graceful degradation
- ✅ **Beautiful UI**: Modern, professional design

## 🐛 Troubleshooting

**Port in use?** Change `PORT` in `backend/.env`

**Rate limited?** Add `GITHUB_TOKEN` to `backend/.env`

**Build errors?** Run `npm run install:all` again

## 📚 More Info

- Full README: `README.md`
- Setup Guide: `SETUP.md`
- Demo Script: `DEMO.md`
- Project Summary: `PROJECT_SUMMARY.md`

---

**Ready to evaluate repositories! 🎉**

