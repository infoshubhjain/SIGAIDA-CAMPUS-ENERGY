#!/bin/bash

# SIGAIDA Campus Energy - Stop Script for Mac/Linux
# This script stops both backend and frontend servers

echo "🛑 Stopping SIGAIDA Campus Energy Application..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# Function to kill process on a port
kill_port() {
    if lsof -ti:$1 > /dev/null 2>&1; then
        echo -e "${RED}Stopping process on port $1...${NC}"
        lsof -ti:$1 | xargs kill -9 2>/dev/null
        echo -e "${GREEN}✅ Port $1 cleared${NC}"
    else
        echo "Port $1 is not in use"
    fi
}

# Kill backend (port 8000)
kill_port 8000

# Kill frontend (port 3000)
kill_port 3000

echo ""
echo -e "${GREEN}✅ All servers stopped successfully!${NC}"
