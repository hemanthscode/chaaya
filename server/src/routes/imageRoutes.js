/**
 * Image Routes
 * Routes for image management
 */

import express from 'express';
import {
  getAllImages,
  getImageById,
  getImagesByCategory,
  getImagesBySeries,
  getFeaturedImages,
  updateImage,
  deleteImage,
  toggleLikeImage,
  searchImages
} from '../controllers/imageController.js';
import {
  validateImageUpdate,
  validateImageQuery
} from '../validators/imageValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { protect, adminOnly, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Public routes
 */
router.get(
  '/',
  optionalAuth,
  validateRequest((body, params, query) => validateImageQuery(query)),
  getAllImages
);

router.get('/search', searchImages);
router.get('/featured', getFeaturedImages);
router.get('/category/:slug', getImagesByCategory);
router.get('/series/:slug', getImagesBySeries);
router.get('/:id', optionalAuth, getImageById);

router.post('/:id/like', toggleLikeImage);

/**
 * Protected admin routes
 */
router.use(protect, adminOnly);

router.put(
  '/:id',
  validateRequest(validateImageUpdate),
  updateImage
);

router.delete('/:id', deleteImage);

export default router;
