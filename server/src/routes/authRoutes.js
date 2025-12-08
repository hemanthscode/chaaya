/**
 * Authentication Routes
 * Routes for user authentication
 */

import express from 'express';
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  refreshToken
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
} from '../validators/authValidator.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * Public routes
 */
router.post(
  '/register',
  authLimiter,
  validateRequest(validateRegister),
  register
);

router.post(
  '/login',
  authLimiter,
  validateRequest(validateLogin),
  login
);

/**
 * Protected routes
 */
router.use(protect); // All routes below require authentication

router.post('/logout', logout);

router.get('/me', getMe);

router.put(
  '/profile',
  validateRequest(validateProfileUpdate),
  updateProfile
);

router.put(
  '/password',
  validateRequest(validatePasswordChange),
  changePassword
);

router.post('/refresh', refreshToken);

export default router;
