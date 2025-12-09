import { isValidEmail, isStrongPassword, sanitizeString } from '../utils/validators.js';

export const validateRegister = (body) => {
  const errors = [];
  const data = {};

  if (!body.name?.trim() || body.name.trim().length < 2 || body.name.trim().length > 50) {
    errors.push('Name must be 2-50 characters');
  } else {
    data.name = sanitizeString(body.name);
  }

  if (!body.email?.trim() || !isValidEmail(body.email)) {
    errors.push('Valid email required');
  } else {
    data.email = body.email.toLowerCase().trim();
  }

  if (!body.password || !isStrongPassword(body.password)) {
    errors.push('Password: 8+ chars, 1 upper, 1 lower, 1 number');
  } else {
    data.password = body.password;
  }

  if (body.password !== body.confirmPassword) {
    errors.push('Passwords do not match');
  }

  return { errors, data };
};

export const validateLogin = (body) => {
  const errors = [];
  const data = {};

  if (!body.email?.trim() || !isValidEmail(body.email)) {
    errors.push('Valid email required');
  } else {
    data.email = body.email.toLowerCase().trim();
  }

  if (body.password) {
    data.password = body.password;
  } else {
    errors.push('Password required');
  }

  return { errors, data };
};

export const validateProfileUpdate = (body) => {
  const errors = [];
  const data = {};

  if (body.name !== undefined) {
    const name = body.name?.trim();
    if (name && (name.length < 2 || name.length > 50)) {
      errors.push('Name must be 2-50 characters');
    } else if (name) {
      data.name = sanitizeString(name);
    }
  }

  if (body.bio !== undefined && body.bio.length > 500) {
    errors.push('Bio max 500 characters');
  } else if (body.bio !== undefined) {
    data.bio = sanitizeString(body.bio);
  }

  if (body.website !== undefined) data.website = body.website?.trim() || null;

  if (body.social !== undefined) {
    data.social = {};
    ['instagram', 'twitter', 'facebook', 'linkedin'].forEach(platform => {
      if (body.social?.[platform]) data.social[platform] = body.social[platform].trim();
    });
  }

  return { errors, data };
};

export const validatePasswordChange = (body) => {
  const errors = [];
  const data = {};

  if (!body.currentPassword) errors.push('Current password required');
  else data.currentPassword = body.currentPassword;

  if (!body.newPassword || !isStrongPassword(body.newPassword)) {
    errors.push('New password: 8+ chars, 1 upper, 1 lower, 1 number');
  } else {
    data.newPassword = body.newPassword;
  }

  if (body.newPassword !== body.confirmNewPassword) {
    errors.push('New passwords do not match');
  }

  return { errors, data };
};

export default {
  validateRegister, validateLogin, validateProfileUpdate, validatePasswordChange
};
