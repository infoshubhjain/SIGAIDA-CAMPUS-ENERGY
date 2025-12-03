@echo off
echo ========================================
echo SIGAIDA Campus Energy - Frontend Startup
echo ========================================
echo.

cd frontend

echo Installing Node dependencies...
call npm install

echo.
echo Starting Next.js development server...
echo Application will be available at: http://localhost:3000
echo.

call npm run dev
