import { isValidObjectId, sanitizeString } from '../utils/validators.js';
import { ENUMS } from '../constants/enums.js';

export const validateImageUpload = (body) => {
  const errors = [];
  const data = {};

  if (!body.title?.trim() || body.title.trim().length < 2 || body.title.trim().length > 200) {
    errors.push('Title must be 2-200 characters');
  } else {
    data.title = sanitizeString(body.title);
  }

  if (body.description !== undefined && body.description.length > 2000) {
    errors.push('Description max 2000 characters');
  } else if (body.description !== undefined) {
    data.description = sanitizeString(body.description);
  }

  if (body.category && !isValidObjectId(body.category)) errors.push('Invalid category');
  if (body.series && !isValidObjectId(body.series)) errors.push('Invalid series');

  if (body.tags !== undefined) {
    const tags = Array.isArray(body.tags) 
      ? body.tags.map(t => sanitizeString(t)).filter(t => t)
      : (typeof body.tags === 'string' ? body.tags.split(',').map(sanitizeString).filter(t => t) : []);
    data.tags = tags.slice(0, 20);
  }

  if (body.featured !== undefined) data.featured = !!body.featured;
  if (body.order !== undefined) data.order = parseInt(body.order, 10) || 0;
  if (body.status && !Object.values(ENUMS.IMAGE_STATUS).includes(body.status)) {
    errors.push('Invalid status');
  } else if (body.status) {
    data.status = body.status;
  }

  return { errors, data };
};

export const validateImageUpdate = (body, params) => {
  const errors = [];
  const data = {};

  if (!isValidObjectId(params.id)) {
    errors.push('Invalid image ID');
  }

  if (body.title !== undefined) {
    if (body.title?.trim().length < 2 || body.title?.trim().length > 200) {
      errors.push('Title must be 2-200 characters');
    } else {
      data.title = sanitizeString(body.title);
    }
  }

  if (body.description !== undefined && body.description.length > 2000) {
    errors.push('Description max 2000 characters');
  } else if (body.description !== undefined) {
    data.description = sanitizeString(body.description);
  }

  if (body.category !== undefined) {
    if (body.category === null) {
      data.category = null;
    } else if (!isValidObjectId(body.category)) {
      errors.push('Invalid category');
    } else {
      data.category = body.category;
    }
  }

  if (body.series !== undefined) {
    if (body.series === null) {
      data.series = null;
    } else if (!isValidObjectId(body.series)) {
      errors.push('Invalid series');
    } else {
      data.series = body.series;
    }
  }

  if (body.tags !== undefined) {
    const tags = Array.isArray(body.tags) 
      ? body.tags.map(t => sanitizeString(t)).filter(t => t)
      : (typeof body.tags === 'string' ? body.tags.split(',').map(sanitizeString).filter(t => t) : []);
    data.tags = tags.slice(0, 20);
  }

  if (body.featured !== undefined) data.featured = !!body.featured;
  if (body.order !== undefined) data.order = parseInt(body.order, 10) || 0;
  if (body.status && !Object.values(ENUMS.IMAGE_STATUS).includes(body.status)) {
    errors.push('Invalid status');
  } else if (body.status) {
    data.status = body.status;
  }

  return { errors, data };
};

export const validateImageQuery = (query) => {
  const errors = [];
  const filters = {};

  if (query.category && !isValidObjectId(query.category)) errors.push('Invalid category');
  else if (query.category) filters.category = query.category;

  if (query.series && !isValidObjectId(query.series)) errors.push('Invalid series');
  else if (query.series) filters.series = query.series;

  if (query.status && !Object.values(ENUMS.IMAGE_STATUS).includes(query.status)) {
    errors.push('Invalid status');
  } else if (query.status) {
    filters.status = query.status;
  }

  return { errors, filters };
};

export default { validateImageUpload, validateImageUpdate, validateImageQuery };
