# SIGAIDA Campus Energy - Deployment Guide

## Overview
This project is a full-stack application with:
- **Frontend**: Next.js (React) 
- **Backend**: FastAPI (Python)
- **Database**: SQLite
- **Containerization**: Docker

## Deployment Options

### Option 1: Railway.app (RECOMMENDED - FREE TIER)
Railway provides **free deployments** with generous limits. Perfect for your full-stack app.

#### Benefits:
- Free tier: $5 credit/month (often sufficient for small apps)
- Automatic deployments from GitHub
- Supports both Node.js and Python
- Easy environment variable management
- Built-in databases (PostgreSQL, MySQL)

#### Setup Steps:

1. **Push code to GitHub** (if not already):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/SIGAIDA-CAMPUS-ENERGY.git
   git push -u origin main
   ```

2. **Create Railway Account**:
   - Go to https://railway.app
   - Sign up with GitHub

3. **Create Backend Service**:
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect and build the backend
   - Set environment variables:
     ```
     DATABASE_PATH=/app/data_collection/campus_data.db
     PYTHONUNBUFFERED=1
     ```

4. **Create Frontend Service**:
   - Click "Add Service" in same project
   - Select same GitHub repo
   - Configure to use frontend directory
   - Set environment:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
     NODE_ENV=production
     ```

5. **Set Database Volume**:
   - Attach a volume to backend for persistent SQLite database
   - Path: `/app/data_collection`

---

### Option 2: Docker Locally + Cloud Storage
Run Docker locally, sync database to cloud.

#### Setup:
```bash
# Build and run locally
docker-compose build
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/api/docs
```

---

### Option 3: Heroku Alternative - Render.com
Free tier with limitations (sleeps after 15 min inactivity).

#### Setup:
- Similar to Railway, connect GitHub repo
- Deploy from Dockerfile
- Limited free tier (not recommended if uptime is needed)

---

### Option 4: Self-Hosted on DigitalOcean/AWS
For production-grade deployment with full control.

---

## Pre-Deployment Checklist

- [x] All code committed to git
- [x] Environment variables configured
- [x] Dockerfiles created
- [x] Database migrations ready
- [x] Frontend build verified
- [ ] Environment variables in `.env.local` (create if needed)

## Environment Variables

Create `.env.local` in project root:

```env
# Backend
DATABASE_PATH=./data_collection/campus_data.db
PYTHONUNBUFFERED=1

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development

# Optional: API Keys
OPENAQ_KEY=your_key_here
```

---

## Quick Start - Local Docker Deployment

```bash
# 1. Install Docker: https://www.docker.com/products/docker-desktop

# 2. Build images
docker-compose build

# 3. Start services
docker-compose up -d

# 4. Check logs
docker-compose logs -f

# 5. Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/api/docs

# 6. Stop services
docker-compose down
```

---

## Production Considerations

1. **Database**: 
   - SQLite is fine for development
   - For production: Migrate to PostgreSQL
   - Use managed databases (Railway, AWS RDS)

2. **Environment Variables**:
   - Use Railway's secret management
   - Never commit `.env` files
   - Store API keys securely

3. **Monitoring**:
   - Set up error tracking (Sentry)
   - Monitor performance with Railway dashboard
   - Set up alerts for failures

4. **Scaling**:
   - Frontend: Vercel (auto-scales, free)
   - Backend: Railway (add more resources as needed)
   - Database: Managed service (PostgreSQL)

---

## Recommended Deployment Architecture

```
┌─────────────────┐
│   GitHub Repo   │
└────────┬────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌─────────┐  ┌─────────────┐
│ Vercel  │  │   Railway   │
│Frontend │  │Backend+Data │
└─────────┘  └─────────────┘
```

---

## Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Railway (Backend) | $5/month credit | $5-20/month |
| Vercel (Frontend) | Unlimited | Free (up to 100GB/month) |
| Database | SQLite (local) or PostgreSQL | $15/month (optional) |
| **TOTAL** | | ~$5-20/month or FREE |

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 8000/3000
lsof -i :8000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Database Not Found
- Ensure `data_collection/campus_data.db` exists
- Check volume mounts in docker-compose.yml

### Frontend Can't Connect to Backend
- Update `NEXT_PUBLIC_API_URL` environment variable
- Check CORS settings in backend/main.py
- Verify backend is running

---

## Next Steps

1. Choose deployment platform (Railway recommended)
2. Push code to GitHub
3. Connect GitHub to platform
4. Set environment variables
5. Deploy and test
6. Monitor logs for errors

For questions: Refer to QUICK_START_GUIDE.md and README.md
