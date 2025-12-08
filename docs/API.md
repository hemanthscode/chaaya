
# 🖼️ Chaya API Documentation

**RESTful API for Photography Portfolio Platform**  
*Version 1.0.0 | Built with Node.js + Express + MongoDB*

## 📖 Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Images](#images)
- [Series](#series)
- [Categories](#categories)
- [Auth](#auth)
- [Upload](#upload)
- [Contact](#contact)
- [Analytics](#analytics)
- [Error Codes](#error-codes)

## 🏠 Base URL
```
https://api.chaaya.com/v1
```

## 🔐 Authentication
**JWT Bearer Token**

```
Authorization: Bearer <token>
```

**Admin-only endpoints require `isAdmin: true`**

## 🖼️ Images

### Get All Images
`GET /api/v1/images`
- **Query**: `?page=1&limit=20&status=published&category=slug&sortBy=createdAt&order=desc`
```
Response: {
  "success": true,
  "data": {
    "images": [...],
    "pagination": { "page": 1, "limit": 20, "total": 150 }
  }
}
```

### Search Images
`GET /api/v1/images/search?q=landscape&page=1&limit=20`
```
Response: {
  "success": true,
  "data": {
    "images": [...],
    "query": "landscape"
  }
}
```

### Get Image by ID
`GET /api/v1/images/:id`

### Get Images by Category
`GET /api/v1/images/category/:slug`

### Get Images by Series
`GET /api/v1/images/series/:slug`

### Get Featured Images
`GET /api/v1/images/featured?limit=10`

### Toggle Like
`POST /api/v1/images/:id/like`
```
{
  "action": "like" // or "unlike"
}
```

**Admin Only:**
```
PUT /api/v1/images/:id
DELETE /api/v1/images/:id
```

## 📁 Series

### Get All Series
`GET /api/v1/series?page=1&limit=10&status=published&featured=true`
```
Response: {
  "success": true,
  "data": {
    "series": [
      {
        "_id": "...",
        "title": "Urban Nights",
        "slug": "urban-nights",
        "thumbnailUrl": "...",
        "imageCount": 24,
        "views": 1567,
        "status": "published",
        "featured": true
      }
    ]
  }
}
```

### Get Series by Slug
`GET /api/v1/series/:slug`

### Add Image to Series
`POST /api/v1/series/:seriesId/images/:imageId`

### Remove Image from Series
`DELETE /api/v1/series/:seriesId/images/:imageId`

### Reorder Series Images
`PUT /api/v1/series/:id/reorder`
```
{
  "imageIds": ["id1", "id2", "id3"]
}
```

**Admin Only:**
```
POST /api/v1/series
PUT /api/v1/series/:id
DELETE /api/v1/series/:id
```

## 🏷️ Categories

```
GET /api/v1/categories
GET /api/v1/categories/:slug
POST /api/v1/categories
PUT /api/v1/categories/:id
DELETE /api/v1/categories/:id
```

## 👤 Auth

```
POST /api/v1/auth/register
POST /api/v1/auth/login
GET /api/v1/auth/profile
```

## 📤 Upload

```
POST /api/v1/upload/images
- Content-Type: multipart/form-data
- Files: image (multiple)
```

## ✉️ Contact

```
POST /api/v1/contact
GET /api/v1/contact (admin)
DELETE /api/v1/contact/:id (admin)
```

## 📊 Analytics

```
GET /api/v1/analytics/dashboard (admin)
GET /api/v1/analytics/images (admin)
```

## ❌ Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Validation failed |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Admin access required |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 413 | Payload Too Large | File too big |
| 422 | Validation Error | Data validation failed |
| 500 | Server Error | Internal server error |

## 🛡️ Rate Limiting
- **60 requests/minute** per IP
- **Upload: 5MB max file size**

## 🔗 CORS
- `http://localhost:3000`
- `https://chaaya.com`
- `https://*.chaaya.com`

---
*© 2025 Chaya Photography Platform*


