/**
 * Main Router
 * Combines all route modules
 */

import express from 'express';
import authRoutes from './authRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import seriesRoutes from './seriesRoutes.js';
import imageRoutes from './imageRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import contactRoutes from './contactRoutes.js';
import analyticsRoutes from './analyticsRoutes.js';

const router = express.Router();

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/series', seriesRoutes);
router.use('/images', imageRoutes);
router.use('/upload', uploadRoutes);
router.use('/contact', contactRoutes);
router.use('/analytics', analyticsRoutes);

/**
 * Health check route
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Chaya API is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * API info route
 */
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Chaya Photography Portfolio API',
    version: '1.0.0',
    documentation: '/api/v1/health',
    endpoints: {
      auth: '/api/v1/auth',
      categories: '/api/v1/categories',
      series: '/api/v1/series',
      images: '/api/v1/images',
      upload: '/api/v1/upload',
      contact: '/api/v1/contact',
      analytics: '/api/v1/analytics'
    }
  });
});

export default router;
