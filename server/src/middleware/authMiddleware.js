/**
 * Authentication Middleware
 * Protects routes and verifies JWT tokens
 */

import { verifyToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { ENUMS } from '../constants/enums.js';
import User from '../models/User.js';

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.AUTH.UNAUTHORIZED
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    // Get user from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      throw new ApiError(
        STATUS_CODES.UNAUTHORIZED,
        MESSAGES.AUTH.USER_NOT_FOUND
      );
    }

    // Check if user is active
    if (!user.isActive) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        'Your account has been deactivated'
      );
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.message === 'Invalid or expired token') {
      next(
        new ApiError(STATUS_CODES.UNAUTHORIZED, MESSAGES.AUTH.TOKEN_INVALID)
      );
    } else {
      next(error);
    }
  }
};

/**
 * Restrict to specific roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        STATUS_CODES.FORBIDDEN,
        'You do not have permission to perform this action'
      );
    }
    next();
  };
};

/**
 * Admin only middleware
 */
export const adminOnly = restrictTo(ENUMS.USER_ROLES.ADMIN);

/**
 * Optional auth - attach user if token exists, but don't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
};

export default { protect, restrictTo, adminOnly, optionalAuth };
