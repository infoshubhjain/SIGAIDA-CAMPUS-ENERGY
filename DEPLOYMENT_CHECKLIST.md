# Deployment Checklist

Use this checklist to ensure everything is ready for deployment.

## Pre-Deployment (Before You Start)

- [ ] All code is committed to git
- [ ] Read QUICK_DEPLOY.md
- [ ] Docker Desktop is installed (if deploying locally)
- [ ] GitHub account created (for cloud deployment)

## Local Testing

- [ ] Run `./deploy-local.sh`
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend API responds at http://localhost:8000/api/health
- [ ] API documentation visible at http://localhost:8000/api/docs
- [ ] No errors in `docker-compose logs`

## GitHub Preparation

- [ ] GitHub account created
- [ ] New repository created: `SIGAIDA-CAMPUS-ENERGY`
- [ ] Code pushed to main branch:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/SIGAIDA-CAMPUS-ENERGY.git
  git push -u origin main
  ```
- [ ] All commits visible on GitHub
- [ ] .gitignore includes .env files

## Railway.app Deployment

- [ ] Railway.app account created (https://railway.app)
- [ ] GitHub authorized with Railway
- [ ] New project created
- [ ] Backend service deployed:
  - [ ] Selected correct repository
  - [ ] Dockerfile auto-detected
  - [ ] Environment variables set:
    - [ ] DATABASE_PATH=/app/data_collection/campus_data.db
    - [ ] PYTHONUNBUFFERED=1
    - [ ] ENVIRONMENT=production
  - [ ] Volume attached for database persistence
  - [ ] Deployment successful
- [ ] Frontend service deployed:
  - [ ] Added to same project
  - [ ] Environment variables set:
    - [ ] NEXT_PUBLIC_API_URL=<backend-url>
    - [ ] NODE_ENV=production
  - [ ] Deployment successful
- [ ] Both services showing "Healthy"
- [ ] Public URLs assigned and working

## Vercel Deployment (Alternative)

- [ ] Vercel account created (https://vercel.com)
- [ ] GitHub authorized with Vercel
- [ ] Frontend project imported
- [ ] Environment variable set:
  - [ ] NEXT_PUBLIC_API_URL=<backend-url>
- [ ] Deployment successful
- [ ] Frontend accessible via Vercel URL

## Post-Deployment Verification

- [ ] Frontend loads without errors
- [ ] Can navigate between pages
- [ ] API calls work correctly
- [ ] API documentation accessible at /api/docs
- [ ] Health check endpoint responds
- [ ] No console errors in browser DevTools
- [ ] No errors in backend logs

## Environment Configuration

- [ ] .env.example reviewed
- [ ] Production .env created (locally) with:
  - [ ] DATABASE_PATH set correctly
  - [ ] API keys set (if needed)
  - [ ] ENVIRONMENT=production
- [ ] No sensitive data in git
- [ ] Environment variables in deployment platform

## Security Checklist

- [ ] HTTPS enabled (automatic on Railway/Vercel)
- [ ] CORS configured (if needed)
- [ ] Database is secure
- [ ] No API keys in code
- [ ] No passwords in git history
- [ ] .env file never committed

## Monitoring & Maintenance

- [ ] Bookmarked Railway/Vercel dashboard
- [ ] Set up log monitoring
- [ ] Tested error notifications (if configured)
- [ ] Documented backup procedures
- [ ] Know how to restart services
- [ ] Know how to check service status

## Documentation

- [ ] Team has access to QUICK_DEPLOY.md
- [ ] Team has access to DEPLOYMENT_GUIDE.md
- [ ] API documentation URL shared
- [ ] Deployment credentials stored securely
- [ ] Incident response plan documented

## Optional Enhancements

- [ ] Custom domain configured
- [ ] Email alerts set up
- [ ] Database backups automated
- [ ] Performance monitoring enabled
- [ ] Security scanning enabled
- [ ] Auto-scaling configured

## Sign-Off

- [ ] Project lead approval
- [ ] All checks completed
- [ ] Ready for production
- [ ] Date deployed: _______________
- [ ] Deployed by: ________________

---

## Troubleshooting Quick Reference

| Issue | Solution |
|-------|----------|
| Port in use | `lsof -i :8000` then `kill -9 <PID>` |
| DB not found | `touch data_collection/campus_data.db` |
| Can't reach backend | Check NEXT_PUBLIC_API_URL in .env |
| Build fails | `docker-compose build --no-cache` |
| Services won't start | `docker-compose logs` to see errors |
| CORS errors | Configure CORS in backend/main.py |

---

## Quick Commands

```bash
# Local development
./deploy-local.sh                    # Start everything locally
docker-compose logs -f               # Watch logs
docker-compose down                  # Stop everything

# Production
docker-compose -f docker-compose.prod.yml up -d  # Start prod
docker-compose -f docker-compose.prod.yml logs   # View logs

# Git
git push origin main                 # Push to GitHub
git status                           # Check git status
```

---

Last Updated: 2026-06-27
Status: Ready for Deployment ✅
