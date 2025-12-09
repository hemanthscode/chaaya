import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import logger from '../utils/logger.js';

export const getImageMetadata = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size
    };
  } catch (error) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid image');
  }
};

export const optimizeImage = async (filePath, options = {}) => {
  try {
    const { quality = 85, maxWidth = 2560, maxHeight = 2560 } = options;
    const outputPath = filePath.replace(path.extname(filePath), `-optimized${path.extname(filePath)}`);

    await sharp(filePath)
      .resize(maxWidth, maxHeight, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality, progressive: true })
      .toFile(outputPath);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return outputPath;
  } catch (error) {
    throw new ApiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Optimization failed');
  }
};

export const extractExifData = async (filePath) => {
  try {
    const metadata = await sharp(filePath).metadata();
    return {
      camera: metadata.exif?.Make && metadata.exif?.Model ? `${metadata.exif.Make} ${metadata.exif.Model}` : null,
      iso: metadata.exif?.ISO || null,
      aperture: metadata.exif?.FNumber ? `f/${metadata.exif.FNumber}` : null
    };
  } catch (error) {
    logger.warn('EXIF extraction failed:', error);
    return {};
  }
};

export default { getImageMetadata, optimizeImage, extractExifData };
