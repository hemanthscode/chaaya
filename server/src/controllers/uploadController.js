/**
 * Upload Controller
 * Handles image upload operations
 */

import Image from '../models/Image.js';
import Category from '../models/Category.js';
import { ApiError, sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  generateThumbnailUrl
} from '../services/cloudinaryService.js';
import {
  optimizeImage,
  getImageMetadata,
  extractExifData
} from '../services/imageProcessing.js';
import { clearCacheByPattern } from '../services/cacheService.js';
import logger from '../utils/logger.js';
import fs from 'fs';

/**
 * @desc    Upload single image
 * @route   POST /api/v1/upload/image
 * @access  Private/Admin
 */
export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Please upload an image file'
    );
  }

  const data = req.validatedData;

  try {
    // Optimize image
    const optimizedPath = await optimizeImage(req.file.path);

    // Get metadata
    const metadata = await getImageMetadata(optimizedPath);
    const exifData = await extractExifData(optimizedPath);

    // Upload to Cloudinary
    const cloudinaryResult = await uploadToCloudinary(optimizedPath);

    // Generate thumbnail URL
    const thumbnailUrl = generateThumbnailUrl(cloudinaryResult.publicId);

    // Create image document
    const imageData = {
      title: data.title,
      description: data.description || '',
      category: data.category || null,
      series: data.series || null,
      cloudinaryId: cloudinaryResult.cloudinaryId,
      cloudinaryUrl: cloudinaryResult.cloudinaryUrl,
      publicId: cloudinaryResult.publicId,
      thumbnailUrl,
      dimensions: {
        width: cloudinaryResult.width,
        height: cloudinaryResult.height
      },
      metadata: {
        ...exifData,
        ...data.metadata
      },
      tags: data.tags || [],
      featured: data.featured || false,
      order: data.order || 0,
      status: data.status || 'published',
      uploadedBy: req.user.id
    };

    const image = await Image.create(imageData);

    // Update category image count
    if (image.category) {
      const category = await Category.findById(image.category);
      if (category) {
        await category.updateImageCount();
      }
    }

    // Populate fields
    await image.populate('category series uploadedBy');

    // Clear cache
    clearCacheByPattern('images');

    logger.info(`Image uploaded: ${image.title} by ${req.user.name}`);

    sendCreated(res, { image }, MESSAGES.IMAGES.UPLOAD_SUCCESS);
  } catch (error) {
    // Clean up file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    throw error;
  }
});

/**
 * @desc    Upload multiple images
 * @route   POST /api/v1/upload/images
 * @access  Private/Admin
 */
export const uploadMultipleImages = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Please upload at least one image'
    );
  }

  const uploadedImages = [];
  const errors = [];

  try {
    // Process each file
    for (const file of req.files) {
      try {
        // Optimize image
        const optimizedPath = await optimizeImage(file.path);

        // Get metadata
        const metadata = await getImageMetadata(optimizedPath);
        const exifData = await extractExifData(optimizedPath);

        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(optimizedPath);

        // Generate thumbnail URL
        const thumbnailUrl = generateThumbnailUrl(cloudinaryResult.publicId);

        // Create image document
        const imageData = {
          title: file.originalname.replace(/\.[^/.]+$/, ''), // Remove extension
          description: '',
          cloudinaryId: cloudinaryResult.cloudinaryId,
          cloudinaryUrl: cloudinaryResult.cloudinaryUrl,
          publicId: cloudinaryResult.publicId,
          thumbnailUrl,
          dimensions: {
            width: cloudinaryResult.width,
            height: cloudinaryResult.height
          },
          metadata: exifData,
          status: 'draft', // Default to draft for bulk uploads
          uploadedBy: req.user.id
        };

        const image = await Image.create(imageData);
        uploadedImages.push(image);
      } catch (error) {
        logger.error(`Failed to upload ${file.originalname}:`, error);
        errors.push({
          filename: file.originalname,
          error: error.message
        });
      }
    }

    // Clear cache
    clearCacheByPattern('images');

    logger.info(`Bulk upload: ${uploadedImages.length} images uploaded by ${req.user.name}`);

    sendCreated(
      res,
      {
        uploaded: uploadedImages.length,
        failed: errors.length,
        images: uploadedImages,
        errors: errors.length > 0 ? errors : undefined
      },
      MESSAGES.IMAGES.UPLOAD_MULTIPLE_SUCCESS
    );
  } catch (error) {
    // Clean up files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    throw error;
  }
});

/**
 * @desc    Delete image from Cloudinary only
 * @route   DELETE /api/v1/upload/:publicId
 * @access  Private/Admin
 */
export const deleteCloudinaryImage = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  // Find image in database
  const image = await Image.findOne({ publicId });

  if (!image) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      'Image not found in database'
    );
  }

  // Delete from Cloudinary
  await deleteFromCloudinary(publicId);

  logger.info(`Cloudinary image deleted: ${publicId}`);

  sendSuccess(res, null, 'Image deleted from Cloudinary successfully');
});

export default {
  uploadSingleImage,
  uploadMultipleImages,
  deleteCloudinaryImage
};
