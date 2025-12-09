import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import logger from '../utils/logger.js';

const handleCastError = (error) => 
  new ApiError(STATUS_CODES.BAD_REQUEST, `Invalid ${error.path}: ${error.value}`);

const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyPattern)[0];
  const value = error.keyValue[field];
  return new ApiError(STATUS_CODES.CONFLICT, `${field} '${value}' already exists`);
};

const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => err.message);
  return new ApiError(STATUS_CODES.UNPROCESSABLE_ENTITY, `Validation failed: ${errors.join('. ')}`, errors);
};

export const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message };
  error.statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;

  logger.error('Error:', { message: error.message, url: req.originalUrl, method: req.method });

  if (err.name === 'CastError') error = handleCastError(err);
  if (err.code === 11000) error = handleDuplicateKeyError(err);
  if (err.name === 'ValidationError') error = handleValidationError(err);

  res.status(error.statusCode).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack, errors: error.errors })
  });
};

export const notFound = (req, res, next) => 
  next(new ApiError(STATUS_CODES.NOT_FOUND, `Route ${req.originalUrl} not found`));

export const asyncHandler = (fn) => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

export default { errorHandler, notFound, asyncHandler };
