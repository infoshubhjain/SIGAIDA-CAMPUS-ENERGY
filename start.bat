@echo off
REM SIGAIDA Campus Energy - Startup Script for Windows
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo   SIGAIDA Campus Energy Application
echo ========================================
echo.

REM Check if ports are in use and kill if needed
echo Checking ports...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    echo Warning: Port 8000 is in use. Killing process...
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    echo Warning: Port 3000 is in use. Killing process...
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 1 /nobreak >nul

REM Start Backend
echo.
echo [1/2] Starting Backend Server...
cd backend
start "SIGAIDA Backend" /MIN cmd /k "python -m uvicorn main:app --reload --port 8000"
cd ..

REM Wait for backend to initialize
timeout /t 3 /nobreak >nul

REM Start Frontend
echo [2/2] Starting Frontend Server...
cd frontend
start "SIGAIDA Frontend" /MIN cmd /k "npm run dev"
cd ..

REM Wait for frontend to initialize
echo.
echo Waiting for servers to start...
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo   Servers Started Successfully!
echo ========================================
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8000
echo API Docs:  http://localhost:8000/api/docs
echo.
echo Opening application in browser...
timeout /t 2 /nobreak >nul

REM Open in default browser
start http://localhost:3000

echo.
echo Application is running!
echo.
echo Two console windows are running in the background:
echo  - SIGAIDA Backend (port 8000)
echo  - SIGAIDA Frontend (port 3000)
echo.
echo To stop the servers, run: stop.bat
echo Or close the minimized console windows
echo.
echo Press any key to exit this window...
pause >nul
