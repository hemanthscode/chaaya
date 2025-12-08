/**
 * Category Service
 * Handles all category-related API calls
 */

import api from './api';

const CATEGORY_BASE = '/categories';

/**
 * Get all categories
 * @returns {Promise} API response with categories array
 */
export const getAll = async () => {
  const response = await api.get(CATEGORY_BASE);
  return response.data;
};

/**
 * Get category by slug
 * @param {string} slug - Category slug
 * @returns {Promise} API response with category data
 */
export const getBySlug = async (slug) => {
  const response = await api.get(`${CATEGORY_BASE}/${slug}`);
  return response.data;
};

/**
 * Get category statistics
 * @param {string} id - Category ID
 * @returns {Promise} API response with stats
 */
export const getStats = async (id) => {
  const response = await api.get(`${CATEGORY_BASE}/${id}/stats`);
  return response.data;
};

/**
 * Create new category (Admin only)
 * @param {object} data - Category data {name, slug, description, order}
 * @returns {Promise} API response with created category
 */
export const create = async (data) => {
  const response = await api.post(CATEGORY_BASE, data);
  return response.data;
};

/**
 * Update category (Admin only)
 * @param {string} id - Category ID
 * @param {object} data - Updated category data
 * @returns {Promise} API response with updated category
 */
export const update = async (id, data) => {
  const response = await api.put(`${CATEGORY_BASE}/${id}`, data);
  return response.data;
};

/**
 * Delete category (Admin only)
 * @param {string} id - Category ID
 * @returns {Promise} API response
 */
export const deleteCategory = async (id) => {
  const response = await api.delete(`${CATEGORY_BASE}/${id}`);
  return response.data;
};

export default {
  getAll,
  getBySlug,
  getStats,
  create,
  update,
  deleteCategory,
};
