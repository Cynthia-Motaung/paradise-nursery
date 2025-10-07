

# 🚀 Deployment Guide

## Vercel Deployment

### Prerequisites
- Vercel account connected to GitHub
- Auth0 application configured

### Automatic Deployment (Recommended)
1. Push code to GitHub main branch
2. Vercel automatically deploys on push
3. Check deployment at: `https://paradise-nursery.vercel.app`

### Environment Variables in Vercel
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add these variables: 
   1. REACT_APP_AUTH0_DOMAIN
   2. REACT_APP_AUTH0_CLIENT_ID
   3. REACT_APP_LOGOUT_REDIRECT_URL (optional)

### Production Checklist
- Environment variables set in Vercel
- Auth0 URLs updated with production domain
- Custom domain configured (if needed)
- SSL certificate active
- All features tested in production
   
## Troubleshooting
###  Build Fails
-  Check environment variables
- Verify all dependencies in package.json
- Check console for build errors

### Authentication Issues
- Verify Auth0 callback URLs
- Check environment variables match
- Test both local and production

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --production
