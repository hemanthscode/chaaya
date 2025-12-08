/**
 * Image Service
 * Handles all image-related API calls
 */

import api from './api';

const IMAGE_BASE = '/images';
const UPLOAD_BASE = '/upload';

/**
 * Get all images with filters and pagination
 * @param {object} params - Query parameters {page, limit, status, featured, category, sortBy, order}
 * @returns {Promise} API response with images array and pagination
 */
export const getAll = async (params = {}) => {
  const response = await api.get(IMAGE_BASE, { params });
  return response.data;
};

/**
 * Get image by ID
 * @param {string} id - Image ID
 * @returns {Promise} API response with image data
 */
export const getById = async (id) => {
  const response = await api.get(`${IMAGE_BASE}/${id}`);
  return response.data;
};

/**
 * Get featured images
 * @param {number} limit - Number of images to fetch
 * @returns {Promise} API response with featured images
 */
export const getFeatured = async (limit = 10) => {
  const response = await api.get(`${IMAGE_BASE}/featured`, { params: { limit } });
  return response.data;
};

/**
 * Get images by category slug
 * @param {string} slug - Category slug
 * @param {object} params - Query parameters {page, limit, sortBy, order}
 * @returns {Promise} API response with images
 */
export const getByCategory = async (slug, params = {}) => {
  const response = await api.get(`${IMAGE_BASE}/category/${slug}`, { params });
  return response.data;
};

/**
 * Get images by series slug
 * @param {string} slug - Series slug
 * @param {object} params - Query parameters
 * @returns {Promise} API response with images
 */
export const getBySeries = async (slug, params = {}) => {
  const response = await api.get(`${IMAGE_BASE}/series/${slug}`, { params });
  return response.data;
};

/**
 * Search images
 * @param {string} query - Search query
 * @param {object} params - Additional parameters {page, limit}
 * @returns {Promise} API response with search results
 */
export const search = async (query, params = {}) => {
  const response = await api.get(`${IMAGE_BASE}/search`, {
    params: { q: query, ...params }
  });
  return response.data;
};

/**
 * Toggle like on image
 * @param {string} id - Image ID
 * @param {string} action - Action ('like' or 'unlike')
 * @returns {Promise} API response
 */
export const toggleLike = async (id, action = 'like') => {
  const response = await api.post(`${IMAGE_BASE}/${id}/like`, { action });
  return response.data;
};

/**
 * Upload single image
 * @param {FormData} formData - Form data with image file and metadata
 * @param {function} onProgress - Progress callback
 * @returns {Promise} API response with uploaded image
 */
export const upload = async (formData, onProgress) => {
  const response = await api.post(`${UPLOAD_BASE}/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

/**
 * Upload multiple images
 * @param {FormData} formData - Form data with multiple image files
 * @param {function} onProgress - Progress callback
 * @returns {Promise} API response with uploaded images
 */
export const uploadMultiple = async (formData, onProgress) => {
  const response = await api.post(`${UPLOAD_BASE}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

/**
 * Update image
 * @param {string} id - Image ID
 * @param {object} data - Updated image data
 * @returns {Promise} API response with updated image
 */
export const update = async (id, data) => {
  const response = await api.put(`${IMAGE_BASE}/${id}`, data);
  return response.data;
};

/**
 * Delete image
 * @param {string} id - Image ID
 * @returns {Promise} API response
 */
export const deleteImage = async (id) => {
  const response = await api.delete(`${IMAGE_BASE}/${id}`);
  return response.data;
};

/**
 * Delete Cloudinary image by public ID
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise} API response
 */
export const deleteCloudinaryImage = async (publicId) => {
  const response = await api.delete(`${UPLOAD_BASE}/${publicId}`);
  return response.data;
};

export default {
  getAll,
  getById,
  getFeatured,
  getByCategory,
  getBySeries,
  search,
  toggleLike,
  upload,
  uploadMultiple,
  update,
  deleteImage,
  deleteCloudinaryImage,
};
