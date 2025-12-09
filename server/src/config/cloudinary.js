import { v2 as cloudinary } from 'cloudinary';
import { config } from './env.js';
import logger from '../utils/logger.js';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true
});

export const verifyCloudinaryConnection = async () => {
  try {
    await cloudinary.api.ping();
    logger.info('✅ Cloudinary connected');
    return true;
  } catch (error) {
    logger.error('❌ Cloudinary failed:', error.message);
    return false;
  }
};

export const CLOUDINARY_FOLDERS = {
  ORIGINALS: 'chaaya/originals',
  PORTFOLIO: 'chaaya/portfolio',
  THUMBNAILS: 'chaaya/thumbnails',
  SERIES: 'chaaya/series'
};

export const TRANSFORMATIONS = {
  thumbnail: { width: 400, height: 400, crop: 'fill', quality: 'auto:good', fetch_format: 'auto' },
  portfolio: { width: 1920, quality: 80, fetch_format: 'auto' },
  fullscreen: { width: 2560, quality: 90, fetch_format: 'auto' }
};

export default cloudinary;
