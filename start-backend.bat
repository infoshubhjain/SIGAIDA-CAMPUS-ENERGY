@echo off
echo ========================================
echo SIGAIDA Campus Energy - Backend Startup
echo ========================================
echo.

cd backend

echo Installing Python dependencies...
pip install -r requirements.txt

echo.
echo Starting FastAPI server...
echo API will be available at: http://localhost:8000
echo Docs available at: http://localhost:8000/api/docs
echo.

uvicorn main:app --reload --port 8000
