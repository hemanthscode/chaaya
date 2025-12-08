/**
 * Application Messages
 * Centralized message constants for consistency
 */

export const MESSAGES = {
  // Authentication
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    REGISTER_SUCCESS: 'Registration successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    UNAUTHORIZED: 'Authentication required',
    TOKEN_EXPIRED: 'Token expired, please login again',
    TOKEN_INVALID: 'Invalid token',
    USER_EXISTS: 'User already exists with this email',
    USER_NOT_FOUND: 'User not found'
  },
  
  // Images
  IMAGES: {
    UPLOAD_SUCCESS: 'Image uploaded successfully',
    UPLOAD_MULTIPLE_SUCCESS: 'Images uploaded successfully',
    UPDATE_SUCCESS: 'Image updated successfully',
    DELETE_SUCCESS: 'Image deleted successfully',
    NOT_FOUND: 'Image not found',
    FETCH_SUCCESS: 'Images fetched successfully',
    LIKE_SUCCESS: 'Image liked successfully',
    UNLIKE_SUCCESS: 'Image unliked successfully'
  },
  
  // Series
  SERIES: {
    CREATE_SUCCESS: 'Series created successfully',
    UPDATE_SUCCESS: 'Series updated successfully',
    DELETE_SUCCESS: 'Series deleted successfully',
    NOT_FOUND: 'Series not found',
    FETCH_SUCCESS: 'Series fetched successfully',
    REORDER_SUCCESS: 'Series images reordered successfully'
  },
  
  // Categories
  CATEGORIES: {
    CREATE_SUCCESS: 'Category created successfully',
    UPDATE_SUCCESS: 'Category updated successfully',
    DELETE_SUCCESS: 'Category deleted successfully',
    NOT_FOUND: 'Category not found',
    FETCH_SUCCESS: 'Categories fetched successfully',
    SLUG_EXISTS: 'Category with this slug already exists'
  },
  
  // Contact
  CONTACT: {
    SEND_SUCCESS: 'Message sent successfully',
    SEND_FAILED: 'Failed to send message'
  },
  
  // Validation
  VALIDATION: {
    REQUIRED_FIELDS: 'Please provide all required fields',
    INVALID_EMAIL: 'Please provide a valid email',
    INVALID_ID: 'Invalid ID format',
    INVALID_FILE: 'Invalid file format',
    FILE_TOO_LARGE: 'File size exceeds limit'
  },
  
  // Server
  SERVER: {
    ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    MAINTENANCE: 'Server under maintenance'
  }
};

export default MESSAGES;
