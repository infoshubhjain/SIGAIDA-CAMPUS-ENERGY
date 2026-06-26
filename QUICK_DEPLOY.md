# Quick Deployment Guide

Choose your deployment method below:

## 🚀 Option 1: Run Locally with Docker (Recommended for Testing)

**Requirements**: Docker Desktop installed

```bash
# 1. Clone/navigate to project
cd SIGAIDA-CAMPUS-ENERGY

# 2. Run deployment script (auto-builds and starts)
./deploy-local.sh

# 3. Access application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/api/docs

# 4. View logs
docker-compose logs -f

# 5. Stop when done
docker-compose down
```

---

## 🌐 Option 2: Deploy to Railway.app (Recommended for Production)

**Why Railway?**
- Free tier: $5 credit/month
- Zero configuration
- Automatic deployments from GitHub
- Easy scaling
- Built-in monitoring

### Step-by-Step:

1. **Push to GitHub**
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/SIGAIDA-CAMPUS-ENERGY.git
   git push -u origin main
   ```

2. **Create Railway Account**
   - Visit https://railway.app
   - Sign up with GitHub
   - Authorize access to your repositories

3. **Deploy Backend Service**
   - Click "Create New Project"
   - Select "Deploy from GitHub Repo"
   - Choose `SIGAIDA-CAMPUS-ENERGY`
   - Select the backend directory (if prompted)
   - Railway auto-detects the Dockerfile
   - Set environment variables:
     ```
     DATABASE_PATH=/app/data_collection/campus_data.db
     PYTHONUNBUFFERED=1
     ENVIRONMENT=production
     ```
   - Click "Deploy"

4. **Deploy Frontend Service**
   - In the same project, click "Add Service"
   - Select "Deploy from GitHub Repo"
   - Choose same repository
   - Set environment:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-service.railway.app
     NODE_ENV=production
     ```

5. **Configure Database Volume**
   - On backend service, add a volume:
     - Mount point: `/app/data_collection`
     - This persists your SQLite database

6. **Test Deployment**
   - Railway provides public URLs for both services
   - Test frontend URL → should load the app
   - Test backend URL/api/docs → should show API documentation

**Cost**: ~$5-20/month (often covered by free tier credit)

---

## 🖥️ Option 3: Deploy to Your Own Server

### Using Docker Compose on Ubuntu/Debian:

```bash
# 1. Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 2. Clone repository
git clone https://github.com/YOUR_USERNAME/SIGAIDA-CAMPUS-ENERGY.git
cd SIGAIDA-CAMPUS-ENERGY

# 3. Create .env file
cp .env.example .env
# Edit .env with production values

# 4. Run production deployment
docker-compose -f docker-compose.prod.yml up -d

# 5. Set up reverse proxy (optional but recommended)
# Use Nginx or Caddy to proxy requests to localhost:3000 and :8000
```

---

## 📊 Option 4: Deploy Frontend to Vercel + Backend to Railway

**Best if you want free frontend + minimal backend cost**

### Deploy Frontend to Vercel (Free):
```bash
# 1. Push code to GitHub
git push origin main

# 2. Visit https://vercel.com
# 3. Import project from GitHub
# 4. Set environment variable:
#    NEXT_PUBLIC_API_URL=https://your-railway-backend.railway.app
# 5. Deploy
```

### Deploy Backend to Railway (as above)

**Cost**: Completely free with Vercel + Railway free tier

---

## 🔧 Troubleshooting

### Port Already in Use
```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Try again
docker-compose up -d
```

### Database File Not Found
```bash
# Ensure database exists
touch data_collection/campus_data.db

# Or re-run data collection scripts
python data_collection/historical_and_current_air_quality_data.py
```

### Frontend Can't Connect to Backend
```bash
# Check if backend is running
curl http://localhost:8000/api/health

# Update NEXT_PUBLIC_API_URL if deployed
# Frontend must be able to reach backend URL from browser
```

### Container Won't Start
```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild
docker-compose build --no-cache
docker-compose up -d
```

---

## 📈 Next Steps After Deployment

1. **Monitor logs**: `docker-compose logs -f`
2. **Set up auto-restart**: Services auto-restart on Railway
3. **Configure DNS**: Point your domain to the deployed app
4. **Enable HTTPS**: Railway/Vercel provide free SSL certificates
5. **Set up backups**: Back up your SQLite database regularly

---

## 💰 Cost Summary

| Method | Cost | Uptime | Setup Time |
|--------|------|--------|-----------|
| Local Docker | Free | Dev only | 5 min |
| Railway (full) | $5-20/mo | 99.9% | 15 min |
| Vercel + Railway | Free-$5/mo | 99.9% | 20 min |
| Own Server | $5-50/mo | Varies | 30 min |

---

## 📚 Full Documentation

See **DEPLOYMENT_GUIDE.md** for detailed information about:
- Architecture decisions
- Production considerations
- Database migration
- Monitoring setup
- Scaling strategies

---

## ❓ Need Help?

Check these resources:
- Docker docs: https://docs.docker.com
- Railway docs: https://docs.railway.app
- Next.js docs: https://nextjs.org/docs
- FastAPI docs: https://fastapi.tiangolo.com
