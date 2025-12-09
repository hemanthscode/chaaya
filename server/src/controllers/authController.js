import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { ApiError, sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendWelcomeEmail } from '../services/emailService.js';
import logger from '../utils/logger.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.validatedData;

  const existingUser = await User.findOne({ email });
  if (existingUser) throw new ApiError(STATUS_CODES.CONFLICT, MESSAGES.AUTH.USER_EXISTS);

  const user = await User.create({ name, email, password });
  sendWelcomeEmail(user).catch(err => logger.error('Welcome email failed:', err));

  const token = generateToken({ id: user._id });
  const userProfile = user.getPublicProfile(); // ✅ Renamed variable

  logger.info(`New user: ${email}`);
  sendCreated(res, { user: userProfile, token }, MESSAGES.AUTH.REGISTER_SUCCESS);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.validatedData;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !user.isActive) throw new ApiError(STATUS_CODES.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new ApiError(STATUS_CODES.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS);

  await user.updateLastLogin();
  const token = generateToken({ id: user._id });
  
  // ✅ FIXED: Fresh query for profile (after lastLogin update)
  const updatedUser = await User.findById(user._id).select('-password');
  const userProfile = updatedUser.getPublicProfile(); // ✅ Renamed variable

  logger.info(`Login: ${email}`);
  sendSuccess(res, { user: userProfile, token }, MESSAGES.AUTH.LOGIN_SUCCESS);
});

export const logout = asyncHandler(async (req, res) => {
  logger.info(`Logout: ${req.user.email}`);
  sendSuccess(res, null, 'Logged out successfully');
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.AUTH.USER_NOT_FOUND);
  sendSuccess(res, { user: user.getPublicProfile() }, 'Profile retrieved');
});

export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, req.validatedData, { 
    new: true, 
    runValidators: true 
  }).select('-password');
  
  if (!user) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.AUTH.USER_NOT_FOUND);
  sendSuccess(res, { user: user.getPublicProfile() }, 'Profile updated');
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.validatedData;
  const user = await User.findById(req.user.id).select('+password');

  const isValid = await user.comparePassword(currentPassword);
  if (!isValid) throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Current password incorrect');

  user.password = newPassword;
  await user.save();
  sendSuccess(res, null, 'Password changed');
});

export const refreshToken = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user?.isActive) throw new ApiError(STATUS_CODES.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED);

  const token = generateToken({ id: user._id });
  sendSuccess(res, { token }, 'Token refreshed');
});

export default { 
  register, login, logout, getMe, updateProfile, changePassword, refreshToken 
};
