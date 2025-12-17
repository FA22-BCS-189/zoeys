# 🚀 Deployment Guide - Zoey's E-Commerce

This guide will help you deploy your website to production so it's accessible on the internet.

## 📦 What You'll Deploy

- **Frontend**: Your React website (Customer-facing)
- **Backend**: Your API server (Handles orders & products)
- **Database**: Already set up (Neon/Supabase)

## 🌐 Step 1: Deploy Frontend (Vercel - FREE)

Vercel is perfect for Next.js/React apps and offers free hosting.

### Prerequisites:
- GitHub account
- Your code pushed to GitHub

### Push to GitHub (if not already done):

```bash
# In your project root
git init
git add .
git commit -m "Initial commit - Zoey's E-commerce"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR-USERNAME/zoeys-ecommerce.git
git push -u origin main
```

### Deploy on Vercel:

1. Go to https://vercel.com
2. Click "Sign Up" and use GitHub
3. Click "Add New Project"
4. Import your `zoeys-ecommerce` repository
5. **Configure Project:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add Environment Variables:**
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
   (You'll get this URL after deploying backend in Step 2)
7. Click "Deploy"

✅ Your frontend will be live at: `https://your-project.vercel.app`

## 🔧 Step 2: Deploy Backend (Railway - $5/month)

Railway is great for Node.js backends with PostgreSQL.

### Option A: Railway.app (Recommended)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose your `zoeys-ecommerce` repository
6. Railway will detect it's a Node.js app
7. **Configure:**
   - Root Directory: `backend`
   - Start Command: `npm start`
8. **Add Environment Variables:**
   Click on your service → Variables → Add all from your `.env`:
   ```
   DATABASE_URL=your-neon-connection-string
   PORT=5000
   NODE_ENV=production
   ADMIN_PASSWORD=your-secure-password
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=zaiinabsanaullah@gmail.com
   EMAIL_PASSWORD=your-app-password
   BUSINESS_EMAIL=zaiinabsanaullah@gmail.com
   BUSINESS_PHONE=+923300390222
   BUSINESS_WHATSAPP=+923300390222
   FRONTEND_URL=https://your-project.vercel.app
   ```
9. Click "Deploy"

✅ Your backend will be live at: `https://your-backend.railway.app`

### Option B: Render.com (FREE tier available)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. **Configure:**
   - Name: `zoeys-backend`
   - Root Directory: `backend`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`
6. Add all environment variables (same as Railway above)
7. Click "Create Web Service"

## 🔗 Step 3: Connect Frontend to Backend

1. Go back to your Vercel project
2. Settings → Environment Variables
3. Update `VITE_API_URL` with your backend URL:
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```
4. Redeploy your frontend (Deployments → Click ⋯ → Redeploy)

## ✅ Step 4: Test Production Website

Visit your Vercel URL and test:
- [ ] Homepage loads
- [ ] Products display correctly
- [ ] Can navigate to product details
- [ ] Can place a test order
- [ ] Order confirmation email received

## 🎯 Step 5: Custom Domain (Optional)

### Buy a Domain:
- Go to https://pknIC.pk (for .pk domains) or
- Namecheap.com / GoDaddy.com (for .com domains)
- Search for: `zoeys.pk` or `zoeysfabric.com`
- Purchase (around $10-15/year)

### Connect to Vercel:
1. In Vercel project → Settings → Domains
2. Add your custom domain
3. Follow Vercel's instructions to update DNS settings
4. Wait 24-48 hours for DNS propagation

✅ Your site will be accessible at: `https://yourdomainname.com`

## 🛡️ Security Checklist

Before going live, ensure:
- [ ] Strong ADMIN_PASSWORD set in backend .env
- [ ] Email credentials are secure (use App Passwords)
- [ ] DATABASE_URL is not exposed publicly
- [ ] HTTPS is enabled (automatic on Vercel/Railway)
- [ ] CORS is configured correctly (already set in backend)

## 📊 Monitoring Your Website

### Check Backend Health:
Visit: `https://your-backend-url.com/api/health`
Should show: `{"status": "ok", "message": "Zoey's Backend is running!"}`

### Monitor Orders:
Backend logs will show in Railway/Render dashboard

### Email Notifications:
Every order sends email to `zaiinabsanaullah@gmail.com`

## 🔄 Updating Your Website

When you make changes:

### Update Frontend:
1. Make changes in your code
2. Push to GitHub: `git push origin main`
3. Vercel auto-deploys! (takes 1-2 minutes)

### Update Backend:
1. Make changes in your code
2. Push to GitHub: `git push origin main`
3. Railway/Render auto-deploys! (takes 2-3 minutes)

## 💰 Cost Breakdown

| Service | Purpose | Cost |
|---------|---------|------|
| Neon Database | PostgreSQL | Free (0.5GB) |
| Vercel | Frontend Hosting | Free |
| Railway | Backend Hosting | $5/month |
| Domain | yoursite.com | $10-15/year |
| **Total** | | **$5/month + domain** |

## 🆘 Troubleshooting

### Frontend shows "Cannot connect to API"
- Check VITE_API_URL is correct in Vercel env variables
- Verify backend is running (check health endpoint)
- Check backend CORS settings include your frontend URL

### Backend won't start
- Check all environment variables are set in Railway/Render
- Verify DATABASE_URL is correct
- Check logs in Railway/Render dashboard

### Orders not being created
- Check backend logs for errors
- Verify database connection is working
- Test backend health endpoint

### Emails not sending
- Verify EMAIL_USER and EMAIL_PASSWORD in backend env
- Check Gmail allows "less secure apps" or use App Password
- Check spam folder

## ✨ Post-Deployment Tasks

- [ ] Test all features on production
- [ ] Place a test order
- [ ] Share your website URL with friends/family
- [ ] Add your site to Google Search Console
- [ ] Set up Google Analytics (optional)
- [ ] Create social media accounts
- [ ] Start marketing!

## 🎉 Congratulations!

Your e-commerce website is now live on the internet! 

**Your URLs:**
- Website: `https://your-project.vercel.app`
- Backend: `https://your-backend.railway.app`
- Database: Hosted on Neon/Supabase

Share your website and start selling! 🛍️

---

Need help? Check backend logs in Railway/Render for detailed error messages.
