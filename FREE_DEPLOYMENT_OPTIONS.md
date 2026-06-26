# 🆓 Completely FREE Deployment Options

Want to deploy WITHOUT spending ANY money? Here are your best options:

---

## 🥇 Option 1: Vercel (Frontend) + Render.com (Backend) - COMPLETELY FREE

This is the **best completely free option**.

### Frontend on Vercel (100% Free)
- Unlimited deployments
- Unlimited bandwidth
- Automatic HTTPS
- Global CDN
- Custom domain support

### Backend on Render.com (Free Tier)
- Free tier includes:
  - 1 web service (always free)
  - Auto-deploy from GitHub
  - 750 hours/month (covers 24/7 uptime)
  - PostgreSQL database (optional, also free)
  - HTTPS included

**Total Cost: $0/month** ✅

#### Setup Instructions:

**Deploy Frontend to Vercel:**
1. Visit https://vercel.com
2. Sign up with GitHub
3. Import your repository
4. Set environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-on-render.onrender.com
   ```
5. Deploy (takes 1-2 minutes)
6. Get your Vercel URL

**Deploy Backend to Render:**
1. Visit https://render.com
2. Sign up with GitHub
3. Click "New+" → "Web Service"
4. Select your GitHub repository
5. Configure:
   - Runtime: Python 3.11
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Set environment variables:
   ```
   DATABASE_PATH=/app/data_collection/campus_data.db
   PYTHONUNBUFFERED=1
   ENVIRONMENT=production
   ```
7. Deploy (takes 2-3 minutes)
8. Get your Render URL

**Total time: 10-15 minutes**
**Total cost: $0**

---

## 🥈 Option 2: Netlify (Frontend) + Heroku (Backend) - Mostly Free

### Frontend on Netlify (Free)
- 300 deploy minutes/month (usually enough)
- Unlimited sites
- Automatic deployments
- HTTPS included

### Backend on Heroku (Free Tier Removed ❌)
- ⚠️ Heroku removed free tier in November 2022
- Not recommended anymore

**Not recommended** - Use Option 1 instead.

---

## 🥉 Option 3: Railway Free Tier (If Still Available)

Railway sometimes offers:
- $5 credit/month free tier
- Usually covers small projects for FREE

**Note:** Free tier availability changes, but worth checking.

**Pros:**
- Very easy to use
- Good dashboard
- Auto-scaling

**Cons:**
- Not guaranteed to be free
- Credit can run out

---

## 🎯 Option 4: Oracle Cloud (Completely Free)

Oracle offers an **Always Free Tier** that includes:
- 2 virtual machines (4 GB RAM each)
- 20 GB database storage
- Always free (no credit card charges)

**Pros:**
- Truly free and permanent
- Good performance
- Reliable

**Cons:**
- More complex setup (need to use Docker/Linux)
- Steeper learning curve
- Need to configure more manually

#### Basic Setup:
1. Create Oracle Cloud account (free tier)
2. Create a VM (4GB RAM, 1 CPU)
3. Install Docker
4. Run: `docker-compose -f docker-compose.prod.yml up -d`
5. Configure public IP address
6. Access your app

**Total cost: $0/month forever** ✅
**Setup time: 30-45 minutes**

---

## ⭐ RECOMMENDATION: Vercel + Render (BEST COMPLETELY FREE)

I recommend **Vercel + Render** because:

✅ **Completely free** - No credit card, no hidden costs
✅ **Easy setup** - 10-15 minutes total
✅ **Reliable** - Both are production-quality services
✅ **Auto-deploys** - Push to GitHub → automatic deployment
✅ **Good performance** - Global CDN (Vercel), good servers (Render)
✅ **Great for learning** - No limits on what you can build

### Here's the exact setup:

---

## 📋 COMPLETE GUIDE: Vercel + Render (FREE)

### Step 1: Deploy Backend to Render (5 minutes)

1. **Go to Render.com**
   ```
   https://render.com
   ```

2. **Sign up with GitHub**
   - Click "Sign up with GitHub"
   - Authorize access

3. **Create Web Service**
   - Click "New+" button
   - Select "Web Service"
   - Select your SIGAIDA-CAMPUS-ENERGY repository
   - Choose "main" branch

4. **Configure Service**
   - **Name**: `sigaida-backend`
   - **Environment**: `Python 3`
   - **Build command**: 
     ```
     cd backend && pip install -r requirements.txt
     ```
   - **Start command**:
     ```
     cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
     ```

5. **Set Environment Variables**
   - Click "Advanced" or "Environment"
   - Add variables:
     ```
     DATABASE_PATH=/app/data_collection/campus_data.db
     PYTHONUNBUFFERED=1
     ENVIRONMENT=production
     ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait 2-3 minutes for deployment
   - You'll get a URL like: `https://sigaida-backend.onrender.com`
   - **Save this URL** - you'll need it for frontend

### Step 2: Deploy Frontend to Vercel (5 minutes)

1. **Go to Vercel.com**
   ```
   https://vercel.com
   ```

2. **Sign up with GitHub**
   - Click "Sign up with GitHub"
   - Authorize access

3. **Import Project**
   - Click "Add New..."
   - Select "Project"
   - Select SIGAIDA-CAMPUS-ENERGY repository
   - Select "frontend" folder (if prompted)

4. **Set Environment Variables**
   - Before deploying, add:
     - **Key**: `NEXT_PUBLIC_API_URL`
     - **Value**: `https://sigaida-backend.onrender.com` (your Render URL from Step 1)

5. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes
   - You'll get a URL like: `https://sigaida-frontend.vercel.app`

6. **Done!** ✅
   - Your frontend is at: `https://sigaida-frontend.vercel.app`
   - Your backend is at: `https://sigaida-backend.onrender.com`
   - **Completely free!**

---

## 🚀 ACCESSING YOUR FREE APP

### Frontend
```
https://sigaida-frontend.vercel.app
→ Your dashboard with air quality, weather, vegetation data
```

### Backend API
```
https://sigaida-backend.onrender.com/api/docs
→ Interactive API documentation - test all endpoints here

https://sigaida-backend.onrender.com/api/health
→ Health check to verify backend is running
```

---

## ⚠️ Important Notes for Free Tier

### Vercel (Frontend)
- ✅ Completely free, no limits
- ✅ Unlimited bandwidth
- ✅ 300 deployment minutes/month
- ✅ Perfect for your use case

### Render (Backend)
- ✅ Free tier is truly free
- ⏰ **Caveat**: Service spins down after 15 minutes of inactivity
- 💡 **Solution**: First request takes 30 seconds to wake up (cold start)
- ✅ Still completely free

**Cold start example:**
- First request: Takes 30 seconds
- Following requests: < 100ms
- Auto-wakes when needed

---

## 📊 Comparison: All Free Options

| Service | Frontend | Backend | Cost | Setup Time | Pros | Cons |
|---------|----------|---------|------|-----------|------|------|
| **Vercel + Render** | Vercel | Render | $0 | 15 min | Easy, free | Cold start (30s) |
| **Netlify + Heroku** | Netlify | ❌ | - | - | - | Heroku free tier gone |
| **Railway** | Railway | Railway | $0-5 | 15 min | Easy, good UX | May have hidden costs |
| **Oracle Cloud** | VM | VM | $0 | 45 min | Always free | Complex setup |

---

## ✅ Final Recommendation

**Use: Vercel (Frontend) + Render (Backend)**

**Because:**
1. ✅ 100% free - no credit card charges
2. ✅ Easy setup - 15 minutes
3. ✅ Reliable - both are production services
4. ✅ Perfect for your project
5. ✅ Auto-deploys from GitHub
6. ✅ Good performance

**Cost: $0/month forever** 🎉

---

## 🔄 How to Switch from Railway to Free Option

If you already deployed to Railway and want to switch to free:

1. **Keep Railway or cancel** (your choice)
2. **Follow the Vercel + Render setup above**
3. **Update GitHub to point to new URLs** (automatic with Vercel)
4. **Share new free URLs with team**

---

## 📞 Still Have Questions?

See other guides:
- **QUICK_DEPLOY.md** - Quick reference
- **DEPLOYMENT_GUIDE.md** - Technical details
- **FIND_YOUR_URLS.md** - Finding your URLs

---

## 🎯 Next Steps

### To Deploy FREE (Vercel + Render):

1. Go to https://render.com → Deploy backend
2. Go to https://vercel.com → Deploy frontend
3. Set NEXT_PUBLIC_API_URL to your Render URL
4. Test both URLs work
5. Share with team!

**Total time: 15 minutes**
**Total cost: $0**

---

Generated: 2026-06-27
Status: FREE Deployment Ready ✅
