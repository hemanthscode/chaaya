import { isValidEmail, sanitizeString } from '../utils/validators.js';

export const validateContactSubmission = (body) => {
  const errors = [];
  const data = {};

  if (!body.name?.trim() || body.name.trim().length < 2 || body.name.trim().length > 100) {
    errors.push('Name must be 2-100 characters');
  } else {
    data.name = sanitizeString(body.name);
  }

  if (!body.email?.trim() || !isValidEmail(body.email)) {
    errors.push('Valid email required');
  } else {
    data.email = body.email.toLowerCase().trim();
  }

  if (body.message?.trim().length < 10 || body.message?.length > 2000) {
    errors.push('Message must be 10-2000 characters');
  } else {
    data.message = sanitizeString(body.message);
  }

  if (body.subject !== undefined && body.subject.length > 200) {
    errors.push('Subject max 200 characters');
  } else if (body.subject) {
    data.subject = sanitizeString(body.subject);
  }

  if (body.phone !== undefined) data.phone = body.phone?.trim() || null;

  return { errors, data };
};

export default { validateContactSubmission };
