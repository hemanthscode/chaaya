/**
 * Application Constants
 * Centralized configuration and constant values
 */

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Chaya Photography';
export const APP_DESCRIPTION = import.meta.env.VITE_APP_DESCRIPTION || 'Professional Photography Portfolio';

// Pagination
export const IMAGES_PER_PAGE = parseInt(import.meta.env.VITE_IMAGES_PER_PAGE) || 20;
export const SERIES_PER_PAGE = parseInt(import.meta.env.VITE_SERIES_PER_PAGE) || 12;
export const CONTACTS_PER_PAGE = 20;

// Upload Configuration
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760; // 10MB
export const MAX_FILES = parseInt(import.meta.env.VITE_MAX_FILES) || 10;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Image Status
export const IMAGE_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

// Series Status
export const SERIES_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// Sort Options
export const SORT_OPTIONS = {
  NEWEST: { value: 'createdAt', label: 'Newest First', order: 'desc' },
  OLDEST: { value: 'createdAt', label: 'Oldest First', order: 'asc' },
  MOST_VIEWED: { value: 'views', label: 'Most Viewed', order: 'desc' },
  MOST_LIKED: { value: 'likes', label: 'Most Liked', order: 'desc' },
  TITLE_AZ: { value: 'title', label: 'Title (A-Z)', order: 'asc' },
  TITLE_ZA: { value: 'title', label: 'Title (Z-A)', order: 'desc' }
};

// Filter Options
export const FILTER_OPTIONS = {
  ALL: 'all',
  FEATURED: 'featured',
  RECENT: 'recent'
};

// Routes
export const ROUTES = {
  HOME: '/',
  PORTFOLIO: '/portfolio',
  PORTFOLIO_CATEGORY: '/portfolio/:category',
  IMAGE_DETAIL: '/image/:id',
  SERIES_LIST: '/series',
  SERIES_DETAIL: '/series/:slug',
  ABOUT: '/about',
  CONTACT: '/contact',
  SEARCH: '/search',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_IMAGES: '/admin/images',
  ADMIN_SERIES: '/admin/series',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_CONTACTS: '/admin/contacts',
  ADMIN_ANALYTICS: '/admin/analytics'
};

// Toast Configuration
export const TOAST_CONFIG = {
  duration: 4000,
  position: 'top-right',
  style: {
    background: '#333',
    color: '#fff',
    borderRadius: '8px',
    padding: '16px',
  },
  success: {
    duration: 3000,
    iconTheme: {
      primary: '#10b981',
      secondary: '#fff',
    },
  },
  error: {
    duration: 5000,
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
};

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  slideDown: {
    hidden: { y: -20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  scaleIn: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'chaya_auth_token',
  USER: 'chaya_user',
  THEME: 'chaya_theme',
  LIKED_IMAGES: 'chaya_liked_images'
};

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit.`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image file.',
  UPLOAD_FAILED: 'Upload failed. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful!',
  REGISTER: 'Registration successful!',
  LOGOUT: 'Logged out successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  IMAGE_UPLOADED: 'Image uploaded successfully!',
  IMAGE_UPDATED: 'Image updated successfully!',
  IMAGE_DELETED: 'Image deleted successfully!',
  CATEGORY_CREATED: 'Category created successfully!',
  CATEGORY_UPDATED: 'Category updated successfully!',
  CATEGORY_DELETED: 'Category deleted successfully!',
  SERIES_CREATED: 'Series created successfully!',
  SERIES_UPDATED: 'Series updated successfully!',
  SERIES_DELETED: 'Series deleted successfully!',
  CONTACT_SUBMITTED: 'Message sent successfully! We\'ll get back to you soon.',
  CONTACT_MARKED_READ: 'Marked as read!',
  CONTACT_MARKED_REPLIED: 'Marked as replied!',
  CONTACT_DELETED: 'Contact deleted successfully!',
  IMAGE_LIKED: 'Image liked!',
  IMAGE_UNLIKED: 'Image unliked!'
};

export default {
  API_BASE_URL,
  APP_NAME,
  APP_DESCRIPTION,
  IMAGES_PER_PAGE,
  SERIES_PER_PAGE,
  MAX_FILE_SIZE,
  MAX_FILES,
  ACCEPTED_IMAGE_TYPES,
  IMAGE_STATUS,
  SERIES_STATUS,
  USER_ROLES,
  SORT_OPTIONS,
  FILTER_OPTIONS,
  ROUTES,
  TOAST_CONFIG,
  ANIMATION_VARIANTS,
  STORAGE_KEYS,
  THEMES,
  BREAKPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
};
