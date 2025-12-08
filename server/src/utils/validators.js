/**
 * Common Validation Utilities
 * Reusable validation functions
 */

import mongoose from 'mongoose';

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate URL format
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate slug format (lowercase, alphanumeric, hyphens)
 */
export const isValidSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Sanitize string (remove HTML tags and trim)
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
};

/**
 * Generate slug from string
 */
export const generateSlug = (str) => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with hyphens
    .replace(/-+/g, '-');      // Replace multiple hyphens with single hyphen
};

/**
 * Validate password strength
 * At least 8 characters, 1 uppercase, 1 lowercase, 1 number
 */
export const isStrongPassword = (password) => {
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongPasswordRegex.test(password);
};

/**
 * Validate image file extension
 */
export const isValidImageExtension = (filename) => {
  const validExtensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const ext = filename.split('.').pop().toLowerCase();
  return validExtensions.includes(ext);
};

/**
 * Parse pagination parameters
 */
export const parsePagination = (page, limit) => {
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  
  return {
    page: parsedPage > 0 ? parsedPage : 1,
    limit: parsedLimit > 0 && parsedLimit <= 100 ? parsedLimit : 20,
    skip: function() {
      return (this.page - 1) * this.limit;
    }
  };
};

export default {
  isValidObjectId,
  isValidEmail,
  isValidUrl,
  isValidSlug,
  sanitizeString,
  generateSlug,
  isStrongPassword,
  isValidImageExtension,
  parsePagination
};
