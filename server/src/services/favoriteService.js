import Favorite from '../models/Favorite.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

export const toggleFavorite = async (userId, imageId) => {
  const existing = await Favorite.findOne({ user: userId, image: imageId });
  
  if (existing) {
    await Favorite.findByIdAndDelete(existing._id);
    return { action: 'removed', favorites: await getUserFavorites(userId) };
  }

  await Favorite.create({ user: userId, image: imageId });
  return { action: 'added', favorites: await getUserFavorites(userId) };
};

export const getUserFavorites = async (userId) => 
  await Favorite.find({ user: userId }).populate('image', 'title cloudinaryUrl thumbnailUrl');

export default { toggleFavorite, getUserFavorites };
