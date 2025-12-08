# 🚀 Chaya Setup Guide

**Photography Portfolio Platform**  
*Node.js + React + MongoDB + Cloudinary*

## 📋 Prerequisites

```
Node.js 18.17+
npm 9+
MongoDB 6+ (Atlas recommended)
Cloudinary account
Git
```

## 🛠️ Quick Start (Docker)

```
# Clone & Install
git clone <repo>
cd chaaya
npm install

# Copy env files
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env

# Start everything
docker-compose up -d

# Access:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000/api/v1
# Admin:    http://localhost:3000/admin
```

## ⚙️ Manual Setup

### 1. Backend Setup

```
cd server
npm install
cp .env.example .env

# MongoDB Atlas URL
MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/chaaya"

# JWT Secret (32+ chars)
JWT_SECRET="your-super-secret-jwt-key-here-minimum-32-characters"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

npm run dev
```

### 2. Frontend Setup

```
cd client
npm install
cp .env.example .env

# API Base URL
VITE_API_URL=http://localhost:5000/api/v1

npm run dev
```

### 3. Environment Variables

#### Server `.env`
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30d

CLOUDINARY_CLOUD_NAME=dxabc123
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=your_secret

ADMIN_EMAIL=admin@chaaya.com
ADMIN_PASSWORD=admin123
```

#### Client `.env`
```
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Chaya
VITE_APP_VERSION=1.0.0
```

## 🧪 Database Seeding

```
# Backend
cd server
npm run seed

# Creates:
# - 1 Admin user (admin@chaaya.com / admin123)
# - 5 Sample categories
# - 50 Sample images
# - 3 Sample series
```

## 📱 Default Login

```
Email: admin@chaaya.com
Password: admin123
```

**Admin Panel:** `http://localhost:3000/admin/dashboard`

## 🚀 Production Deployment

### Environment
```
NODE_ENV=production
```

### PM2 (Recommended)
```
npm install -g pm2
pm2 start server/ecosystem.config.js
pm2 startup
pm2 save
```

### Nginx Config
```
server {
    listen 80;
    server_name chaaya.com;
    
    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🔍 File Structure

```
chaaya/
├── client/          # React + Vite + Tailwind
├── server/          # Node + Express + MongoDB
├── docs/            # 📄 This documentation
└── docker-compose.yml
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `CORS Error` | Check `VITE_API_URL` |
| `JWT Error` | Verify `JWT_SECRET` |
| `Upload Fail` | Check Cloudinary credentials |
| `MongoDB Connect` | Whitelist IP in Atlas |
| `Port in Use` | `killall node` or change PORT |

## 📊 Commands

```
# Development
npm run dev          # Both client + server
npm run dev:client   # Frontend only
npm run dev:server   # Backend only

# Production
npm run build        # Build frontend
npm run start        # Production server

# Database
npm run seed         # Seed data
npm run migrate      # Run migrations
```

---
*© 2025 Chaya Photography Platform | Production Ready*


