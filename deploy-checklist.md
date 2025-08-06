# 🚀 Deployment Checklist

## Pre-Deployment Checklist ✅
- [x] All TypeScript errors fixed
- [x] Build passes successfully (`npm run build`)
- [x] Deployment configs created (vercel.json, railway.toml, render.yaml)
- [x] CORS settings updated for production
- [x] Requirements.txt updated

## Backend Deployment (Railway - Recommended)

### Step 1: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "Deploy from GitHub repo"
4. Select this repository
5. Railway auto-detects Python and uses `railway.toml`

### Step 2: Set Environment Variables
In Railway dashboard:
- `OPENAI_API_KEY` = `your-openai-api-key-here`
- `OPENAI_MODEL` = `gpt-4o-mini` (optional)

### Step 3: Copy Backend URL
- Copy the generated URL (e.g., `https://contest-doge-production.railway.app`)

## Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel  
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import this repository
4. Vercel auto-detects Next.js and uses `vercel.json`

### Step 2: Set Environment Variables
In Vercel dashboard:
- `NEXT_PUBLIC_API_URL` = `your-railway-backend-url-from-above`

### Step 3: Deploy!
- Click Deploy and wait ~2 minutes

## Final Steps

### Update CORS (Important!)
1. Go back to Railway dashboard
2. Edit `backend/main.py` line 35:
   ```python
   "https://your-actual-vercel-app.vercel.app",  # Replace with your real URL
   ```
3. Redeploy backend

### Test Everything
1. Visit your Vercel URL
2. Upload two PDF documents  
3. Verify analysis works end-to-end

## 🎉 You're Live!
Your app will be accessible worldwide at your Vercel URL!

## Costs
- Vercel: Free
- Railway: Free tier → $5/month
- OpenAI: ~$0.50-2.00 per comparison