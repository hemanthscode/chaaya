import express from 'express';
import { getDashboard, getRecentStats, getAnalyticsByRange } from '../controllers/analyticsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, adminOnly);

router.get('/dashboard', getDashboard);
router.get('/recent', getRecentStats);
router.get('/range', getAnalyticsByRange);

export default router;
