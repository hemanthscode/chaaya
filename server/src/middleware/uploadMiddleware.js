/**
 * Upload Middleware
 * Handles file upload validation and processing
 */

import upload, { handleMulterError } from '../config/multer.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { asyncHandler } from './errorHandler.js';

/**
 * Single image upload
 */
export const uploadSingleImage = asyncHandler(async (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }

    if (!req.file) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Please upload an image');
    }

    next();
  });
});

/**
 * Multiple images upload (max 10)
 */
export const uploadMultipleImages = asyncHandler(async (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }

    if (!req.files || req.files.length === 0) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Please upload at least one image');
    }

    next();
  });
});

/**
 * Optional single image upload (for updates)
 */
export const optionalImageUpload = asyncHandler(async (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return handleMulterError(err, req, res, next);
    }
    // Continue even if no file uploaded
    next();
  });
});

export default {
  uploadSingleImage,
  uploadMultipleImages,
  optionalImageUpload
};
