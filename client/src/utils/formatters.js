/**
 * Formatter Utilities
 * Functions for formatting dates, numbers, and strings
 */

import { format, formatDistance, formatRelative, parseISO } from 'date-fns';

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {string} formatStr - Format string (default: 'MMM dd, yyyy')
 * @returns {string} Formatted date
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Date formatting error:', error);
    return '';
  }
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistance(dateObj, new Date(), { addSuffix: true });
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return '';
  }
};

/**
 * Format date to relative format (e.g., "yesterday at 3:00 PM")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative format string
 */
export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatRelative(dateObj, new Date());
  } catch (error) {
    console.error('Relative date formatting error:', error);
    return '';
  }
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString();
};

/**
 * Format file size to readable string
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length).trim() + '...';
};

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert string to title case
 * @param {string} str - String to convert
 * @returns {string} Title case string
 */
export const toTitleCase = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Format camera settings for display
 * @param {object} metadata - Image metadata object
 * @returns {string} Formatted camera settings
 */
export const formatCameraSettings = (metadata) => {
  if (!metadata) return '';
  
  const parts = [];
  
  if (metadata.iso) parts.push(`ISO ${metadata.iso}`);
  if (metadata.aperture) parts.push(`f/${metadata.aperture}`);
  if (metadata.shutterSpeed) parts.push(metadata.shutterSpeed);
  if (metadata.focalLength) parts.push(metadata.focalLength);
  
  return parts.join(' • ');
};

/**
 * Format image dimensions
 * @param {object} dimensions - Dimensions object {width, height}
 * @returns {string} Formatted dimensions
 */
export const formatDimensions = (dimensions) => {
  if (!dimensions || !dimensions.width || !dimensions.height) return '';
  return `${dimensions.width} × ${dimensions.height}`;
};

/**
 * Format aspect ratio
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} Formatted aspect ratio
 */
export const formatAspectRatio = (width, height) => {
  if (!width || !height) return '';
  
  const ratio = (width / height).toFixed(2);
  
  // Common aspect ratios
  if (Math.abs(ratio - 1.33) < 0.05) return '4:3';
  if (Math.abs(ratio - 1.5) < 0.05) return '3:2';
  if (Math.abs(ratio - 1.78) < 0.05) return '16:9';
  if (Math.abs(ratio - 1) < 0.05) return '1:1';
  if (Math.abs(ratio - 0.67) < 0.05) return '2:3';
  
  return `${ratio}:1`;
};

/**
 * Format tags array to string
 * @param {Array} tags - Array of tags
 * @returns {string} Formatted tags
 */
export const formatTags = (tags) => {
  if (!tags || !Array.isArray(tags) || tags.length === 0) return '';
  return tags.map(tag => `#${tag}`).join(' ');
};

/**
 * Parse tags string to array
 * @param {string} tagsString - String of tags
 * @returns {Array} Array of tags
 */
export const parseTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString
    .split(/[\s,]+/)
    .map(tag => tag.replace(/^#/, '').trim())
    .filter(tag => tag.length > 0);
};

/**
 * Format percentage
 * @param {number} value - Value to format
 * @param {number} total - Total value
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value, total) => {
  if (!total || total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

export default {
  formatDate,
  formatRelativeTime,
  formatRelativeDate,
  formatNumber,
  formatFileSize,
  truncateText,
  capitalize,
  toTitleCase,
  formatCameraSettings,
  formatDimensions,
  formatAspectRatio,
  formatTags,
  parseTags,
  formatPercentage
};
