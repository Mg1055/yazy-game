# 🚀 Deployment Guide

## Prerequisites ✅

- [x] Supabase project created and configured
- [x] Database schema deployed (`supabase-schema.sql`)
- [x] App tested locally and working
- [x] Build process successful

## Environment Variables 📝

You'll need these for Vercel:

```
VITE_SUPABASE_URL=https://wtgplwthozxhyjgqfxno.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Z3Bsd3Rob3p4aHlqZ3FmeG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjMyODAsImV4cCI6MjA2OTAzOTI4MH0.DRwcRwEyURS-QoykI5g9twYx4B3FDkhGPEy2lEDBWg4
```

## Vercel Deployment Steps 🔥

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. **Configure Environment Variables:**
   - `VITE_SUPABASE_URL`: `https://wtgplwthozxhyjgqfxno.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0Z3Bsd3Rob3p4aHlqZ3FmeG5vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0NjMyODAsImV4cCI6MjA2OTAzOTI4MH0.DRwcRwEyURS-QoykI5g9twYx4B3FDkhGPEy2lEDBWg4`
5. Click "Deploy"

### 3. Domain Configuration (Optional)
- Vercel will give you a `.vercel.app` domain
- You can add a custom domain later if desired

## Post-Deployment Testing ✅

1. **Test Game Creation**: Create a new game
2. **Test Multiplayer**: Open in incognito/another browser
3. **Test Real-time**: Verify turns update instantly
4. **Test Mobile**: Check responsive design

## Troubleshooting 🔧

**Build Errors:**
- Check environment variables are set correctly
- Verify Supabase project is active

**Real-time Issues:**
- Check Supabase real-time is enabled
- Verify database permissions

**Game Not Loading:**
- Check browser console for errors
- Verify Supabase URL and key are correct

## Success! 🎉

Once deployed, share your game URL with friends and start playing!

Example URL: `https://your-app-name.vercel.app` 
