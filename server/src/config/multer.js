/**
 * Multer Configuration
 * Handles file upload middleware setup
 */

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from './env.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

// Ensure upload directory exists
const uploadDir = config.upload.tempFolder;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Storage configuration - saves files temporarily
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-randomstring-originalname
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

/**
 * File filter - validate file types
 */
const fileFilter = (req, file, cb) => {
  // Check file extension
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  
  if (config.upload.allowedFormats.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        STATUS_CODES.BAD_REQUEST,
        `Invalid file type. Allowed formats: ${config.upload.allowedFormats.join(', ')}`
      ),
      false
    );
  }
};

/**
 * Multer instance with configuration
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSize, // 10MB
    files: 10 // Maximum 10 files per request
  }
});

/**
 * Error handler for multer errors
 */
export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        `File too large. Maximum size: ${config.upload.maxFileSize / 1024 / 1024}MB`
      );
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      throw new ApiError(
        STATUS_CODES.BAD_REQUEST,
        'Too many files. Maximum 10 files allowed'
      );
    }
    throw new ApiError(STATUS_CODES.BAD_REQUEST, error.message);
  }
  next(error);
};

export default upload;
