#!/bin/bash

# SIGAIDA Campus Energy - Local Docker Deployment Script
# This script builds and runs the application using Docker Compose

set -e

echo "=================================="
echo "SIGAIDA Campus Energy"
echo "Local Docker Deployment"
echo "=================================="
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop from https://www.docker.com"
    exit 1
fi

echo "✓ Docker found: $(docker --version)"
echo ""

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi

echo "✓ Docker Compose found: $(docker-compose --version)"
echo ""

# Build images
echo "📦 Building Docker images..."
docker-compose build

echo ""
echo "🚀 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check if services are running
if docker-compose ps | grep -q "backend.*Up"; then
    echo "✓ Backend is running"
else
    echo "❌ Backend failed to start"
    docker-compose logs backend
    exit 1
fi

if docker-compose ps | grep -q "frontend.*Up"; then
    echo "✓ Frontend is running"
else
    echo "⚠ Frontend is starting (may take a moment)"
fi

echo ""
echo "=================================="
echo "✅ Deployment Complete!"
echo "=================================="
echo ""
echo "Access your application:"
echo "  📱 Frontend: http://localhost:3000"
echo "  🔧 Backend API: http://localhost:8000"
echo "  📚 API Docs: http://localhost:8000/api/docs"
echo ""
echo "View logs:"
echo "  docker-compose logs -f"
echo ""
echo "Stop services:"
echo "  docker-compose down"
echo ""
