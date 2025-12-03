# 🚀 Quick Setup Guide

This guide will help you get the SIGAIDA Campus Energy application running quickly.

## ⚡ One-Click Start (Recommended)

The easiest way to run the application - just double-click or run:

### For Mac/Linux:
```bash
./start.sh
```

### For Windows:
```bash
start.bat
```
*Or simply double-click `start.bat` in Windows Explorer*

**What it does:**
- ✅ Starts both backend and frontend servers automatically
- ✅ Opens the application in your default browser
- ✅ Handles port conflicts (kills existing processes)
- ✅ Shows server logs in the terminal

**To stop everything:**
```bash
./stop.sh    # Mac/Linux
stop.bat     # Windows
```

**Access Points:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/api/docs

---

## 📝 Manual Setup

### Prerequisites Check

Make sure you have installed:
- [x] Python 3.8+ → Check: `python --version`
- [x] Node.js 18+ → Check: `node --version`
- [x] npm → Check: `npm --version`

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Copy environment file (optional)
cp ../.env.example .env

# Start backend
uvicorn main:app --reload --port 8000
```

**✅ Backend Running:** http://localhost:8000

### Step 2: Frontend Setup

Open a **NEW terminal** window:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start frontend
npm run dev
```

**✅ Frontend Running:** http://localhost:3000

---

## 🎯 What You Should See

### Backend Terminal
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [12345] using WatchFiles
INFO:     Started server process [12346]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

### Frontend Terminal
```
   ▲ Next.js 14.1.0
   - Local:        http://localhost:3000
   - Network:      http://192.168.1.x:3000

 ✓ Ready in 2.5s
```

---

## 🔍 Testing the Application

### 1. Check Backend Health
Open browser: http://localhost:8000/api/health

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2025-12-03T...",
  "database_connected": true,
  "version": "1.0.0"
}
```

### 2. Explore API Docs
Open: http://localhost:8000/api/docs

You'll see interactive Swagger documentation with all endpoints.

### 3. Access Frontend
Open: http://localhost:3000

You should see the dashboard with:
- Air Quality Index card
- PM2.5 measurements
- Temperature
- Average NDVI

---

## ❌ Troubleshooting

### Problem: "ModuleNotFoundError" in Backend

**Solution:**
```bash
cd backend
pip install -r requirements.txt
```

### Problem: "Module not found" in Frontend

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Database not found"

**Solution:**
- Make sure `campus_data.db` exists in `data_collection/` folder
- The database should be ~17MB
- If missing, you need to run data collection scripts first

### Problem: Frontend can't connect to backend

**Solution:**
1. Verify backend is running on port 8000
2. Check `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
3. Restart frontend: `npm run dev`

### Problem: Port already in use

**Backend (8000):**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

**Frontend (3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

---

## 🐳 Docker Alternative (Optional)

If you prefer Docker:

```bash
# Start everything with one command
docker-compose up --build

# Access:
# - Frontend: http://localhost:3000
# - Backend: http://localhost:8000
```

Stop:
```bash
docker-compose down
```

---

## 📚 Next Steps

Once everything is running:

1. **Explore Pages:**
   - Dashboard: http://localhost:3000
   - Air Quality: http://localhost:3000/air-quality
   - Weather: http://localhost:3000/weather
   - Vegetation: http://localhost:3000/vegetation
   - Transit: http://localhost:3000/transit

2. **Test API Endpoints:**
   - Visit http://localhost:8000/api/docs
   - Try out different endpoints
   - See real-time data

3. **Read Documentation:**
   - Backend docs: `backend/README.md`
   - Frontend docs: `frontend/README.md`
   - Main README: `README.md`

---

## 🆘 Need Help?

- Check main [README.md](README.md) for detailed documentation
- Review [backend/README.md](backend/README.md) for API details
- Review [frontend/README.md](frontend/README.md) for frontend setup
- Open an issue on GitHub

---

## ✅ Checklist

- [ ] Backend running on http://localhost:8000
- [ ] Backend health check passes
- [ ] API docs accessible
- [ ] Frontend running on http://localhost:3000
- [ ] Dashboard loads successfully
- [ ] Can navigate between pages
- [ ] Charts display data
- [ ] Maps render correctly

---

**Ready to monitor campus environmental data!** 🌱🌍
