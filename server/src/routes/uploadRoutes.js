/**
 * Upload Routes
 * Routes for image upload operations
 */

import express from 'express';
import {
  uploadSingleImage,
  uploadMultipleImages,
  deleteCloudinaryImage
} from '../controllers/uploadController.js';
import {
  uploadSingleImage as uploadSingleMiddleware,
  uploadMultipleImages as uploadMultipleMiddleware
} from '../middleware/uploadMiddleware.js';
import { validateImageUpload } from '../validators/imageValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * All upload routes require authentication and admin role
 */
router.use(protect, adminOnly, uploadLimiter);

/**
 * Upload routes
 */
router.post(
  '/image',
  uploadSingleMiddleware,
  validateRequest(validateImageUpload),
  uploadSingleImage
);

router.post(
  '/images',
  uploadMultipleMiddleware,
  uploadMultipleImages
);

router.delete('/:publicId', deleteCloudinaryImage);

export default router;
