import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: { success: false, statusCode: STATUS_CODES.TOO_MANY_REQUESTS, message: 'Too many requests' },
  standardHeaders: true
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, statusCode: STATUS_CODES.TOO_MANY_REQUESTS, message: 'Too many login attempts' },
  skipSuccessfulRequests: true
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 50,
  message: { success: false, statusCode: STATUS_CODES.TOO_MANY_REQUESTS, message: 'Upload limit reached' }
});

export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { success: false, statusCode: STATUS_CODES.TOO_MANY_REQUESTS, message: 'Too many contact submissions' }
});

export default { apiLimiter, authLimiter, uploadLimiter, contactLimiter };
