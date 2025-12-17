# 🚀 Complete Setup Guide - Zoey's E-Commerce

This guide will help you set up and run your complete e-commerce website.

## 📋 Prerequisites

Before you begin, make sure you have:
- [ ] Node.js 18 or higher installed ([Download](https://nodejs.org/))
- [ ] A code editor (VS Code recommended)
- [ ] Git installed (optional but recommended)

## 🗄️ Step 1: Database Setup (5 minutes)

You need a PostgreSQL database. Choose ONE option:

### Option A: Neon (Recommended - FREE & Easy)

1. Go to https://neon.tech
2. Click "Sign Up" and use your GitHub account
3. Click "Create Project"
4. Name it "zoeys-db"
5. Click "Create Project"
6. Copy the connection string that appears (looks like: `postgresql://user:pass@ep-xxx.neon.tech/zoeys`)
7. Save this connection string - you'll need it in Step 2!

### Option B: Supabase (Also FREE & Easy)

1. Go to https://supabase.com
2. Sign up and create a new project
3. Go to Settings → Database
4. Copy the "Connection String" (URI format)

### Option C: Local PostgreSQL

If you prefer to run PostgreSQL locally:
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create a database: `createdb zoeys_db`
3. Your connection string: `postgresql://localhost:5432/zoeys_db`

## ⚙️ Step 2: Backend Setup

Open your terminal/command prompt:

```bash
# Navigate to backend folder
cd backend

# Install dependencies (takes 2-3 minutes)
npm install

# Create environment file
cp .env.example .env
```

Now **IMPORTANT**: Open the `.env` file in your text editor and:

1. Paste your database connection string:
   ```
   DATABASE_URL="your-connection-string-here"
   ```

2. Add your email for order notifications:
   ```
   EMAIL_USER=zaiinabsanaullah@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ```

   **To get Gmail App Password:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification
   - Go to App Passwords
   - Generate a new app password
   - Copy and paste it in EMAIL_PASSWORD

3. Save the `.env` file

Now run these commands:

```bash
# Generate Prisma client
npx prisma generate

# Create database tables
npm run setup-db

# Add all 53 products to database
npm run seed

# Start the backend server
npm start
```

✅ You should see: "Zoey's E-Commerce Backend Server Running on: http://localhost:5000"

**Keep this terminal window open!**

## 🎨 Step 3: Frontend Setup

Open a **NEW** terminal window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies (takes 2-3 minutes)
npm install

# Start the development server
npm run dev
```

✅ You should see: "Local: http://localhost:5173"

## 🎉 Step 4: Test Your Website

1. Open your browser
2. Go to: http://localhost:5173
3. You should see your beautiful Zoey's website!

### Test Checklist:
- [ ] Home page loads with featured products
- [ ] Click "Shop" - see all 53 products
- [ ] Click on a collection in the menu
- [ ] Click on a product to see details
- [ ] Try placing a test order
- [ ] Check your email for order notification

## 🛠️ Troubleshooting

### Backend won't start
- Check your `.env` file has the correct DATABASE_URL
- Make sure PostgreSQL database is accessible
- Run `npm install` again

### Frontend shows errors
- Make sure backend is running first (http://localhost:5000)
- Run `npm install` in frontend folder again
- Clear browser cache and reload

### "Cannot connect to database"
- Verify your DATABASE_URL is correct
- Check your internet connection (for Neon/Supabase)
- Make sure there are no extra spaces in .env file

### Orders not sending emails
- Check EMAIL_USER and EMAIL_PASSWORD in .env
- Make sure you used an App Password for Gmail
- Check spam folder for test emails

## 📱 What's Next?

### Add Real Product Images
1. Upload images to Cloudinary (free account at https://cloudinary.com)
2. Use the admin panel to update products with real image URLs

### Deploy Your Website
See `DEPLOYMENT.md` for instructions on deploying to production

### Customize Design
- Colors: Edit `frontend/tailwind.config.js`
- Fonts: Edit `frontend/src/styles/index.css`
- Content: Edit page files in `frontend/src/pages/`

## 🆘 Need Help?

If you're stuck:
1. Check the error message carefully
2. Make sure both backend and frontend are running
3. Verify all environment variables are set correctly
4. Check the README.md for additional information

## 🎊 Success!

If everything is working:
- ✅ Backend running on http://localhost:5000
- ✅ Frontend running on http://localhost:5173
- ✅ Database connected and seeded with products
- ✅ You can browse products and place orders

**Congratulations! Your e-commerce website is ready!** 🎉

---

**Next Steps:**
1. Add real product images
2. Test the checkout flow thoroughly
3. Customize the About page content
4. Deploy to production (see DEPLOYMENT.md)
