import express from 'express';
import authRoutes from './authRoutes.js';
import imageRoutes from './imageRoutes.js';
import seriesRoutes from './seriesRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import contactRoutes from './contactRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';
import portfolioRoutes from './portfolioRoutes.js';
import favoriteRoutes from './favoriteRoutes.js';
import testimonialRoutes from './testimonialRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/images', imageRoutes);
router.use('/series', seriesRoutes);
router.use('/categories', categoryRoutes);
router.use('/upload', uploadRoutes);
router.use('/contact', contactRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Chaaya API healthy', timestamp: new Date().toISOString() });
});

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Chaaya Photography Portfolio API v1.0',
    endpoints: {
      auth: '/api/v1/auth', images: '/api/v1/images', series: '/api/v1/series',
      categories: '/api/v1/categories', portfolio: '/api/v1/portfolio',
      favorites: '/api/v1/favorites', testimonials: '/api/v1/testimonials'
    }
  });
});

export default router;
