/**
 * Category Routes
 * Routes for category management
 */

import express from 'express';
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
} from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Public routes
 */
router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);
router.get('/:id/stats', getCategoryStats);

/**
 * Protected admin routes
 */
router.use(protect, adminOnly);

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
