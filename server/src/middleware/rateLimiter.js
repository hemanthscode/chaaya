/**
 * Rate Limiting Middleware
 * Prevents abuse and DDoS attacks
 */

import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs * 60 * 1000, // Convert to milliseconds
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
    message: 'Too many requests, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Strict rate limiter for auth routes
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
    message: 'Too many login attempts, please try again after 15 minutes'
  },
  skipSuccessfulRequests: true
});

/**
 * Upload rate limiter
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 uploads per hour
  message: {
    success: false,
    statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
    message: 'Upload limit reached, please try again later'
  }
});

/**
 * Contact form rate limiter
 */
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 submissions per hour
  message: {
    success: false,
    statusCode: STATUS_CODES.TOO_MANY_REQUESTS,
    message: 'Too many contact submissions, please try again later'
  }
});

export default {
  apiLimiter,
  authLimiter,
  uploadLimiter,
  contactLimiter
};
