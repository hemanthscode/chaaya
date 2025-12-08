/**
 * Analytics Service
 * Handles all analytics-related API calls
 */

import api from './api';

const ANALYTICS_BASE = '/analytics';

/**
 * Get dashboard statistics (Admin only)
 * @returns {Promise} API response with dashboard stats
 */
export const getDashboard = async () => {
  const response = await api.get(`${ANALYTICS_BASE}/dashboard`);
  return response.data;
};

/**
 * Get recent analytics (Admin only)
 * @param {number} days - Number of days (default: 7)
 * @returns {Promise} API response with recent stats
 */
export const getRecent = async (days = 7) => {
  const response = await api.get(`${ANALYTICS_BASE}/recent`, {
    params: { days }
  });
  return response.data;
};

/**
 * Get analytics by date range (Admin only)
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @returns {Promise} API response with analytics data
 */
export const getByDateRange = async (startDate, endDate) => {
  const response = await api.get(`${ANALYTICS_BASE}/range`, {
    params: { startDate, endDate }
  });
  return response.data;
};

export default {
  getDashboard,
  getRecent,
  getByDateRange,
};
