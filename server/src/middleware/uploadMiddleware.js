import upload, { handleMulterError } from '../config/multer.js';
import { asyncHandler } from './errorHandler.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

export const uploadSingleImage = asyncHandler(async (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return handleMulterError(err, req, res, next);
    if (!req.file) throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Image required');
    next();
  });
});

export const uploadMultipleImages = asyncHandler(async (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) return handleMulterError(err, req, res, next);
    if (!req.files?.length) throw new ApiError(STATUS_CODES.BAD_REQUEST, 'At least one image required');
    next();
  });
});

export const optionalImageUpload = asyncHandler(async (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) return handleMulterError(err, req, res, next);
    next();
  });
});

export default { uploadSingleImage, uploadMultipleImages, optionalImageUpload };
