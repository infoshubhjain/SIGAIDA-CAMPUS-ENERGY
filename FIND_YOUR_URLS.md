# 🎉 Where to Find Your Deployed Application

Your app is now live on Railway.app! Here's how to find your URLs:

## 📍 Finding Your Application URLs

### Method 1: Via Railway Dashboard (Easiest)

1. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Log in with your GitHub account

2. **Find Your Project**
   - Look for your project name: "SIGAIDA-CAMPUS-ENERGY"
   - Click on it

3. **Find the Services**
   - You should see 2 services:
     - **frontend** (Next.js app)
     - **backend** (FastAPI app)

4. **Get Your URLs**
   - Click on each service
   - Look for "Domains" section
   - Copy the domain URL

### Your URLs Will Look Like:
```
Frontend: https://sigaida-campus-energy-frontend-production.railway.app
Backend:  https://sigaida-campus-energy-backend-production.railway.app
```

(The exact names depend on your project name and Railway's naming)

---

## 🌐 Accessing Your Application

Once you have the URLs:

### Frontend (Your App)
- Visit your frontend URL in browser
- Should load the SIGAIDA dashboard
- Example: `https://your-frontend-url.railway.app`

### Backend API Documentation
- Visit: `https://your-backend-url.railway.app/api/docs`
- Should show interactive API documentation
- Test API endpoints here

### Health Check
- Visit: `https://your-backend-url.railway.app/api/health`
- Should return JSON with status

---

## 📋 Step-by-Step to Find URLs

### 1. Open Railway Dashboard
```
https://railway.app/dashboard
```

### 2. Click on Your Project
Look for "SIGAIDA-CAMPUS-ENERGY" in the project list

### 3. View Services
You'll see a list of services. Click each one:

**Frontend Service:**
- Shows Node.js/Next.js icon
- Click it to see frontend URL
- URL format: `*.railway.app`

**Backend Service:**
- Shows Python icon
- Click it to see backend URL
- URL format: `*.railway.app`

### 4. Copy the Domain URLs
Each service shows "Domains" or "Public Domain" section
- Copy these URLs
- These are your public application URLs!

---

## ✅ Testing Your Deployed App

### Test Frontend
```bash
# Open in browser
https://your-frontend-url.railway.app

# Should show:
# ✓ Dashboard loads
# ✓ Navigation works
# ✓ No console errors
```

### Test Backend Health
```bash
# Test if backend is running
curl https://your-backend-url.railway.app/api/health

# Should return:
# {"status": "healthy", "timestamp": "...", "database_connected": true, ...}
```

### Test API Documentation
```
https://your-backend-url.railway.app/api/docs
```
Should show interactive API docs where you can test endpoints

---

## 🔗 Full URLs Reference

Once you get your URLs, save them here for easy reference:

```
FRONTEND URL:  https://YOUR_FRONTEND_DOMAIN.railway.app
BACKEND URL:   https://YOUR_BACKEND_DOMAIN.railway.app

API DOCS:      https://YOUR_BACKEND_DOMAIN.railway.app/api/docs
HEALTH CHECK:  https://YOUR_BACKEND_DOMAIN.railway.app/api/health

CURRENT TIME:  2026-06-27
```

---

## 🐛 Troubleshooting

### URLs Not Showing?
- Give Railway 2-3 minutes to assign domains
- Refresh the page
- Check if both services are "Running" (green status)

### Getting 404 Error?
- URL might be slightly different
- Check spelling carefully
- Copy-paste from Railway dashboard

### Backend Not Connecting?
- Make sure frontend has correct backend URL
- Check the environment variable: `NEXT_PUBLIC_API_URL`
- Should point to your backend domain
- If wrong, you need to redeploy frontend with correct URL

### Services Not Running?
- Check Railway dashboard for errors
- Look at build logs
- Check if deployment succeeded

---

## 📊 What You Should See

### Frontend (Dashboard)
```
SIGAIDA Campus Energy
┌─────────────────────────────┐
│  Dashboard with:            │
│  • Air Quality Index card   │
│  • PM2.5 measurements       │
│  • Temperature display      │
│  • Weather info             │
│  • Navigation menu          │
└─────────────────────────────┘
```

### Backend API (at /api/docs)
```
Interactive API Documentation showing:
✓ /api/health - Health check
✓ /api/air-quality/current - Current air quality
✓ /api/air-quality/historical - Historical data
✓ /api/weather/forecast - Weather forecast
✓ /api/ndvi/latest - Vegetation data
... and more endpoints
```

---

## 🎯 Next Steps

1. ✅ Find your URLs (this guide)
2. ✅ Test frontend loads
3. ✅ Test backend API responds
4. 📝 Share the URLs with your team
5. 🔗 Configure custom domain (optional)
6. 📊 Set up monitoring (optional)

---

## 📞 Still Need Help?

If you can't find your URLs:

1. **Check if deployment completed**
   - Railway dashboard should show green checkmarks
   - Both services should say "Running"

2. **Check deployment logs**
   - Click on each service
   - Look at "Deployments" tab
   - Check if build was successful

3. **Wait a few minutes**
   - Railway sometimes takes a few minutes to assign URLs
   - Refresh the page

4. **Redeploy if needed**
   - Click service → Deployments
   - Click "Deploy Latest"

---

## 🎉 Congratulations!

Your application is now LIVE on the internet! 

**Share your URL with others:**
```
Check out my SIGAIDA Campus Energy dashboard:
https://your-frontend-url.railway.app
```

---

**Need more help?** Check DEPLOYMENT_GUIDE.md or QUICK_DEPLOY.md for detailed instructions.

Generated: 2026-06-27
Status: Application Deployed ✅
