/**
 * Contact Service
 * Handles all contact form related API calls
 */

import api from './api';

const CONTACT_BASE = '/contact';

/**
 * Submit contact form
 * @param {object} data - Contact form data {name, email, subject, message, phone}
 * @returns {Promise} API response
 */
export const submit = async (data) => {
  const response = await api.post(CONTACT_BASE, data);
  return response.data;
};

/**
 * Get all contact submissions (Admin only)
 * @param {object} params - Query parameters {page, limit, isRead}
 * @returns {Promise} API response with contacts array
 */
export const getAll = async (params = {}) => {
  const response = await api.get(CONTACT_BASE, { params });
  return response.data;
};

/**
 * Get contact by ID (Admin only)
 * @param {string} id - Contact ID
 * @returns {Promise} API response with contact data
 */
export const getById = async (id) => {
  const response = await api.get(`${CONTACT_BASE}/${id}`);
  return response.data;
};

/**
 * Mark contact as read (Admin only)
 * @param {string} id - Contact ID
 * @returns {Promise} API response
 */
export const markAsRead = async (id) => {
  const response = await api.put(`${CONTACT_BASE}/${id}/read`);
  return response.data;
};

/**
 * Mark contact as replied (Admin only)
 * @param {string} id - Contact ID
 * @param {string} notes - Reply notes
 * @returns {Promise} API response
 */
export const markAsReplied = async (id, notes = '') => {
  const response = await api.put(`${CONTACT_BASE}/${id}/replied`, { notes });
  return response.data;
};

/**
 * Delete contact (Admin only)
 * @param {string} id - Contact ID
 * @returns {Promise} API response
 */
export const deleteContact = async (id) => {
  const response = await api.delete(`${CONTACT_BASE}/${id}`);
  return response.data;
};

export default {
  submit,
  getAll,
  getById,
  markAsRead,
  markAsReplied,
  deleteContact,
};
