/**
 * Cloudinary Service
 * Handles all Cloudinary operations
 */

import cloudinary, { 
  CLOUDINARY_FOLDERS, 
  TRANSFORMATIONS 
} from '../config/cloudinary.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import logger from '../utils/logger.js';
import fs from 'fs';

/**
 * Upload image to Cloudinary
 */
export const uploadToCloudinary = async (filePath, folder = CLOUDINARY_FOLDERS.PORTFOLIO) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'image',
      transformation: [
        { quality: 'auto:good' },
        { fetch_format: 'auto' }
      ]
    });

    // Delete local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      cloudinaryId: result.asset_id,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    // Delete local file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    logger.error('Cloudinary upload failed:', error);
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to upload image to cloud storage'
    );
  }
};

/**
 * Upload multiple images to Cloudinary
 */
export const uploadMultipleToCloudinary = async (files, folder = CLOUDINARY_FOLDERS.PORTFOLIO) => {
  try {
    const uploadPromises = files.map(file => uploadToCloudinary(file.path, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    logger.error('Multiple upload failed:', error);
    throw error;
  }
};

/**
 * Delete image from Cloudinary
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result !== 'ok' && result.result !== 'not found') {
      throw new Error('Cloudinary deletion failed');
    }
    
    return result;
  } catch (error) {
    logger.error('Cloudinary delete failed:', error);
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to delete image from cloud storage'
    );
  }
};

/**
 * Delete multiple images from Cloudinary
 */
export const deleteMultipleFromCloudinary = async (publicIds) => {
  try {
    const deletePromises = publicIds.map(publicId => deleteFromCloudinary(publicId));
    await Promise.all(deletePromises);
    return true;
  } catch (error) {
    logger.error('Multiple delete failed:', error);
    throw error;
  }
};

/**
 * Generate thumbnail URL
 */
export const generateThumbnailUrl = (publicId) => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: TRANSFORMATIONS.thumbnail.width },
      { height: TRANSFORMATIONS.thumbnail.height },
      { crop: TRANSFORMATIONS.thumbnail.crop },
      { quality: TRANSFORMATIONS.thumbnail.quality },
      { fetch_format: TRANSFORMATIONS.thumbnail.fetch_format }
    ]
  });
};

/**
 * Generate optimized URL
 */
export const generateOptimizedUrl = (publicId, width = 1920) => {
  return cloudinary.url(publicId, {
    transformation: [
      { width: width },
      { quality: 'auto:good' },
      { fetch_format: 'auto' }
    ]
  });
};

/**
 * Get image details from Cloudinary
 */
export const getCloudinaryImageDetails = async (publicId) => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      image_metadata: true,
      colors: true
    });
    
    return {
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at,
      metadata: result.image_metadata || {}
    };
  } catch (error) {
    logger.error('Failed to get image details:', error);
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to retrieve image details'
    );
  }
};

/**
 * Update image metadata on Cloudinary
 */
export const updateCloudinaryMetadata = async (publicId, metadata) => {
  try {
    const result = await cloudinary.uploader.explicit(publicId, {
      type: 'upload',
      context: metadata
    });
    
    return result;
  } catch (error) {
    logger.error('Failed to update metadata:', error);
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to update image metadata'
    );
  }
};

export default {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  generateThumbnailUrl,
  generateOptimizedUrl,
  getCloudinaryImageDetails,
  updateCloudinaryMetadata
};
