# Zoey's E-Commerce Website

Handcrafted embroidered fabric pieces from Bahawalpur, Pakistan.

## 🚀 Quick Start Guide

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (we'll set this up)
- Git installed

### Setup Steps

#### 1. Database Setup (5 minutes)
Choose ONE option:

**Option A: Neon (Recommended - Free)**
1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project → name it "zoeys-db"
4. Copy the connection string (looks like: `postgresql://user:pass@ep-xxx.neon.tech/zoeys`)

**Option B: Local PostgreSQL**
1. Install PostgreSQL from https://www.postgresql.org/download/
2. Create database: `createdb zoeys_db`
3. Connection string: `postgresql://localhost:5432/zoeys_db`

#### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and add your database connection string
npm run setup-db    # Creates tables
npm run seed        # Adds your 53 products
npm start           # Starts backend on http://localhost:5000
```

#### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev         # Starts frontend on http://localhost:5173
```

#### 4. Admin Panel Access
- URL: http://localhost:5173/admin
- Default password: `zoeys2025` (change in backend/.env)

### 📁 Project Structure
```
zoeys-ecommerce/
├── frontend/           # React app (Vite)
│   ├── src/
│   │   ├── components/ # Reusable components
│   │   ├── pages/      # Page components
│   │   ├── modules/    # Feature modules (Products, Orders, etc.)
│   │   ├── utils/      # Helper functions
│   │   └── assets/     # Images, fonts
│   └── package.json
├── backend/            # Express API
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── models/     # Database models (Prisma)
│   │   ├── controllers/# Business logic
│   │   ├── middleware/ # Auth, validation
│   │   └── utils/      # Helpers
│   └── package.json
└── README.md
```

## 🎨 Features

### Customer Features
- Browse 9 collections of embroidered fabrics
- Filter by collection, price, color
- View detailed product information
- Place orders (COD)
- Contact via WhatsApp/Email
- Mobile-responsive design

### Admin Features
- Manage products (CRUD)
- View all orders
- Update order status
- Update stock availability

## 📱 Collections
1. Lawn Pakka Tanka (10 items)
2. Cut Dana (6 items)
3. Paper Lawn Shadow Work (5 items)
4. Paper Lawn Tarkashi (8 items)
5. Shalwar (2 items)
6. Cotton Net Chicken Kaari (6 items)
7. Tarkashi & Pakka Tanka All Over (7 items)
8. Cotton Net Pakka Tanka All Over (3 items)
9. Embellished (6 items)

## 🚢 Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Set build command: `cd frontend && npm run build`
5. Set output directory: `frontend/dist`
6. Add environment variable: `VITE_API_URL=your-backend-url`

### Backend (Railway/Render)
1. Go to https://railway.app or https://render.com
2. Connect GitHub repository
3. Select `backend` folder
4. Add environment variables from `.env`
5. Deploy!


## 🔧 Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, Prisma ORM
- **Database**: PostgreSQL
- **Payments**: COD only (expandable)

---
Built with ❤️ for Bahawalpur heritage craftsmanship
