/**
 * Local Storage Utilities
 * Functions for managing browser local storage
 */

import { STORAGE_KEYS } from './constants';

/**
 * Get item from local storage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} Stored value or default
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Set item in local storage
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @returns {boolean} Success status
 */
export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Remove item from local storage
 * @param {string} key - Storage key
 * @returns {boolean} Success status
 */
export const removeItem = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear all items from local storage
 * @returns {boolean} Success status
 */
export const clear = () => {
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

/**
 * Check if key exists in local storage
 * @param {string} key - Storage key
 * @returns {boolean} True if exists
 */
export const hasItem = (key) => {
  return window.localStorage.getItem(key) !== null;
};

/**
 * Get auth token from storage
 * @returns {string|null} Auth token
 */
export const getAuthToken = () => {
  return getItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Set auth token in storage
 * @param {string} token - Auth token
 * @returns {boolean} Success status
 */
export const setAuthToken = (token) => {
  return setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

/**
 * Remove auth token from storage
 * @returns {boolean} Success status
 */
export const removeAuthToken = () => {
  return removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

/**
 * Get user data from storage
 * @returns {object|null} User data
 */
export const getUser = () => {
  return getItem(STORAGE_KEYS.USER);
};

/**
 * Set user data in storage
 * @param {object} user - User data
 * @returns {boolean} Success status
 */
export const setUser = (user) => {
  return setItem(STORAGE_KEYS.USER, user);
};

/**
 * Remove user data from storage
 * @returns {boolean} Success status
 */
export const removeUser = () => {
  return removeItem(STORAGE_KEYS.USER);
};

/**
 * Get theme from storage
 * @returns {string} Theme ('light' or 'dark')
 */
export const getTheme = () => {
  return getItem(STORAGE_KEYS.THEME, 'light');
};

/**
 * Set theme in storage
 * @param {string} theme - Theme ('light' or 'dark')
 * @returns {boolean} Success status
 */
export const setTheme = (theme) => {
  return setItem(STORAGE_KEYS.THEME, theme);
};

/**
 * Get liked images from storage
 * @returns {Array} Array of liked image IDs
 */
export const getLikedImages = () => {
  return getItem(STORAGE_KEYS.LIKED_IMAGES, []);
};

/**
 * Add image to liked list
 * @param {string} imageId - Image ID
 * @returns {boolean} Success status
 */
export const addLikedImage = (imageId) => {
  const liked = getLikedImages();
  if (!liked.includes(imageId)) {
    liked.push(imageId);
    return setItem(STORAGE_KEYS.LIKED_IMAGES, liked);
  }
  return true;
};

/**
 * Remove image from liked list
 * @param {string} imageId - Image ID
 * @returns {boolean} Success status
 */
export const removeLikedImage = (imageId) => {
  const liked = getLikedImages();
  const filtered = liked.filter(id => id !== imageId);
  return setItem(STORAGE_KEYS.LIKED_IMAGES, filtered);
};

/**
 * Check if image is liked
 * @param {string} imageId - Image ID
 * @returns {boolean} True if liked
 */
export const isImageLiked = (imageId) => {
  const liked = getLikedImages();
  return liked.includes(imageId);
};

/**
 * Clear all auth-related data
 * @returns {boolean} Success status
 */
export const clearAuthData = () => {
  removeAuthToken();
  removeUser();
  return true;
};

export default {
  getItem,
  setItem,
  removeItem,
  clear,
  hasItem,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUser,
  setUser,
  removeUser,
  getTheme,
  setTheme,
  getLikedImages,
  addLikedImage,
  removeLikedImage,
  isImageLiked,
  clearAuthData
};
