// validators/imageValidator.js
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

  // Handle category - accept empty string as null
  if (body.category) {
    const cat = body.category.trim();
    if (cat && !isValidObjectId(cat)) {
      errors.push('Invalid category');
    } else if (cat) {
      data.category = cat;
    }
  }

  // Handle series - accept empty string as null
  if (body.series) {
    const ser = body.series.trim();
    if (ser && !isValidObjectId(ser)) {
      errors.push('Invalid series');
    } else if (ser) {
      data.series = ser;
    }
  }

  if (body.tags !== undefined) {
    const tags = Array.isArray(body.tags)
      ? body.tags.map((t) => sanitizeString(t)).filter((t) => t)
      : typeof body.tags === 'string'
      ? body.tags
          .split(',')
          .map(sanitizeString)
          .filter((t) => t)
      : [];
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
    if (!body.title?.trim() || body.title.trim().length < 2 || body.title.trim().length > 200) {
      errors.push('Title must be 2-200 characters');
    } else {
      data.title = sanitizeString(body.title);
    }
  }

  if (body.description !== undefined) {
    if (body.description && body.description.length > 2000) {
      errors.push('Description max 2000 characters');
    } else {
      data.description = body.description ? sanitizeString(body.description) : '';
    }
  }

  // Handle category - treat empty string as null
  if (body.category !== undefined) {
    const cat = typeof body.category === 'string' ? body.category.trim() : body.category;
    if (cat === null || cat === '') {
      data.category = null;
    } else if (!isValidObjectId(cat)) {
      errors.push('Invalid category');
    } else {
      data.category = cat;
    }
  }

  // Handle series - treat empty string as null
  if (body.series !== undefined) {
    const ser = typeof body.series === 'string' ? body.series.trim() : body.series;
    if (ser === null || ser === '') {
      data.series = null;
    } else if (!isValidObjectId(ser)) {
      errors.push('Invalid series');
    } else {
      data.series = ser;
    }
  }

  if (body.tags !== undefined) {
    const tags = Array.isArray(body.tags)
      ? body.tags.map((t) => sanitizeString(t)).filter((t) => t)
      : typeof body.tags === 'string'
      ? body.tags
          .split(',')
          .map(sanitizeString)
          .filter((t) => t)
      : [];
    data.tags = tags.slice(0, 20);
  }

  if (body.featured !== undefined) data.featured = !!body.featured;
  if (body.order !== undefined) data.order = parseInt(body.order, 10) || 0;
  
  if (body.status) {
    if (!Object.values(ENUMS.IMAGE_STATUS).includes(body.status)) {
      errors.push('Invalid status');
    } else {
      data.status = body.status;
    }
  }

  return { errors, data };
};

export const validateImageQuery = (query) => {
  const errors = [];
  const filters = {};

  if (query.category) {
    if (!isValidObjectId(query.category)) {
      errors.push('Invalid category');
    } else {
      filters.category = query.category;
    }
  }

  if (query.series) {
    if (!isValidObjectId(query.series)) {
      errors.push('Invalid series');
    } else {
      filters.series = query.series;
    }
  }

  if (query.status && !Object.values(ENUMS.IMAGE_STATUS).includes(query.status)) {
    errors.push('Invalid status');
  } else if (query.status) {
    filters.status = query.status;
  }

  return { errors, filters };
};

export default { validateImageUpload, validateImageUpdate, validateImageQuery };
