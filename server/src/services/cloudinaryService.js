import cloudinary, { CLOUDINARY_FOLDERS, TRANSFORMATIONS } from '../config/cloudinary.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import fs from 'fs';
import logger from '../utils/logger.js';

export const uploadToCloudinary = async (filePath, folder = CLOUDINARY_FOLDERS.PORTFOLIO) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: 'image',
      transformation: [{ quality: 'auto:good' }, { fetch_format: 'auto' }]
    });

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    
    return {
      cloudinaryId: result.asset_id,
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format
    };
  } catch (error) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    logger.error('Cloudinary upload failed:', error);
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Upload failed');
  }
};

export const uploadMultipleToCloudinary = async (files, folder = CLOUDINARY_FOLDERS.PORTFOLIO) => {
  const results = await Promise.all(files.map(file => uploadToCloudinary(file.path, folder)));
  return results;
};

export const deleteFromCloudinary = async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== 'ok' && result.result !== 'not found') {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Delete failed');
  }
  return result;
};

export const generateThumbnailUrl = (publicId) => 
  cloudinary.url(publicId, { 
    transformation: [
      { width: TRANSFORMATIONS.thumbnail.width, height: TRANSFORMATIONS.thumbnail.height, crop: 'fill' },
      { quality: TRANSFORMATIONS.thumbnail.quality, fetch_format: TRANSFORMATIONS.thumbnail.fetch_format }
    ]
  });

export const generateOptimizedUrl = (publicId, width = 1920) =>
  cloudinary.url(publicId, { transformation: [{ width, quality: 'auto:good', fetch_format: 'auto' }] });

export default {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  generateThumbnailUrl,
  generateOptimizedUrl
};
