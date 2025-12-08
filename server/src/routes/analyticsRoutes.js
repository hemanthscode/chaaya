/**
 * Analytics Routes
 * Routes for analytics and dashboard statistics
 */

import express from 'express';
import {
  getDashboard,
  getRecentStats,
  getAnalyticsByRange
} from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * All analytics routes require authentication and admin role
 */
router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/recent', getRecentStats);
router.get('/range', getAnalyticsByRange);

export default router;
