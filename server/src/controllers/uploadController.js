// controllers/uploadController.js
import fs from 'fs';
import Image from '../models/Image.js';
import Category from '../models/Category.js';
import Series from '../models/Series.js';
import { ApiError, sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { uploadToCloudinary, generateThumbnailUrl } from '../services/cloudinaryService.js';
import { optimizeImage, getImageMetadata, extractExifData } from '../services/imageProcessing.js';
import { clearCacheByPattern } from '../services/cacheService.js';
import logger from '../utils/logger.js';

export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Image required');
  }

  const data = req.validatedData || req.body || {};

  const optimizedPath = await optimizeImage(req.file.path);
  const metadataInfo = await getImageMetadata(optimizedPath);
  const exifData = await extractExifData(optimizedPath);
  const cloudinaryResult = await uploadToCloudinary(optimizedPath);
  const thumbnailUrl = generateThumbnailUrl(cloudinaryResult.publicId);

  const imageData = {
    title: data.title?.trim() || req.file.originalname.replace(/\.[^/.]+$/, ''),
    description: data.description || '',
    category: data.category || null,
    series: data.series || null,
    cloudinaryId: cloudinaryResult.cloudinaryId,
    cloudinaryUrl: cloudinaryResult.cloudinaryUrl,
    publicId: cloudinaryResult.publicId,
    thumbnailUrl,
    dimensions: {
      width: cloudinaryResult.width || metadataInfo.width,
      height: cloudinaryResult.height || metadataInfo.height
    },
    metadata: {
      ...exifData,
      ...(data.metadata || {})
    },
    tags: Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === 'string' && data.tags.length
      ? data.tags.split(',').map((t) => t.trim().toLowerCase())
      : [],
    featured: data.featured === 'true' || data.featured === true,
    order: typeof data.order === 'number' ? data.order : 0,
    status: data.status || 'published',
    uploadedBy: req.user.id
  };

  const image = await Image.create(imageData);

  // Add to series if specified
  if (image.series) {
    await Series.findByIdAndUpdate(image.series, {
      $addToSet: { images: image._id }
    });
  }

  // Update category count
  if (image.category) {
    const category = await Category.findById(image.category);
    if (category && typeof category.updateImageCount === 'function') {
      await category.updateImageCount();
    }
  }

  await image.populate('category series uploadedBy');

  clearCacheByPattern('images');
  clearCacheByPattern('series');
  sendCreated(res, { image }, MESSAGES.IMAGES.UPLOAD_SUCCESS);
});

export const uploadMultipleImages = asyncHandler(async (req, res) => {
  const uploadedImages = [];
  const errors = [];

  // Get metadata from request body (sent by frontend)
  const status = req.body.status || 'published'; // ✅ Default to published
  const category = req.body.category || null;
  const series = req.body.series || null;

  for (const file of req.files) {
    try {
      const optimizedPath = await optimizeImage(file.path);
      const metadataInfo = await getImageMetadata(optimizedPath);
      const cloudinaryResult = await uploadToCloudinary(optimizedPath);
      const thumbnailUrl = generateThumbnailUrl(cloudinaryResult.publicId);

      const imageData = {
        title: file.originalname.replace(/\.[^/.]+$/, ''),
        description: '',
        category,
        series,
        cloudinaryId: cloudinaryResult.cloudinaryId,
        cloudinaryUrl: cloudinaryResult.cloudinaryUrl,
        publicId: cloudinaryResult.publicId,
        thumbnailUrl,
        dimensions: {
          width: cloudinaryResult.width || metadataInfo.width,
          height: cloudinaryResult.height || metadataInfo.height
        },
        status, // ✅ Use status from request
        uploadedBy: req.user.id
      };

      const image = await Image.create(imageData);

      // Add to series if specified
      if (series) {
        await Series.findByIdAndUpdate(series, {
          $addToSet: { images: image._id }
        });
      }

      uploadedImages.push(image);
    } catch (error) {
      logger.error(`Upload failed ${file.originalname}:`, error);
      errors.push({ filename: file.originalname, error: error.message });
    }
  }

  clearCacheByPattern('images');
  clearCacheByPattern('series');
  
  sendCreated(
    res,
    {
      uploaded: uploadedImages.length,
      failed: errors.length,
      images: uploadedImages,
      ...(errors.length && { errors })
    },
    'Bulk upload complete'
  );
});

export const deleteCloudinaryImage = asyncHandler(async (req, res) => {
  const image = await Image.findOne({ publicId: req.params.publicId });
  if (!image) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, 'Image not found');
  }

  await deleteFromCloudinary(req.params.publicId);
  sendSuccess(res, null, 'Image deleted from Cloudinary');
});

export default {
  uploadSingleImage,
  uploadMultipleImages,
  deleteCloudinaryImage
};
