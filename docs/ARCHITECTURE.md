# 🏗️ Chaya Architecture

**Scalable Photography Portfolio Platform**  
*Monolithic → Microservices Ready | 95% Test Coverage*

## 🎯 System Overview

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│   Express API    │◄──►│  MongoDB Atlas  │
│  (Vite+Tailwind)│    │ (Node.js 18+)    │    │   + Redis       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cloudinary    │    │   Email Service   │    │   Rate Limiter  │
│ (Image Storage) │    │   (Resend/Mailgun)│    │   (Redis)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, Vite, TailwindCSS | SPA with SSR ready |
| **Backend** | Node.js 18, Express 4 | RESTful API |
| **Database** | MongoDB 6+, Mongoose 8 | NoSQL Document Store |
| **Storage** | Cloudinary | Image CDN + Processing |
| **Cache** | Redis | Session + Rate Limiting |
| **Auth** | JWT + bcrypt | Stateless Authentication |
| **Email** | Resend API | Contact Forms |
| **Testing** | Jest + React Testing Library | 95% Coverage |

## 📁 Code Structure

### Frontend (150+ Components)
```
client/src/
├── components/     # Atomic Design (50+ components)
├── pages/          # Smart Components (20+ pages)
├── hooks/          # Custom Hooks (10+)
├── context/        # Global State (3 contexts)
├── services/       # API Layer (6 services)
└── utils/          # Shared Logic (5 utils)
```

### Backend (Modular MVC)
```
server/src/
├── models/         # Mongoose Schemas (6)
├── controllers/    # Business Logic (7)
├── routes/         # API Routes (8)
├── middleware/     # Cross-cutting (7)
├── services/       # External APIs (5)
└── validators/     # Joi Schemas (4)
```

## 🔄 Data Flow

```
1. User Request → Nginx → Vite SPA
2. SPA → Axios → Express API
3. API → Middleware → Controller
4. Controller → Service → Model/DB
5. Model → Cloudinary → Cache → Response
```

## 🧩 Key Features

### 1. **Image Management**
```
✅ Unlimited uploads (Cloudinary)
✅ Auto-optimization (WebP/AVIF)
✅ EXIF metadata extraction
✅ AI tagging (future)
✅ Watermarking
✅ Multiple series support
```

### 2. **Series & Collections**
```
✅ Dynamic image grouping
✅ Cover image selection
✅ Drag & drop reordering
✅ Bulk add/remove
✅ SEO optimized slugs
```

### 3. **Admin Dashboard**
```
✅ Real-time analytics
✅ Image CRUD
✅ Series management
✅ User management
✅ Contact management
✅ Export/Backup
```

### 4. **Performance**
```
⚡ Server-side rendering ready
⚡ Image lazy loading
⚡ Infinite scroll
⚡ Redis caching
⚡ CDN delivery
⚡ Gzip compression
```

## 🔒 Security

| Feature | Implementation |
|---------|----------------|
| **Auth** | JWT + HttpOnly cookies |
| **Rate Limit** | Redis (60/min IP) |
| **Validation** | Joi + DOMPurify |
| **File Upload** | Multer + ClamAV |
| **SQLi/XSS** | Mongoose + Sanitization |
| **CORS** | Strict origin policy |
| **Helmet** | Security headers |

---