#!/bin/bash

# SIGAIDA Campus Energy - Startup Script for Mac/Linux
# This script starts both backend and frontend servers

echo "🚀 Starting SIGAIDA Campus Energy Application..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
}

# Function to kill process on a port
kill_port() {
    echo "⚠️  Port $1 is already in use. Killing existing process..."
    lsof -ti:$1 | xargs kill -9 2>/dev/null
    sleep 1
}

# Check and install dependencies
echo -e "${BLUE}Checking dependencies...${NC}"

# Check frontend dependencies
if [ ! -d "frontend/node_modules" ]; then
    echo -e "${BLUE}📦 Installing frontend dependencies...${NC}"
    cd frontend
    if npm install --cache /tmp/npm-cache-sigaida; then
        echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
    cd ..
else
    echo -e "${GREEN}✅ Frontend dependencies already installed${NC}"
fi

# Check backend dependencies
echo -e "${BLUE}Checking backend dependencies...${NC}"
if ! python3 -c "import fastapi, uvicorn" 2>/dev/null; then
    echo -e "${BLUE}📦 Installing backend dependencies...${NC}"
    cd backend
    if pip3 install -r requirements.txt; then
        echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    else
        echo -e "${RED}❌ Failed to install backend dependencies${NC}"
        exit 1
    fi
    cd ..
else
    echo -e "${GREEN}✅ Backend dependencies already installed${NC}"
fi

echo ""

# Check and clean up ports if needed
if check_port 8000; then
    kill_port 8000
fi

if check_port 3000; then
    kill_port 3000
fi

echo -e "${BLUE}Step 1: Starting Backend Server...${NC}"
cd backend
python3 -m uvicorn main:app --reload --port 8000 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 2

echo -e "${BLUE}Step 2: Starting Frontend Server...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for servers to be ready
echo ""
echo "⏳ Waiting for servers to start..."
sleep 5

# Check if processes are still running
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Backend server started successfully (PID: $BACKEND_PID)${NC}"
    echo -e "   ${GREEN}Backend API: http://localhost:8000${NC}"
    echo -e "   ${GREEN}API Docs: http://localhost:8000/api/docs${NC}"
else
    echo -e "${RED}❌ Backend failed to start. Check backend.log for details.${NC}"
fi

if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✅ Frontend server started successfully (PID: $FRONTEND_PID)${NC}"
    echo -e "   ${GREEN}Frontend: http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Frontend failed to start. Check frontend.log for details.${NC}"
fi

echo ""
echo "📝 Logs are being written to:"
echo "   - backend.log"
echo "   - frontend.log"
echo ""
echo "🌐 Opening application in browser..."
sleep 2

# Try to open in default browser (works on Mac)
if [[ "$OSTYPE" == "darwin"* ]]; then
    open http://localhost:3000
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open http://localhost:3000 2>/dev/null || echo "Please open http://localhost:3000 in your browser"
fi

echo ""
echo -e "${GREEN}✨ Application is running!${NC}"
echo ""
echo "To stop the servers, run: ./stop.sh"
echo "Or press Ctrl+C and manually kill the processes:"
echo "  kill $BACKEND_PID $FRONTEND_PID"
echo ""

# Keep script running and show logs
echo "📋 Tailing logs (Ctrl+C to exit, servers will continue running)..."
tail -f backend.log frontend.log
