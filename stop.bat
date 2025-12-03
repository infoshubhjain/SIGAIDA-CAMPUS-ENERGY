@echo off
REM SIGAIDA Campus Energy - Stop Script for Windows
REM This script stops both backend and frontend servers

echo.
echo ========================================
echo   Stopping SIGAIDA Servers
echo ========================================
echo.

REM Kill processes on port 8000 (Backend)
echo Stopping Backend (port 8000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Failed to stop process on port 8000
    ) else (
        echo Backend stopped successfully
    )
)

REM Kill processes on port 3000 (Frontend)
echo Stopping Frontend (port 3000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
    if errorlevel 1 (
        echo Failed to stop process on port 3000
    ) else (
        echo Frontend stopped successfully
    )
)

echo.
echo ========================================
echo   All servers stopped!
echo ========================================
echo.
pause
