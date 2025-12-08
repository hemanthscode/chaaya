/**
 * Series Service
 * Handles all series-related API calls
 */

import api from './api';

const SERIES_BASE = '/series';

/**
 * Get all series with filters and pagination
 * @param {object} params - Query parameters {page, limit, status, featured}
 * @returns {Promise} API response with series array
 */
export const getAll = async (params = {}) => {
  const response = await api.get(SERIES_BASE, { params });
  return response.data;
};

/**
 * Get series by slug
 * @param {string} slug - Series slug
 * @returns {Promise} API response with series data
 */
export const getBySlug = async (slug) => {
  const response = await api.get(`${SERIES_BASE}/${slug}`);
  return response.data;
};

/**
 * Create new series (Admin only)
 * @param {object} data - Series data {title, slug, description, featured, status}
 * @returns {Promise} API response with created series
 */
export const create = async (data) => {
  const response = await api.post(SERIES_BASE, data);
  return response.data;
};

/**
 * Update series (Admin only)
 * @param {string} id - Series ID
 * @param {object} data - Updated series data
 * @returns {Promise} API response with updated series
 */
export const update = async (id, data) => {
  const response = await api.put(`${SERIES_BASE}/${id}`, data);
  return response.data;
};

/**
 * Delete series (Admin only)
 * @param {string} id - Series ID
 * @returns {Promise} API response
 */
export const deleteSeries = async (id) => {
  const response = await api.delete(`${SERIES_BASE}/${id}`);
  return response.data;
};

/**
 * Add single image to series (Admin only)
 * @param {string} seriesId - Series ID
 * @param {string} imageId - Image ID
 * @returns {Promise} API response
 */
export const addImage = async (seriesId, imageId) => {
  const response = await api.post(`${SERIES_BASE}/${seriesId}/images/${imageId}`);
  return response.data;
};

/**
 * ✅ Add multiple images to series (loops through single add)
 * @param {string} seriesId - Series ID
 * @param {Array} imageIds - Array of Image IDs
 * @returns {Promise} Result object {success, failed, total}
 */
export const addImages = async (seriesId, imageIds) => {
  try {
    const promises = imageIds.map(imageId => addImage(seriesId, imageId));
    const results = await Promise.allSettled(promises);
    
    // Filter successful additions
    const successful = results.filter(result => result.status === 'fulfilled');
    const failed = results.filter(result => result.status === 'rejected');
    
    if (failed.length > 0) {
      console.warn(`Failed to add ${failed.length} images to series`);
    }
    
    return {
      success: successful.length,
      failed: failed.length,
      total: imageIds.length
    };
  } catch (error) {
    throw new Error(`Failed to add images: ${error.message}`);
  }
};

/**
 * ✅ Remove image from series (Admin only)
 * @param {string} seriesId - Series ID
 * @param {string} imageId - Image ID
 * @returns {Promise} API response
 */
export const removeImage = async (seriesId, imageId) => {
  try {
    const response = await api.delete(`${SERIES_BASE}/${seriesId}/images/${imageId}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to remove image: ${error.response?.data?.message || error.message}`);
  }
};

/**
 * Reorder images in series (Admin only)
 * @param {string} id - Series ID
 * @param {Array} imageIds - Ordered array of image IDs
 * @returns {Promise} API response
 */
export const reorderImages = async (id, imageIds) => {
  const response = await api.put(`${SERIES_BASE}/${id}/reorder`, { imageIds });
  return response.data;
};

export default {
  getAll,
  getBySlug,
  create,
  update,
  deleteSeries,
  addImage,
  addImages,
  removeImage,  
  reorderImages,
};
