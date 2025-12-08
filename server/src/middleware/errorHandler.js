/**
 * Global Error Handler Middleware
 * Catches and formats all errors
 */

import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import logger from '../utils/logger.js';
import mongoose from 'mongoose';

/**
 * Handle Mongoose CastError (Invalid ObjectId)
 */
const handleCastError = (error) => {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new ApiError(STATUS_CODES.BAD_REQUEST, message);
};

/**
 * Handle Mongoose Duplicate Key Error
 */
const handleDuplicateKeyError = (error) => {
  const field = Object.keys(error.keyPattern)[0];
  const value = error.keyValue[field];
  const message = `${field} '${value}' already exists`;
  return new ApiError(STATUS_CODES.CONFLICT, message);
};

/**
 * Handle Mongoose Validation Error
 */
const handleValidationError = (error) => {
  const errors = Object.values(error.errors).map(err => err.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new ApiError(STATUS_CODES.BAD_REQUEST, message, errors);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new ApiError(
    STATUS_CODES.UNAUTHORIZED,
    MESSAGES.AUTH.TOKEN_INVALID
  );
};

const handleJWTExpiredError = () => {
  return new ApiError(
    STATUS_CODES.UNAUTHORIZED,
    MESSAGES.AUTH.TOKEN_EXPIRED
  );
};

/**
 * Send error response in development
 */
const sendErrorDev = (err, res) => {
  logger.error('Error in development:', {
    message: err.message,
    stack: err.stack,
    error: err
  });

  res.status(err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode: err.statusCode,
    message: err.message,
    errors: err.errors || null,
    stack: err.stack,
    error: err
  });
};

/**
 * Send error response in production
 */
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err instanceof ApiError) {
    logger.warn('Operational error:', {
      statusCode: err.statusCode,
      message: err.message
    });

    res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || null
    });
  } 
  // Programming or unknown error: don't leak error details
  else {
    logger.error('Unexpected error:', {
      message: err.message,
      stack: err.stack
    });

    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
      message: MESSAGES.SERVER.ERROR
    });
  }
};

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;

  // Log error
  logger.error('Error:', {
    message: error.message,
    url: req.originalUrl,
    method: req.method
  });

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error = handleCastError(err);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = handleDuplicateKeyError(err);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error = handleValidationError(err);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = handleJWTError();
  }

  if (err.name === 'TokenExpiredError') {
    error = handleJWTExpiredError();
  }

  // Send response
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

/**
 * Handle 404 - Not Found
 */
export const notFound = (req, res, next) => {
  const error = new ApiError(
    STATUS_CODES.NOT_FOUND,
    `Route ${req.originalUrl} not found`
  );
  next(error);
};

/**
 * Async handler wrapper - catches async errors
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default { errorHandler, notFound, asyncHandler };
