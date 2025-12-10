import { isValidObjectId, isValidSlug, sanitizeString, generateSlug } from '../utils/validators.js';
import { ENUMS } from '../constants/enums.js';

export const validateSeriesCreate = (body) => {
  const errors = [];
  const data = {};

  if (!body.title?.trim() || body.title.trim().length < 2 || body.title.trim().length > 100) {
    errors.push('Title must be 2-100 characters');
  } else {
    data.title = sanitizeString(body.title);
  }

  if (body.slug && !isValidSlug(body.slug)) {
    errors.push('Invalid slug format');
  } else if (body.slug) {
    data.slug = body.slug;
  } else if (data.title) {
    data.slug = generateSlug(data.title);
  }

  if (body.description !== undefined && body.description.length > 1000) {
    errors.push('Description max 1000 characters');
  } else if (body.description !== undefined) {
    data.description = sanitizeString(body.description);
  }

  if (body.category && !isValidObjectId(body.category)) errors.push('Invalid category');
  if (body.coverImage && !isValidObjectId(body.coverImage)) errors.push('Invalid cover image');

  if (body.images !== undefined) {
    if (!Array.isArray(body.images)) {
      errors.push('Images must be array');
    } else {
      const invalid = body.images.filter(id => !isValidObjectId(id));
      if (invalid.length) errors.push('Invalid image IDs');
      else data.images = body.images;
    }
  }

  if (body.featured !== undefined) data.featured = !!body.featured;
  if (body.order !== undefined) data.order = parseInt(body.order, 10) || 0;
  if (body.status && !Object.values(ENUMS.SERIES_STATUS).includes(body.status)) {
    errors.push('Invalid status');
  } else if (body.status) {
    data.status = body.status;
  }

  return { errors, data };
};

export const validateSeriesUpdate = (body, params) => {
  const errors = [];
  const data = {};

  if (!isValidObjectId(params.id)) {
    errors.push('Invalid series ID');
  }

  if (body.title !== undefined) {
    if (body.title?.trim().length < 2 || body.title?.trim().length > 100) {
      errors.push('Title must be 2-100 characters');
    } else {
      data.title = sanitizeString(body.title);
    }
  }

  if (body.slug !== undefined && !isValidSlug(body.slug)) {
    errors.push('Invalid slug format');
  } else if (body.slug !== undefined) {
    data.slug = body.slug;
  }

  if (body.description !== undefined && body.description.length > 1000) {
    errors.push('Description max 1000 characters');
  } else if (body.description !== undefined) {
    data.description = sanitizeString(body.description);
  }

  if (body.category !== undefined) {
    if (body.category === null || body.category === '') {
      data.category = null;
    } else if (!isValidObjectId(body.category)) {
      errors.push('Invalid category');
    } else {
      data.category = body.category;
    }
  }

  if (body.coverImage !== undefined) {
    if (body.coverImage === null || body.coverImage === '') {
      data.coverImage = null;
    } else if (!isValidObjectId(body.coverImage)) {
      errors.push('Invalid cover image');
    } else {
      data.coverImage = body.coverImage;
    }
  }

  if (body.images !== undefined) {
    if (!Array.isArray(body.images)) {
      errors.push('Images must be array');
    } else {
      const invalid = body.images.filter(id => !isValidObjectId(id));
      if (invalid.length) errors.push('Invalid image IDs');
      else data.images = body.images;
    }
  }

  if (body.featured !== undefined) data.featured = !!body.featured;
  if (body.order !== undefined) data.order = parseInt(body.order, 10) || 0;
  
  if (body.status !== undefined) {
    if (!Object.values(ENUMS.SERIES_STATUS).includes(body.status)) {
      errors.push('Invalid status');
    } else {
      data.status = body.status;
    }
  }

  return { errors, data };
};

export const validateSeriesReorder = (body) => {
  const errors = [];
  const data = {};

  if (!Array.isArray(body.imageIds)) {
    errors.push('imageIds must be array');
  } else {
    const invalid = body.imageIds.filter(id => !isValidObjectId(id));
    if (invalid.length) errors.push('Invalid image IDs');
    else data.imageIds = body.imageIds;
  }

  return { errors, data };
};

export const validateSeriesQuery = (query) => {
  const errors = [];
  const filters = {};

  if (query.category && !isValidObjectId(query.category)) errors.push('Invalid category');
  else if (query.category) filters.category = query.category;

  if (query.status && !Object.values(ENUMS.SERIES_STATUS).includes(query.status)) {
    errors.push('Invalid status');
  } else if (query.status) {
    filters.status = query.status;
  }

  return { errors, filters };
};

export default { 
  validateSeriesCreate, 
  validateSeriesUpdate, 
  validateSeriesReorder, 
  validateSeriesQuery 
};
