/**
 * Validation Utilities
 * Functions for validating user input
 */

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result {isValid, errors}
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate name
 * @param {string} name - Name to validate
 * @returns {object} Validation result {isValid, error}
 */
export const validateName = (name) => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: 'Name cannot exceed 50 characters' };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid
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
 * Validate file type
 * @param {File} file - File to validate
 * @param {Array} acceptedTypes - Array of accepted MIME types
 * @returns {boolean} True if valid
 */
export const isValidFileType = (file, acceptedTypes) => {
  return acceptedTypes.includes(file.type);
};

/**
 * Validate file size
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum file size in bytes
 * @returns {boolean} True if valid
 */
export const isValidFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

/**
 * Validate image file
 * @param {File} file - File to validate
 * @param {number} maxSize - Maximum file size
 * @param {Array} acceptedTypes - Accepted MIME types
 * @returns {object} Validation result {isValid, error}
 */
export const validateImageFile = (file, maxSize, acceptedTypes) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }
  
  if (!isValidFileType(file, acceptedTypes)) {
    return { isValid: false, error: 'Invalid file type. Please upload an image file.' };
  }
  
  if (!isValidFileSize(file, maxSize)) {
    return { isValid: false, error: `File size exceeds ${maxSize / 1024 / 1024}MB limit.` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate slug
 * @param {string} slug - Slug to validate
 * @returns {boolean} True if valid
 */
export const isValidSlug = (slug) => {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug);
};

/**
 * Generate slug from string
 * @param {string} text - Text to convert to slug
 * @returns {string} Generated slug
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Sanitize string (remove HTML tags)
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
export const sanitizeString = (str) => {
  if (!str) return '';
  return str.replace(/<[^>]*>/g, '').trim();
};

/**
 * Validate required field
 * @param {any} value - Value to check
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result {isValid, error}
 */
export const validateRequired = (value, fieldName) => {
  if (value === undefined || value === null || value === '' || 
      (Array.isArray(value) && value.length === 0)) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: null };
};

/**
 * Validate string length
 * @param {string} value - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {object} Validation result {isValid, error}
 */
export const validateLength = (value, min, max, fieldName) => {
  if (!value) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (value.length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
  }
  
  if (value.length > max) {
    return { isValid: false, error: `${fieldName} cannot exceed ${max} characters` };
  }
  
  return { isValid: true, error: null };
};

export default {
  isValidEmail,
  validatePassword,
  validateName,
  isValidPhone,
  isValidUrl,
  isValidFileType,
  isValidFileSize,
  validateImageFile,
  isValidSlug,
  generateSlug,
  sanitizeString,
  validateRequired,
  validateLength
};
