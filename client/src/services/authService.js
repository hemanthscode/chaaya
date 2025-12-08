/**
 * Authentication Service
 * Handles all auth-related API calls
 */

import api from './api';

const AUTH_BASE = '/auth';

/**
 * Register new user
 * @param {object} data - Registration data {name, email, password, confirmPassword}
 * @returns {Promise} API response
 */
export const register = async (data) => {
  const response = await api.post(`${AUTH_BASE}/register`, data);
  return response.data;
};

/**
 * Login user
 * @param {object} credentials - Login credentials {email, password}
 * @returns {Promise} API response with token and user
 */
export const login = async (credentials) => {
  const response = await api.post(`${AUTH_BASE}/login`, credentials);
  return response.data;
};

/**
 * Logout user
 * @returns {Promise} API response
 */
export const logout = async () => {
  const response = await api.post(`${AUTH_BASE}/logout`);
  return response.data;
};

/**
 * Get current user
 * @returns {Promise} API response with user data
 */
export const getMe = async () => {
  const response = await api.get(`${AUTH_BASE}/me`);
  return response.data;
};

/**
 * Update user profile
 * @param {object} data - Profile data to update
 * @returns {Promise} API response with updated user
 */
export const updateProfile = async (data) => {
  const response = await api.put(`${AUTH_BASE}/profile`, data);
  return response.data;
};

/**
 * Change password
 * @param {object} data - Password data {currentPassword, newPassword, confirmNewPassword}
 * @returns {Promise} API response
 */
export const changePassword = async (data) => {
  const response = await api.put(`${AUTH_BASE}/password`, data);
  return response.data;
};

/**
 * Refresh auth token
 * @returns {Promise} API response with new token
 */
export const refreshToken = async () => {
  const response = await api.post(`${AUTH_BASE}/refresh`);
  return response.data;
};

export default {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  changePassword,
  refreshToken,
};
