/**
 * Authentication Validators
 * Validates auth-related request data
 */

import { 
  isValidEmail, 
  isStrongPassword, 
  sanitizeString 
} from '../utils/validators.js';

/**
 * Validate registration data
 */
export const validateRegister = (body) => {
  const errors = [];
  const data = {};

  // Name validation
  if (!body.name || body.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (body.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (body.name.trim().length > 50) {
    errors.push('Name cannot exceed 50 characters');
  } else {
    data.name = sanitizeString(body.name);
  }

  // Email validation
  if (!body.email || body.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(body.email)) {
    errors.push('Please provide a valid email address');
  } else {
    data.email = body.email.toLowerCase().trim();
  }

  // Password validation
  if (!body.password || body.password.length === 0) {
    errors.push('Password is required');
  } else if (!isStrongPassword(body.password)) {
    errors.push(
      'Password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'
    );
  } else {
    data.password = body.password;
  }

  // Confirm password validation
  if (body.password !== body.confirmPassword) {
    errors.push('Passwords do not match');
  }

  return { errors, data };
};

/**
 * Validate login data
 */
export const validateLogin = (body) => {
  const errors = [];
  const data = {};

  // Email validation
  if (!body.email || body.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(body.email)) {
    errors.push('Please provide a valid email address');
  } else {
    data.email = body.email.toLowerCase().trim();
  }

  // Password validation
  if (!body.password || body.password.length === 0) {
    errors.push('Password is required');
  } else {
    data.password = body.password;
  }

  return { errors, data };
};

/**
 * Validate profile update data
 */
export const validateProfileUpdate = (body) => {
  const errors = [];
  const data = {};

  // Name (optional)
  if (body.name !== undefined) {
    if (body.name.trim().length < 2) {
      errors.push('Name must be at least 2 characters');
    } else if (body.name.trim().length > 50) {
      errors.push('Name cannot exceed 50 characters');
    } else {
      data.name = sanitizeString(body.name);
    }
  }

  // Bio (optional)
  if (body.bio !== undefined) {
    if (body.bio.length > 500) {
      errors.push('Bio cannot exceed 500 characters');
    } else {
      data.bio = sanitizeString(body.bio);
    }
  }

  // Website (optional)
  if (body.website !== undefined && body.website.trim().length > 0) {
    data.website = body.website.trim();
  }

  // Social links (optional)
  if (body.social !== undefined) {
    data.social = {};
    ['instagram', 'twitter', 'facebook', 'linkedin'].forEach(platform => {
      if (body.social[platform]) {
        data.social[platform] = body.social[platform].trim();
      }
    });
  }

  return { errors, data };
};

/**
 * Validate password change
 */
export const validatePasswordChange = (body) => {
  const errors = [];
  const data = {};

  // Current password
  if (!body.currentPassword) {
    errors.push('Current password is required');
  } else {
    data.currentPassword = body.currentPassword;
  }

  // New password
  if (!body.newPassword) {
    errors.push('New password is required');
  } else if (!isStrongPassword(body.newPassword)) {
    errors.push(
      'New password must be at least 8 characters with 1 uppercase, 1 lowercase, and 1 number'
    );
  } else {
    data.newPassword = body.newPassword;
  }

  // Confirm new password
  if (body.newPassword !== body.confirmNewPassword) {
    errors.push('New passwords do not match');
  }

  return { errors, data };
};

export default {
  validateRegister,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
};
