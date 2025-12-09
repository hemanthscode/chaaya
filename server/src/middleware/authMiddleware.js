import { verifyToken } from '../utils/generateToken.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { ENUMS } from '../constants/enums.js';

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization?.startsWith('Bearer') 
      ? req.headers.authorization.split(' ')[1] 
      : null;

    if (!token) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Authentication required');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user || !user.isActive) {
      throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    next(new ApiError(STATUS_CODES.UNAUTHORIZED, 'Invalid token'));
  }
};

export const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, 'Access denied');
  }
  next();
};

export const adminOnly = restrictTo(ENUMS.USER_ROLES.ADMIN);

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer') 
      ? req.headers.authorization.split(' ')[1] 
      : null;

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id).select('-password');
      if (user?.isActive) req.user = user;
    }
    next();
  } catch {
    next();
  }
};

export default { protect, restrictTo, adminOnly, optionalAuth };
