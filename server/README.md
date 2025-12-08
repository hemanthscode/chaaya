# Chaya Photography Portfolio - Backend API

Professional photography portfolio backend built with Node.js, Express, and MongoDB.

## 🚀 Features

- **Authentication & Authorization** - JWT-based auth with role management
- **Image Management** - Upload, organize, and manage photos with metadata
- **Cloudinary Integration** - Cloud storage with automatic optimization
- **Series & Categories** - Organize photos into collections and categories
- **Contact Form** - Handle client inquiries with email notifications
- **Analytics Dashboard** - Track views, engagement, and comprehensive statistics
- **RESTful API** - Clean, well-documented endpoints
- **Security** - Helmet, rate limiting, CORS, input validation, XSS protection
- **Performance** - Compression, caching, optimized database queries
- **Image Processing** - Sharp integration for optimization and thumbnails
- **EXIF Data** - Automatic extraction of camera metadata

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **MongoDB** >= 5.0 (local) or MongoDB Atlas account
- **Cloudinary Account** (free tier available)
- **Gmail Account** (for email notifications via SMTP)

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chaya
```

### 2. Install Dependencies

```bash
cd server
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/chaya-portfolio
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chaya

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=noreply@chaya.com

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Seed the Database (Optional)

Create initial admin user and categories:

```bash
npm run seed
```

This will create:
- Admin user (email: `admin@chaya.com`, password: `Admin@123`)
- 6 default categories (Portrait, Landscape, Wildlife, Street, Architecture, Abstract)

### 5. Start the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`

## 📚 API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Response Format

All API responses follow this structure:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

Error responses:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error message",
  "errors": ["Details..."]
}
```

---

### Authentication Endpoints

#### Register User

```http
POST /api/v1/auth/register
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "confirmPassword": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": {
      "id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    },
    "token": "jwt_token_here"
  }
}
```

#### Login

```http
POST /api/v1/auth/login
```

**Body:**
```json
{
  "email": "admin@chaya.com",
  "password": "Admin@123"
}
```

#### Get Current User

```http
GET /api/v1/auth/me
Authorization: Bearer {token}
```

#### Update Profile

```http
PUT /api/v1/auth/profile
Authorization: Bearer {token}
```

**Body:**
```json
{
  "name": "Updated Name",
  "bio": "Professional photographer",
  "website": "https://example.com",
  "social": {
    "instagram": "username",
    "twitter": "username"
  }
}
```

#### Change Password

```http
PUT /api/v1/auth/password
Authorization: Bearer {token}
```

**Body:**
```json
{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass123",
  "confirmNewPassword": "NewPass123"
}
```

---

### Image Endpoints

#### Get All Images

```http
GET /api/v1/images?page=1&limit=20&sortBy=createdAt&order=desc
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sortBy` - Sort field (createdAt, views, likes, title)
- `order` - Sort order (asc, desc)
- `category` - Filter by category ID
- `series` - Filter by series ID
- `featured` - Filter featured images (true/false)
- `status` - Filter by status (published, draft, archived)
- `tags` - Filter by tags (comma-separated)
- `search` - Full-text search

**Response:**
```json
{
  "success": true,
  "message": "Images fetched successfully",
  "data": {
    "images": [...]
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

#### Get Single Image

```http
GET /api/v1/images/:id
```

#### Get Featured Images

```http
GET /api/v1/images/featured?limit=10
```

#### Get Images by Category

```http
GET /api/v1/images/category/:slug
```

#### Get Images by Series

```http
GET /api/v1/images/series/:slug
```

#### Search Images

```http
GET /api/v1/images/search?q=landscape
```

#### Update Image (Admin)

```http
PUT /api/v1/images/:id
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "category": "category_id",
  "series": "series_id",
  "tags": ["nature", "landscape"],
  "featured": true,
  "status": "published",
  "metadata": {
    "camera": "Canon EOS R5",
    "lens": "RF 24-70mm f/2.8",
    "iso": 400,
    "aperture": "f/2.8",
    "shutterSpeed": "1/500",
    "focalLength": "50mm",
    "location": "Iceland"
  }
}
```

#### Delete Image (Admin)

```http
DELETE /api/v1/images/:id
Authorization: Bearer {admin_token}
```

#### Like/Unlike Image

```http
POST /api/v1/images/:id/like
```

**Body:**
```json
{
  "action": "like"
}
```
OR
```json
{
  "action": "unlike"
}
```

---

### Upload Endpoints (Admin Only)

#### Upload Single Image

```http
POST /api/v1/upload/image
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data
```

**Form Data:**
- `image` (file) - Image file (JPG, PNG, WEBP, GIF)
- `title` (text) - Image title (required)
- `description` (text) - Image description
- `category` (text) - Category ID
- `series` (text) - Series ID
- `tags` (text) - Comma-separated tags
- `featured` (text) - true/false
- `status` (text) - published/draft/archived

#### Upload Multiple Images

```http
POST /api/v1/upload/images
Authorization: Bearer {admin_token}
Content-Type: multipart/form-data
```

**Form Data:**
- `images` (files) - Multiple image files (max 10)

---

### Category Endpoints

#### Get All Categories

```http
GET /api/v1/categories
```

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "...",
        "name": "Portrait",
        "slug": "portrait",
        "description": "...",
        "imageCount": 25,
        "order": 1
      }
    ]
  }
}
```

#### Get Category by Slug

```http
GET /api/v1/categories/:slug
```

#### Create Category (Admin)

```http
POST /api/v1/categories
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "name": "Night Photography",
  "slug": "night-photography",
  "description": "Low-light and night photography",
  "order": 7
}
```

#### Update Category (Admin)

```http
PUT /api/v1/categories/:id
Authorization: Bearer {admin_token}
```

#### Delete Category (Admin)

```http
DELETE /api/v1/categories/:id
Authorization: Bearer {admin_token}
```

---

### Series Endpoints

#### Get All Series

```http
GET /api/v1/series?page=1&limit=20
```

**Query Parameters:**
- `page`, `limit` - Pagination
- `category` - Filter by category
- `featured` - Filter featured series
- `status` - Filter by status (published/draft)

#### Get Series by Slug

```http
GET /api/v1/series/:slug
```

**Response includes all images in the series**

#### Create Series (Admin)

```http
POST /api/v1/series
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "title": "Iceland Journey",
  "slug": "iceland-journey",
  "description": "A photographic journey through Iceland",
  "category": "category_id",
  "coverImage": "image_id",
  "images": ["image_id_1", "image_id_2"],
  "featured": true,
  "status": "published"
}
```

#### Update Series (Admin)

```http
PUT /api/v1/series/:id
Authorization: Bearer {admin_token}
```

#### Delete Series (Admin)

```http
DELETE /api/v1/series/:id
Authorization: Bearer {admin_token}
```

#### Add Image to Series (Admin)

```http
POST /api/v1/series/:id/images/:imageId
Authorization: Bearer {admin_token}
```

#### Remove Image from Series (Admin)

```http
DELETE /api/v1/series/:id/images/:imageId
Authorization: Bearer {admin_token}
```

#### Reorder Series Images (Admin)

```http
PUT /api/v1/series/:id/reorder
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "imageIds": ["id1", "id2", "id3"]
}
```

---

### Contact Endpoints

#### Submit Contact Form

```http
POST /api/v1/contact
```

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Photography Inquiry",
  "message": "I would like to inquire about...",
  "phone": "+1234567890"
}
```

**Rate Limited:** 3 submissions per hour per IP

#### Get All Contacts (Admin)

```http
GET /api/v1/contact?page=1&limit=20&isRead=false
Authorization: Bearer {admin_token}
```

#### Get Single Contact (Admin)

```http
GET /api/v1/contact/:id
Authorization: Bearer {admin_token}
```

#### Mark as Read (Admin)

```http
PUT /api/v1/contact/:id/read
Authorization: Bearer {admin_token}
```

#### Mark as Replied (Admin)

```http
PUT /api/v1/contact/:id/replied
Authorization: Bearer {admin_token}
```

**Body:**
```json
{
  "notes": "Replied via email on..."
}
```

#### Delete Contact (Admin)

```http
DELETE /api/v1/contact/:id
Authorization: Bearer {admin_token}
```

---

### Analytics Endpoints (Admin Only)

#### Get Dashboard Statistics

```http
GET /api/v1/analytics/dashboard
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "images": {
        "total": 150,
        "published": 120,
        "draft": 30
      },
      "series": 15,
      "categories": 6,
      "engagement": {
        "totalViews": 25000,
        "totalLikes": 1500
      },
      "today": {
        "pageViews": 350,
        "imageViews": 180,
        "contactSubmissions": 3
      },
      "unreadContacts": 5,
      "popularImages": [...]
    }
  }
}
```

#### Get Recent Analytics

```http
GET /api/v1/analytics/recent?days=7
Authorization: Bearer {admin_token}
```

#### Get Analytics by Date Range

```http
GET /api/v1/analytics/range?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer {admin_token}
```

---

### Health Check

```http
GET /api/v1/health
```

**Response:**
```json
{
  "success": true,
  "message": "Chaya API is running",
  "timestamp": "2025-12-08T10:40:00.000Z"
}
```

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Getting a Token

1. Register a new user or login with existing credentials
2. Include the token in subsequent requests:

```
Authorization: Bearer your_jwt_token_here
```

### Token Expiry

- Default expiry: 7 days
- Tokens can be refreshed using `/api/v1/auth/refresh`

### Roles

- **user** - Regular user (limited access)
- **admin** - Full access to all endpoints

---

## 📦 NPM Scripts

```bash
# Development
npm run dev          # Start development server with nodemon

# Production
npm start            # Start production server

# Database
npm run seed         # Seed database with initial data
npm run backup       # Create database backup

# Testing
npm test             # Run tests (when configured)
```

---

## 🏗️ Project Structure

```
server/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.js      # MongoDB connection
│   │   ├── cloudinary.js    # Cloudinary setup
│   │   ├── multer.js        # File upload config
│   │   └── env.js           # Environment variables
│   │
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   ├── Image.js
│   │   ├── Series.js
│   │   ├── Category.js
│   │   ├── Contact.js
│   │   └── Analytics.js
│   │
│   ├── controllers/         # Route controllers
│   │   ├── authController.js
│   │   ├── imageController.js
│   │   ├── seriesController.js
│   │   ├── categoryController.js
│   │   ├── uploadController.js
│   │   ├── contactController.js
│   │   └── analyticsController.js
│   │
│   ├── routes/              # API routes
│   │   ├── index.js         # Main router
│   │   ├── authRoutes.js
│   │   ├── imageRoutes.js
│   │   ├── seriesRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── uploadRoutes.js
│   │   ├── contactRoutes.js
│   │   └── analyticsRoutes.js
│   │
│   ├── middleware/          # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   ├── validateRequest.js
│   │   ├── uploadMiddleware.js
│   │   ├── rateLimiter.js
│   │   └── corsConfig.js
│   │
│   ├── services/            # Business logic
│   │   ├── cloudinaryService.js
│   │   ├── imageProcessing.js
│   │   ├── emailService.js
│   │   ├── cacheService.js
│   │   └── analyticsService.js
│   │
│   ├── utils/               # Utility functions
│   │   ├── logger.js
│   │   ├── apiResponse.js
│   │   ├── validators.js
│   │   ├── generateToken.js
│   │   └── helpers.js
│   │
│   ├── validators/          # Request validators
│   │   ├── authValidator.js
│   │   ├── imageValidator.js
│   │   ├── seriesValidator.js
│   │   └── contactValidator.js
│   │
│   ├── constants/           # Application constants
│   │   ├── statusCodes.js
│   │   ├── messages.js
│   │   └── enums.js
│   │
│   └── app.js               # Express app setup
│
├── uploads/                 # Temporary file uploads
├── logs/                    # Application logs
├── scripts/                 # Utility scripts
│   ├── seed.js
│   ├── backup.js
│   └── migrate.js
│
├── .env                     # Environment variables
├── .env.example             # Environment template
├── .gitignore
├── package.json
├── server.js                # Entry point
└── README.md
```

---

## 🔒 Security Features

### Authentication & Authorization
- JWT-based authentication
- Bcrypt password hashing (10 rounds)
- Role-based access control (RBAC)
- Token expiration and refresh

### Request Security
- Helmet.js - Security headers
- CORS configuration
- Rate limiting (express-rate-limit)
- Input validation and sanitization
- XSS protection

### Data Security
- MongoDB injection prevention
- SQL injection N/A (NoSQL)
- Secure password requirements
- Environment variable protection

### API Security
- Rate limiting per endpoint
- Multer file upload restrictions
- File type validation
- File size limits (10MB default)

---

## 🚀 Deployment

### Prerequisites

1. Production MongoDB database (MongoDB Atlas recommended)
2. Cloudinary production account
3. Email service configured
4. Domain name (optional)

### Environment Configuration

Update `.env` for production:

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chaya
JWT_SECRET=use_a_strong_random_secret_here
CLIENT_URL=https://your-frontend-domain.com
```

### Recommended Hosting Platforms

#### Backend Hosting
- **Railway** - Easy deployment, free tier available
- **Render** - Automatic deployments from GitHub
- **Heroku** - Classic PaaS with add-ons
- **DigitalOcean App Platform** - Scalable infrastructure
- **AWS EC2 / Elastic Beanstalk** - Full control

#### Database
- **MongoDB Atlas** - Free tier: 512MB storage
- Cloud backups and monitoring included

#### Storage
- **Cloudinary** - Free tier: 25GB storage, 25GB bandwidth

### Deployment Steps

#### 1. Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Link to your project
railway link

# Add environment variables
railway variables set MONGODB_URI=your_uri
railway variables set JWT_SECRET=your_secret
# ... add all other variables

# Deploy
railway up
```

#### 2. Render Deployment

1. Connect GitHub repository
2. Create new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in dashboard
6. Deploy

#### 3. Manual VPS Deployment

```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2

# Clone repository
git clone <your-repo>
cd chaya/server

# Install dependencies
npm install

# Set up environment
nano .env
# Add your production variables

# Start with PM2
pm2 start server.js --name chaya-api

# Save PM2 configuration
pm2 save
pm2 startup

# Set up Nginx reverse proxy (optional)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/chaya
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Post-Deployment

1. **Seed the database**: `npm run seed`
2. **Change default admin password**
3. **Set up SSL certificate** (Let's Encrypt)
4. **Configure monitoring** (PM2, New Relic, etc.)
5. **Set up automated backups**
6. **Test all endpoints**

---

## 🧪 Testing

### Manual Testing with Postman

1. Import the API collection (create from documentation)
2. Set environment variables (base URL, token)
3. Test each endpoint

### Automated Testing (To be implemented)

```bash
npm test
```

---

## 📊 Database Schema

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (user/admin),
  avatar: String,
  bio: String,
  website: String,
  social: {
    instagram: String,
    twitter: String,
    facebook: String,
    linkedin: String
  },
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Image Schema
```javascript
{
  title: String,
  description: String,
  category: ObjectId (ref: Category),
  series: ObjectId (ref: Series),
  cloudinaryId: String,
  cloudinaryUrl: String,
  publicId: String,
  thumbnailUrl: String,
  dimensions: { width: Number, height: Number },
  metadata: {
    camera: String,
    lens: String,
    iso: Number,
    aperture: String,
    shutterSpeed: String,
    focalLength: String,
    dateTaken: Date,
    location: String
  },
  tags: [String],
  featured: Boolean,
  order: Number,
  views: Number,
  likes: Number,
  status: String (draft/published/archived),
  uploadedBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Series Schema
```javascript
{
  title: String,
  slug: String (unique),
  description: String,
  coverImage: ObjectId (ref: Image),
  images: [ObjectId] (ref: Image),
  category: ObjectId (ref: Category),
  order: Number,
  featured: Boolean,
  status: String (draft/published),
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Category Schema
```javascript
{
  name: String (unique),
  slug: String (unique),
  description: String,
  coverImage: String,
  order: Number,
  imageCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
```
Error: Failed to connect to MongoDB
```
**Solution:**
- Check MongoDB is running: `sudo systemctl status mongod`
- Verify connection string in `.env`
- For Atlas, check IP whitelist

#### Cloudinary Upload Failed
```
Error: Failed to upload image to cloud storage
```
**Solution:**
- Verify Cloudinary credentials in `.env`
- Check internet connection
- Ensure file size is under limit

#### Email Not Sending
```
Warning: Email service not configured
```
**Solution:**
- Enable "Less secure app access" in Gmail (or use App Password)
- Verify SMTP credentials in `.env`
- Check firewall/port 587

#### JWT Token Invalid
```
Error: Invalid or expired token
```
**Solution:**
- Login again to get new token
- Check JWT_SECRET is consistent
- Verify token format: `Bearer token`

#### Port Already in Use
```
Error: EADDRINUSE: port 5000 already in use
```
**Solution:**
```bash
# Find process using port
lsof -i :5000
# Kill the process
kill -9 <PID>
# Or change PORT in .env
```

---

## 📈 Performance Optimization

### Database Indexing
All critical fields are indexed:
- User: email, role
- Image: status, featured, category, series, tags
- Category: slug, name
- Series: slug, status, featured

### Caching
In-memory caching for frequently accessed data:
- Category lists (5 min TTL)
- Featured images (5 min TTL)
- Series lists (5 min TTL)

For production, consider Redis for distributed caching.

### Image Optimization
- Automatic Sharp processing before Cloudinary upload
- Cloudinary transformations for thumbnails
- Lazy loading support with thumbnail URLs
- WebP format support

### Query Optimization
- Pagination on all list endpoints
- Field selection with `.select()`
- Population only when needed
- Lean queries for read-only data

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Use ES6+ features
- Follow existing code structure
- Add JSDoc comments for functions
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 Chaya Photography

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 👤 Author

**Your Name**
- Portfolio: [https://chaya-portfolio.com](https://chaya-portfolio.com)
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Mongoose](https://mongoosejs.com/) - ODM
- [Cloudinary](https://cloudinary.com/) - Image hosting
- [Sharp](https://sharp.pixelplumbing.com/) - Image processing
- [Nodemailer](https://nodemailer.com/) - Email service
- [JWT](https://jwt.io/) - Authentication
- All open-source contributors

---

## 📞 Support

If you have questions or need help:

1. Check the [Troubleshooting](#-troubleshooting) section
2. Review the API documentation above
3. Open an issue on GitHub
4. Contact: your.email@example.com

---

## 🗺️ Roadmap

Future enhancements planned:

- [ ] Real-time notifications with Socket.io
- [ ] Advanced image filters and search
- [ ] Watermarking functionality
- [ ] Export portfolio as PDF
- [ ] Social media integration
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Automated testing suite
- [ ] API versioning
- [ ] GraphQL support (optional)

---

**Built with ❤️ for photographers by photographers**

*Chaya (छाया) - Sanskrit for "shadow" and "reflection"*