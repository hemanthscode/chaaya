import Image from '../models/Image.js';
import Category from '../models/Category.js';
import { ApiError, sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { uploadToCloudinary, generateThumbnailUrl } from '../services/cloudinaryService.js';
import { optimizeImage, getImageMetadata, extractExifData } from '../services/imageProcessing.js';
import { clearCacheByPattern } from '../services/cacheService.js';
import fs from 'fs';
import logger from '../utils/logger.js';

export const uploadSingleImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Image required');

  const data = req.validatedData;
  const optimizedPath = await optimizeImage(req.file.path);
  const metadata = await getImageMetadata(optimizedPath);
  const exifData = await extractExifData(optimizedPath);
  const cloudinaryResult = await uploadToCloudinary(optimizedPath);
  const thumbnailUrl = generateThumbnailUrl(cloudinaryResult.publicId);

  const imageData = {
    title: data.title,
    description: data.description || '',
    category: data.category || null,
    series: data.series || null,
    cloudinaryId: cloudinaryResult.cloudinaryId,
    cloudinaryUrl: cloudinaryResult.cloudinaryUrl,
    publicId: cloudinaryResult.publicId,
    thumbnailUrl,
    dimensions: { width: cloudinaryResult.width, height: cloudinaryResult.height },
    metadata: { ...exifData, ...data.metadata },
    tags: data.tags || [],
    featured: data.featured || false,
    order: data.order || 0,
    status: data.status || 'published',
    uploadedBy: req.user.id
  };

  const image = await Image.create(imageData);
  if (image.category) {
    const category = await Category.findById(image.category);
    if (category) await category.updateImageCount();
  }

  await image.populate('category series uploadedBy');
  clearCacheByPattern('images');
  sendCreated(res, { image }, MESSAGES.IMAGES.UPLOAD_SUCCESS);
});

export const uploadMultipleImages = asyncHandler(async (req, res) => {
  const uploadedImages = [];
  const errors = [];

  for (const file of req.files) {
    try {
      const optimizedPath = await optimizeImage(file.path);
      const cloudinaryResult = await uploadToCloudinary(optimizedPath);
      const thumbnailUrl = generateThumbnailUrl(cloudinaryResult.publicId);

      const image = await Image.create({
        title: file.originalname.replace(/\.[^/.]+$/, ''),
        cloudinaryId: cloudinaryResult.cloudinaryId,
        cloudinaryUrl: cloudinaryResult.cloudinaryUrl,
        publicId: cloudinaryResult.publicId,
        thumbnailUrl,
        dimensions: { width: cloudinaryResult.width, height: cloudinaryResult.height },
        status: 'draft',
        uploadedBy: req.user.id
      });

      uploadedImages.push(image);
    } catch (error) {
      logger.error(`Upload failed ${file.originalname}:`, error);
      errors.push({ filename: file.originalname, error: error.message });
    }
  }

  clearCacheByPattern('images');
  sendCreated(res, {
    uploaded: uploadedImages.length,
    failed: errors.length,
    images: uploadedImages,
    ...(errors.length && { errors })
  }, 'Bulk upload complete');
});

export const deleteCloudinaryImage = asyncHandler(async (req, res) => {
  const image = await Image.findOne({ publicId: req.params.publicId });
  if (!image) throw new ApiError(STATUS_CODES.NOT_FOUND, 'Image not found');

  await deleteFromCloudinary(req.params.publicId);
  sendSuccess(res, null, 'Image deleted from Cloudinary');
});

export default { uploadSingleImage, uploadMultipleImages, deleteCloudinaryImage };
