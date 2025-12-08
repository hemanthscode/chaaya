<div align="center">

# Chaaya

### *Where Light Meets Code*

**A full-stack photography portfolio platform built for serious photographers**

[Live Demo](https://chaaya.com) • [Documentation](./docs) • [API Reference](./docs/api.md)

![GitHub Stars](https://img.shields.io/github/stars/hemanthscode/chaaya?style=for-the-badge&logo=github&color=gold)
![Node Version](https://img.shields.io/badge/Node.js-18.17+-339933?style=for-the-badge&logo=node.js)
![React Version](https://img.shields.io/badge/React-18.0-61DAFB?style=for-the-badge&logo=react)

---

</div>
  
## 🎯 Overview

**Chaya** (छाया - *shadow/reflection* in Sanskrit) is a professional-grade photography portfolio platform designed to elegantly showcase, organize, and manage large photo collections. Born from the challenge of managing 5,000+ images across 200+ shoots, it combines the aesthetic sensibility photographers demand with the technical rigor developers respect.

### The Challenge

After years of weekend photography trips across India—from the monsoon-soaked temples of Chitrakoot to the golden hour ghats of Varanasi—I found myself drowning in thousands of unorganized images. Generic portfolio builders felt limiting. Custom solutions were either too simple or overcomplicated. Chaya emerged as the answer: a platform that thinks like a photographer but works like enterprise software.

### Core Philosophy

- **Photographer-First Design**: Every feature serves the creative workflow
- **Enterprise Performance**: Built to handle thousands of high-resolution images
- **Professional Aesthetics**: Because your portfolio is your first impression
- **Developer-Friendly**: Clean architecture, comprehensive docs, easy to extend

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 📸 Portfolio Frontend

- **Masonry Gallery** with infinite scroll
- **Advanced Search** by location, gear, date
- **Series/Collections** with custom ordering
- **Lightbox Viewer** with EXIF data
- **Social Engagement** (likes, views, shares)
- **Responsive Design** (mobile-first)
- **SEO Optimized** with dynamic meta tags

</td>
<td width="50%">

### ⚙️ Admin Dashboard

- **Bulk Upload** (100+ images at once)
- **Drag & Drop** series management
- **Real-time Analytics** and insights
- **Draft/Publish** workflow
- **Auto-tagging** with AI (optional)
- **Backup & Export** tools
- **Role-based Access** control

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js 18.17+
MongoDB 6.0+
npm 9+ or yarn
Cloudinary account (free tier works)
```

### Installation

```bash
# Clone the repository
git clone https://github.com/hemanthscode/chaaya.git
cd chaaya

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

**Access Points:**
- Portfolio: `http://localhost:3000`
- Admin Panel: `http://localhost:3000/admin`
- API: `http://localhost:5000/api/v1`

**Default Credentials:**
```
Email: admin@chaaya.com
Password: admin123
```

> ⚠️ **Security Note**: Change default credentials immediately in production

---

## 🏗️ Architecture

```mermaid
graph LR
    A[React SPA] -->|REST API| B[Express Server]
    B --> C[MongoDB]
    B --> D[Cloudinary CDN]
    B --> E[Redis Cache]
    A --> F[Vercel Edge]
    B --> G[Background Jobs]
    
    style A fill:#61DAFB
    style B fill:#339933
    style C fill:#47A248
    style D fill:#3448C5
    style E fill:#DC382D
```

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite 5, TailwindCSS 3.4, React Query, Framer Motion |
| **Backend** | Node.js 18, Express 4, Mongoose 8, JWT, bcrypt |
| **Database** | MongoDB Atlas, Redis 7 (caching) |
| **Storage** | Cloudinary (images), AWS S3 (backups) |
| **DevOps** | Docker, GitHub Actions, Vercel, Render |

### Project Structure

```
chaaya/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── admin/      # Admin-specific components
│   │   │   └── gallery/    # Gallery components
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API integration
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Helper functions
│   └── public/             # Static assets
│
├── server/                 # Express backend
│   ├── src/
│   │   ├── models/         # Mongoose schemas
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation, etc.
│   │   ├── routes/         # API endpoints
│   │   └── utils/          # Server utilities
│   └── tests/              # Backend tests
│
├── docs/                   # Documentation
│   ├── api.md              # API reference
│   ├── deployment.md       # Deployment guide
│   └── contributing.md     # Contribution guidelines
│
└── docker-compose.yml      # Container orchestration
```

---

## 🎨 Key Features Deep Dive

### Series Management

Organize photos into cohesive stories. Perfect for travel series, client projects, or thematic collections.

```javascript
// Add images to a series
POST /api/v1/series/:seriesId/images
{
  "imageIds": ["img_123", "img_456"],
  "order": "manual" // or "date", "name"
}

// Reorder images
PATCH /api/v1/series/:seriesId/reorder
{
  "imageOrder": ["img_456", "img_123"]
}
```

**Features:**
- Drag-and-drop reordering
- Bulk image operations
- Cover image selection
- Draft/Published states
- Custom slug URLs

### Smart Gallery

Blazingly fast, infinitely scrollable, beautifully responsive.

**Technical Highlights:**
- Virtual scrolling for 1000+ images
- Progressive image loading (LQIP)
- Intersection Observer API
- CSS Grid masonry layout
- Prefetch on hover

### Analytics Dashboard

Understand what resonates with your audience.

**Metrics Tracked:**
- Page views by series/image
- Geographic distribution
- Device/browser stats
- Engagement heatmaps
- Search queries
- Export reports (CSV, PDF)

---

## 📱 API Reference

### Authentication

```bash
# Login
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@chaaya.com",
  "password": "admin123"
}

# Response includes JWT token
```

### Images

```bash
# Get all images (paginated)
GET /api/v1/images?page=1&limit=20&sort=-createdAt

# Upload image
POST /api/v1/images
Content-Type: multipart/form-data

# Search images
GET /api/v1/images/search?q=varanasi&category=landscape

# Get single image
GET /api/v1/images/:id
```

### Series

```bash
# Create series
POST /api/v1/series
{
  "title": "Monsoon Chronicles",
  "description": "Rain-soaked landscapes of India",
  "status": "draft"
}

# Add/remove images
POST /api/v1/series/:id/images/:imageId
DELETE /api/v1/series/:id/images/:imageId
```

> 📚 **Full API Documentation**: See [docs/api.md](./docs/api.md)

---

## 🔧 Configuration

### Environment Variables

```bash
# Server (.env)
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/chaaya
JWT_SECRET=your-256-bit-secret-key-here
JWT_EXPIRE=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Redis (optional, for caching)
REDIS_URL=redis://localhost:6379

# Client (.env)
VITE_API_URL=http://localhost:5000/api/v1
VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
```

### Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Create an upload preset (unsigned)
3. Enable auto-format and auto-quality
4. Set up transformation presets:
   - `thumbnail`: `w_400,h_400,c_fill`
   - `display`: `w_1200,q_auto`
   - `original`: No transformation

---

## 🚢 Deployment

### Docker (Recommended)

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Vercel + Render

**Frontend (Vercel):**
```bash
cd client
vercel --prod
```

**Backend (Render):**
1. Connect your GitHub repo
2. Select `server` as root directory
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build frontend
cd client
npm run build

# Build backend
cd server
npm run build

# Start production server
NODE_ENV=production npm start
```

> 📖 **Detailed Guide**: See [docs/deployment.md](./docs/deployment.md)

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests (Playwright)
npm run test:e2e

# Coverage report
npm run test:coverage
```

**Current Coverage:**
- Unit: 94%
- Integration: 87%
- E2E: 78%

---

## 📊 Performance

| Metric | Score | Target |
|--------|-------|--------|
| Lighthouse Performance | 98/100 | 95+ |
| First Contentful Paint | 0.9s | <1.2s |
| Time to Interactive | 1.8s | <2.5s |
| Total Bundle Size | 148kb | <200kb |
| API Response Time (p95) | 45ms | <100ms |
| CDN Cache Hit Rate | 96% | 95%+ |

**Optimizations Applied:**
- Code splitting & lazy loading
- Image optimization (WebP, AVIF)
- Server-side caching (Redis)
- CDN delivery (Cloudinary)
- Compression (Brotli)
- Tree shaking

---

## 🤝 Contributing

Contributions are welcome! Whether you're a photographer with feature ideas or a developer with code improvements, there's a place for you.

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Write/update tests
5. Commit: `git commit -m 'Add amazing feature'`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Areas We're Looking For Help

- 🌐 Internationalization (i18n)
- 📱 Mobile app (React Native)
- 🤖 AI-powered tagging
- 🎨 Theme customization
- 📈 Advanced analytics
- 🔍 Better search algorithms

> 📋 **Contributing Guide**: See [docs/contributing.md](./docs/contributing.md)

---

## 🐛 Known Issues

- Safari: Occasional lightbox rendering delay
- Mobile: Upload progress not always accurate
- IE11: Not supported (use modern browsers)

[Report a bug](https://github.com/hemanthscode/chaaya/issues)


---

## 🙏 Acknowledgments

This project wouldn't exist without:

- **Cloudinary** - Image CDN and transformation
- **MongoDB Atlas** - Generous free tier
- **TailwindCSS** - Rapid UI development
- **Vite** - Lightning-fast dev experience
- **The Photography Community** - Endless inspiration

---

## 📬 Contact

**Project Maintainer**: Your Name

- Website: [chaaya.com](https://chaaya.com)
- GitHub: [@hemanthscode](https://github.com/hemanthscode)
- Twitter: [@ChaayaGallery](https://x.com/ChaayaGallery)
- Email: hello@chaaya.com

---

<div align="center">

### 📸 Built with passion by a photographer, for photographers

**If this project helped you, consider starring the repo ⭐**

*"Photography is the story I fail to put into words." — Destin Sparks*

---

![Footer Wave](https://via.placeholder.com/1000x4/94a3b8/94a3b8)

</div>