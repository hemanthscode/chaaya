/**
 * API Response Utilities
 * Standardized response and error handling
 */

import { STATUS_CODES } from '../constants/statusCodes.js';

/**
 * Success Response Class
 */
export class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  /**
   * Send response
   */
  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data
    });
  }
}

/**
 * Error Response Class
 */
export class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Pagination Response Helper
 */
export class PaginatedResponse extends ApiResponse {
  constructor(statusCode, data, pagination, message = 'Success') {
    super(statusCode, data, message);
    this.pagination = {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrevPage: pagination.page > 1
    };
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
      pagination: this.pagination
    });
  }
}

/**
 * Success response helper functions
 */
export const sendSuccess = (res, data, message, statusCode = STATUS_CODES.OK) => {
  return new ApiResponse(statusCode, data, message).send(res);
};

export const sendCreated = (res, data, message) => {
  return new ApiResponse(STATUS_CODES.CREATED, data, message).send(res);
};

export const sendNoContent = (res) => {
  return res.status(STATUS_CODES.NO_CONTENT).send();
};

/**
 * Paginated response helper
 */
export const sendPaginated = (res, data, pagination, message) => {
  return new PaginatedResponse(STATUS_CODES.OK, data, pagination, message).send(res);
};

export default { ApiResponse, ApiError, PaginatedResponse, sendSuccess, sendCreated, sendNoContent, sendPaginated };
