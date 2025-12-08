/**
 * Contact Form Validators
 * Validates contact form submissions
 */

import { 
  isValidEmail, 
  sanitizeString 
} from '../utils/validators.js';

/**
 * Validate contact form submission
 */
export const validateContactSubmission = (body) => {
  const errors = [];
  const data = {};

  // Name validation (required)
  if (!body.name || body.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (body.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  } else if (body.name.trim().length > 100) {
    errors.push('Name cannot exceed 100 characters');
  } else {
    data.name = sanitizeString(body.name);
  }

  // Email validation (required)
  if (!body.email || body.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(body.email)) {
    errors.push('Please provide a valid email address');
  } else {
    data.email = body.email.toLowerCase().trim();
  }

  // Subject (optional)
  if (body.subject !== undefined) {
    if (body.subject.length > 200) {
      errors.push('Subject cannot exceed 200 characters');
    } else {
      data.subject = sanitizeString(body.subject);
    }
  }

  // Message validation (required)
  if (!body.message || body.message.trim().length === 0) {
    errors.push('Message is required');
  } else if (body.message.trim().length < 10) {
    errors.push('Message must be at least 10 characters');
  } else if (body.message.trim().length > 2000) {
    errors.push('Message cannot exceed 2000 characters');
  } else {
    data.message = sanitizeString(body.message);
  }

  // Phone (optional)
  if (body.phone !== undefined && body.phone.trim().length > 0) {
    data.phone = body.phone.trim();
  }

  return { errors, data };
};

export default {
  validateContactSubmission
};
