import { STATUS_CODES } from '../constants/statusCodes.js';

export class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.errors = errors;
  }
}

export class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data
    });
  }
}

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

export const sendSuccess = (res, data, message, statusCode = STATUS_CODES.OK) => 
  new ApiResponse(statusCode, data, message).send(res);

export const sendCreated = (res, data, message) => 
  new ApiResponse(STATUS_CODES.CREATED, data, message).send(res);

export const sendPaginated = (res, data, pagination, message) => 
  new PaginatedResponse(STATUS_CODES.OK, data, pagination, message).send(res);

export default { ApiError, ApiResponse, PaginatedResponse, sendSuccess, sendCreated, sendPaginated };
