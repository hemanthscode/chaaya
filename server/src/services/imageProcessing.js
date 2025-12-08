/**
 * Image Processing Service
 * Handles image optimization and manipulation using Sharp
 */

import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import logger from '../utils/logger.js';

/**
 * Get image metadata using Sharp
 */
export const getImageMetadata = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation
    };
  } catch (error) {
    logger.error('Failed to read image metadata:', error);
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid or corrupted image file'
    );
  }
};

/**
 * Optimize image before uploading
 */
export const optimizeImage = async (filePath, options = {}) => {
  try {
    const {
      quality = 85,
      maxWidth = 2560,
      maxHeight = 2560
    } = options;

    const outputPath = filePath.replace(
      path.extname(filePath),
      `-optimized${path.extname(filePath)}`
    );

    await sharp(filePath)
      .resize(maxWidth, maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality, progressive: true })
      .toFile(outputPath);

    // Delete original file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return outputPath;
  } catch (error) {
    logger.error('Image optimization failed:', error);
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to optimize image'
    );
  }
};

/**
 * Generate thumbnail locally
 */
export const generateThumbnail = async (filePath, width = 400, height = 400) => {
  try {
    const thumbnailPath = filePath.replace(
      path.extname(filePath),
      `-thumb${path.extname(filePath)}`
    );

    await sharp(filePath)
      .resize(width, height, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 80 })
      .toFile(thumbnailPath);

    return thumbnailPath;
  } catch (error) {
    logger.error('Thumbnail generation failed:', error);
    throw new ApiError(
      STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Failed to generate thumbnail'
    );
  }
};

/**
 * Extract EXIF data from image
 */
export const extractExifData = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    
    const exif = metadata.exif ? parseExifData(metadata.exif) : {};
    
    return {
      camera: exif.Make && exif.Model ? `${exif.Make} ${exif.Model}` : null,
      lens: exif.LensModel || null,
      iso: exif.ISO || null,
      aperture: exif.FNumber ? `f/${exif.FNumber}` : null,
      shutterSpeed: exif.ExposureTime || null,
      focalLength: exif.FocalLength ? `${exif.FocalLength}mm` : null,
      dateTaken: exif.DateTimeOriginal ? new Date(exif.DateTimeOriginal) : null
    };
  } catch (error) {
    logger.warn('Failed to extract EXIF data:', error);
    return {};
  }
};

/**
 * Parse EXIF buffer data
 */
const parseExifData = (exifBuffer) => {
  try {
    // This is a simplified parser - in production, use exif-parser or similar
    // For now, return empty object
    return {};
  } catch (error) {
    return {};
  }
};

/**
 * Validate image file
 */
export const validateImageFile = async (filePath) => {
  try {
    await sharp(filePath).metadata();
    return true;
  } catch (error) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid image file'
    );
  }
};

/**
 * Batch process images
 */
export const batchProcessImages = async (files, options = {}) => {
  try {
    const processedFiles = await Promise.all(
      files.map(async (file) => {
        const optimized = await optimizeImage(file.path, options);
        const metadata = await getImageMetadata(optimized);
        const exif = await extractExifData(optimized);
        
        return {
          path: optimized,
          originalName: file.originalname,
          metadata,
          exif
        };
      })
    );

    return processedFiles;
  } catch (error) {
    logger.error('Batch processing failed:', error);
    throw error;
  }
};

export default {
  getImageMetadata,
  optimizeImage,
  generateThumbnail,
  extractExifData,
  validateImageFile,
  batchProcessImages
};
