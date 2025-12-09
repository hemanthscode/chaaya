import { ApiError, sendSuccess } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { toggleFavorite, getUserFavorites } from '../services/favoriteService.js';

export const toggleFavoriteImage = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Authentication required');
  
  const result = await toggleFavorite(req.user.id, req.params.id);
  sendSuccess(res, result, result.action === 'added' ? 'Added to favorites' : 'Removed from favorites');
});

export const getFavorites = asyncHandler(async (req, res) => {
  if (!req.user) throw new ApiError(STATUS_CODES.UNAUTHORIZED, 'Authentication required');
  
  const favorites = await getUserFavorites(req.user.id);
  sendSuccess(res, { favorites }, 'Favorites retrieved');
});

export default { toggleFavoriteImage, getFavorites };
