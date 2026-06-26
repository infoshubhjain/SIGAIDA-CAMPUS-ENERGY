#!/bin/bash

# SIGAIDA Campus Energy - Production Deployment Script
# Deployment to Railway.app or own server

set -e

echo "=================================="
echo "SIGAIDA Campus Energy"
echo "Production Deployment"
echo "=================================="
echo ""

# Configuration
BACKEND_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8000}"
ENVIRONMENT="${ENVIRONMENT:-production}"

echo "Configuration:"
echo "  Backend URL: $BACKEND_URL"
echo "  Environment: $ENVIRONMENT"
echo ""

# Check git status
echo "📋 Checking git status..."
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. Consider committing before deployment."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "🔍 Running tests..."
echo "  (Add test commands here)"

echo ""
echo "📦 Building Docker images for production..."
docker-compose -f docker-compose.prod.yml build

echo ""
echo "✅ Build complete!"
echo ""
echo "Next steps:"
echo ""
echo "Option 1: Deploy to Railway"
echo "  1. Install Railway CLI: npm i -g @railway/cli"
echo "  2. Login: railway login"
echo "  3. Connect repo: railway init"
echo "  4. Deploy: railway up"
echo ""
echo "Option 2: Run locally with production config"
echo "  docker-compose -f docker-compose.prod.yml up -d"
echo ""
echo "Option 3: Push to server and run"
echo "  git push origin main"
echo "  # Then SSH to your server and:"
echo "  # docker-compose -f docker-compose.prod.yml pull"
echo "  # docker-compose -f docker-compose.prod.yml up -d"
echo ""
