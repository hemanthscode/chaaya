/**
 * Cloudinary Configuration
 * Setup and initialize Cloudinary SDK
 */

import { v2 as cloudinary } from 'cloudinary';
import { config } from './env.js';
import logger from '../utils/logger.js';

/**
 * Configure Cloudinary
 */
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true // Always use HTTPS
});

/**
 * Verify Cloudinary connection
 */
export const verifyCloudinaryConnection = async () => {
  try {
    await cloudinary.api.ping();
    logger.info('✅ Cloudinary connected successfully');
    return true;
  } catch (error) {
    logger.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
};

/**
 * Cloudinary folder structure
 */
export const CLOUDINARY_FOLDERS = {
  ORIGINALS: 'chaya/originals',
  PORTFOLIO: 'chaya/portfolio',
  THUMBNAILS: 'chaya/thumbnails',
  SERIES: 'chaya/series'
};

/**
 * Image transformation presets
 */
export const TRANSFORMATIONS = {
  thumbnail: {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto:good',
    fetch_format: 'auto'
  },
  portfolio: {
    width: 1920,
    quality: 80,
    fetch_format: 'auto'
  },
  fullscreen: {
    width: 2560,
    quality: 90,
    fetch_format: 'auto'
  }
};

export default cloudinary;
