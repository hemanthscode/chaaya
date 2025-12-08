/**
 * Dashboard Service
 * API calls for admin dashboard
 */

import api from './api';

/**
 * Get dashboard statistics
 */
export const getStats = async () => {
  try {
    const response = await api.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get analytics data
 */
export const getAnalytics = async (params = {}) => {
  try {
    const response = await api.get('/admin/dashboard/analytics', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get recent activity
 */
export const getRecentActivity = async (limit = 10) => {
  try {
    const response = await api.get('/admin/dashboard/activity', {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get overview stats
 */
export const getOverview = async () => {
  try {
    const response = await api.get('/admin/dashboard/overview');
    return response.data;
  } catch (error) {
    throw error;
  }
};
