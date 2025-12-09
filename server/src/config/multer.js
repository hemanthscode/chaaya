import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from './env.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

const uploadDir = config.upload.tempFolder || './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().slice(1);
  if (config.upload.allowedFormats.includes(ext)) {
    cb(null, true);
  } else {
    cb(new ApiError(STATUS_CODES.BAD_REQUEST, `Invalid format: ${config.upload.allowedFormats.join(', ')}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: config.upload.maxFileSize, files: 10 }
});

export const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, `File too large: ${config.upload.maxFileSize / 1024 / 1024}MB`);
    }
    throw new ApiError(STATUS_CODES.BAD_REQUEST, error.message);
  }
  next(error);
};

export default upload;
