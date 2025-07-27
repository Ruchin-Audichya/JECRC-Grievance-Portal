# JECRC Grievance Portal - Deployment Guide

This project is ready for deployment on both **Vercel** and **Netlify**. Follow the instructions below for your preferred platform.

## Quick Deploy Buttons

### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)

### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/YOUR_USERNAME/YOUR_REPO_NAME)

## Manual Deployment Instructions

### Vercel Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy via Vercel Dashboard:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect the framework (Vite)
   - Click "Deploy"

3. **Configuration:**
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)

### Netlify Deployment

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy via Netlify Dashboard:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose your GitHub repository
   - Build settings are automatically configured via `netlify.toml`
   - Click "Deploy site"

3. **Configuration (Auto-configured via netlify.toml):**
   - Build Command: `npm run build`
   - Publish Directory: `dist`
   - Node Version: 18

## Environment Variables

The project includes hardcoded Supabase configuration for demo purposes. In production, you might want to use environment variables:

### For Vercel:
- Go to Project Settings → Environment Variables
- Add: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### For Netlify:
- Go to Site Settings → Environment Variables
- Add: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Build Verification

Before deploying, verify the build works locally:

```bash
npm install
npm run build
npm run preview
```

## Project Structure

```
├── dist/                 # Build output (auto-generated)
├── public/              # Static assets
├── src/                 # Source code
├── netlify.toml         # Netlify configuration
├── vercel.json          # Vercel configuration
├── _redirects           # Netlify SPA routing
└── package.json         # Dependencies and scripts
```

## Features

- ✅ Vite + React + TypeScript
- ✅ Tailwind CSS + Shadcn/ui components
- ✅ Supabase integration
- ✅ React Router for SPA routing
- ✅ Responsive design
- ✅ Dark mode support
- ✅ Production-ready build optimization

## Troubleshooting

### Common Issues:

1. **Build fails:** Check Node.js version (requires Node 16+)
2. **Routing issues:** Ensure SPA redirects are configured (handled by config files)
3. **Environment variables:** Verify Supabase configuration

### Build Command Issues:
If build fails, try:
```bash
npm install --legacy-peer-deps
npm run build
```

## Support

For deployment issues:
- Vercel: [Vercel Docs](https://vercel.com/docs)
- Netlify: [Netlify Docs](https://docs.netlify.com)

---

🚀 **The project is fully configured and ready for deployment!**