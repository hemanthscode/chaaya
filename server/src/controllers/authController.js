/**
 * Authentication Controller
 * Handles user authentication and authorization
 */

import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { ApiError, sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

/**
 * @desc    Register new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validatedData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(
      STATUS_CODES.CONFLICT,
      MESSAGES.AUTH.USER_EXISTS
    );
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  // Send welcome email (non-blocking)
  sendWelcomeEmail(user).catch(err => 
    logger.error('Failed to send welcome email:', err)
  );

  // Generate token
  const token = generateToken({ id: user._id });

  // Get public profile
  const profile = user.getPublicProfile();

  logger.info(`New user registered: ${email}`);

  sendCreated(res, { user: profile, token }, MESSAGES.AUTH.REGISTER_SUCCESS);
});

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;

  // Find user with password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      MESSAGES.AUTH.INVALID_CREDENTIALS
    );
  }

  // Check if user is active
  if (!user.isActive) {
    throw new ApiError(
      STATUS_CODES.FORBIDDEN,
      'Your account has been deactivated. Please contact support.'
    );
  }

  // Verify password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      MESSAGES.AUTH.INVALID_CREDENTIALS
    );
  }

  // Update last login
  await user.updateLastLogin();

  // Generate token
  const token = generateToken({ id: user._id });

  // Get public profile (password excluded)
  const userWithoutPassword = await User.findById(user._id);
  const profile = userWithoutPassword.getPublicProfile();

  logger.info(`User logged in: ${email}`);

  sendSuccess(res, { user: profile, token }, MESSAGES.AUTH.LOGIN_SUCCESS);
});

/**
 * @desc    Logout user
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // With JWT, logout is handled client-side by removing token
  // This endpoint can be used for logging/analytics
  
  logger.info(`User logged out: ${req.user.email}`);

  sendSuccess(res, null, MESSAGES.AUTH.LOGOUT_SUCCESS);
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.AUTH.USER_NOT_FOUND
    );
  }

  const profile = user.getPublicProfile();

  sendSuccess(res, { user: profile }, 'Profile retrieved successfully');
});

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const updates = req.validatedData;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updates,
    {
      new: true,
      runValidators: true
    }
  );

  if (!user) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.AUTH.USER_NOT_FOUND
    );
  }

  const profile = user.getPublicProfile();

  logger.info(`Profile updated: ${user.email}`);

  sendSuccess(res, { user: profile }, 'Profile updated successfully');
});

/**
 * @desc    Change password
 * @route   PUT /api/v1/auth/password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.validatedData;

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.AUTH.USER_NOT_FOUND
    );
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      'Current password is incorrect'
    );
  }

  // Update password
  user.password = newPassword;
  await user.save();

  logger.info(`Password changed: ${user.email}`);

  sendSuccess(res, null, 'Password changed successfully');
});

/**
 * @desc    Refresh JWT token
 * @route   POST /api/v1/auth/refresh
 * @access  Private
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user || !user.isActive) {
    throw new ApiError(
      STATUS_CODES.UNAUTHORIZED,
      MESSAGES.AUTH.UNAUTHORIZED
    );
  }

  // Generate new token
  const token = generateToken({ id: user._id });

  sendSuccess(res, { token }, 'Token refreshed successfully');
});

export default {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  refreshToken
};
