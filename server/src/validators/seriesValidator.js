/**
 * Series Validators
 * Validates series-related request data
 */

import { 
  isValidObjectId, 
  isValidSlug,
  sanitizeString,
  generateSlug 
} from '../utils/validators.js';
import { ENUMS } from '../constants/enums.js';

/**
 * Validate series creation data
 */
export const validateSeriesCreate = (body) => {
  const errors = [];
  const data = {};

  // Title validation (required)
  if (!body.title || body.title.trim().length === 0) {
    errors.push('Series title is required');
  } else if (body.title.trim().length < 2) {
    errors.push('Title must be at least 2 characters');
  } else if (body.title.trim().length > 100) {
    errors.push('Title cannot exceed 100 characters');
  } else {
    data.title = sanitizeString(body.title);
  }

  // Slug validation (auto-generate if not provided)
  if (body.slug) {
    if (!isValidSlug(body.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    } else {
      data.slug = body.slug;
    }
  } else if (data.title) {
    data.slug = generateSlug(data.title);
  }

  // Description (optional)
  if (body.description !== undefined) {
    if (body.description.length > 1000) {
      errors.push('Description cannot exceed 1000 characters');
    } else {
      data.description = sanitizeString(body.description);
    }
  }

  // Category (optional)
  if (body.category !== undefined && body.category !== null) {
    if (!isValidObjectId(body.category)) {
      errors.push('Invalid category ID');
    } else {
      data.category = body.category;
    }
  }

  // Cover image (optional)
  if (body.coverImage !== undefined && body.coverImage !== null) {
    if (!isValidObjectId(body.coverImage)) {
      errors.push('Invalid cover image ID');
    } else {
      data.coverImage = body.coverImage;
    }
  }

  // Images array (optional)
  if (body.images !== undefined) {
    if (Array.isArray(body.images)) {
      const invalidIds = body.images.filter(id => !isValidObjectId(id));
      if (invalidIds.length > 0) {
        errors.push('One or more invalid image IDs');
      } else {
        data.images = body.images;
      }
    } else {
      errors.push('Images must be an array');
    }
  }

  // Order (optional)
  if (body.order !== undefined) {
    const order = parseInt(body.order, 10);
    if (!isNaN(order)) {
      data.order = order;
    }
  }

  // Featured (optional)
  if (body.featured !== undefined) {
    data.featured = body.featured === 'true' || body.featured === true;
  }

  // Status (optional)
  if (body.status !== undefined) {
    if (Object.values(ENUMS.SERIES_STATUS).includes(body.status)) {
      data.status = body.status;
    } else {
      errors.push('Invalid status value');
    }
  }

  return { errors, data };
};

/**
 * Validate series update data
 */
export const validateSeriesUpdate = (body, params) => {
  const errors = [];
  const data = {};

  // Validate series ID from params
  if (!params.id || !isValidObjectId(params.id)) {
    errors.push('Invalid series ID');
  }

  // Title (optional)
  if (body.title !== undefined) {
    if (body.title.trim().length < 2) {
      errors.push('Title must be at least 2 characters');
    } else if (body.title.trim().length > 100) {
      errors.push('Title cannot exceed 100 characters');
    } else {
      data.title = sanitizeString(body.title);
    }
  }

  // Slug (optional)
  if (body.slug !== undefined) {
    if (!isValidSlug(body.slug)) {
      errors.push('Slug must contain only lowercase letters, numbers, and hyphens');
    } else {
      data.slug = body.slug;
    }
  }

  // Description (optional)
  if (body.description !== undefined) {
    if (body.description.length > 1000) {
      errors.push('Description cannot exceed 1000 characters');
    } else {
      data.description = sanitizeString(body.description);
    }
  }

  // Category (optional)
  if (body.category !== undefined) {
    if (body.category === null) {
      data.category = null;
    } else if (!isValidObjectId(body.category)) {
      errors.push('Invalid category ID');
    } else {
      data.category = body.category;
    }
  }

  // Cover image (optional)
  if (body.coverImage !== undefined) {
    if (body.coverImage === null) {
      data.coverImage = null;
    } else if (!isValidObjectId(body.coverImage)) {
      errors.push('Invalid cover image ID');
    } else {
      data.coverImage = body.coverImage;
    }
  }

  // Order (optional)
  if (body.order !== undefined) {
    const order = parseInt(body.order, 10);
    if (!isNaN(order)) {
      data.order = order;
    }
  }

  // Featured (optional)
  if (body.featured !== undefined) {
    data.featured = body.featured === 'true' || body.featured === true;
  }

  // Status (optional)
  if (body.status !== undefined) {
    if (Object.values(ENUMS.SERIES_STATUS).includes(body.status)) {
      data.status = body.status;
    } else {
      errors.push('Invalid status value');
    }
  }

  return { errors, data };
};

/**
 * Validate series reorder data
 */
export const validateSeriesReorder = (body, params) => {
  const errors = [];
  const data = {};

  // Validate series ID from params
  if (!params.id || !isValidObjectId(params.id)) {
    errors.push('Invalid series ID');
  }

  // Validate ordered image IDs
  if (!body.imageIds || !Array.isArray(body.imageIds)) {
    errors.push('imageIds must be an array');
  } else {
    const invalidIds = body.imageIds.filter(id => !isValidObjectId(id));
    if (invalidIds.length > 0) {
      errors.push('One or more invalid image IDs');
    } else {
      data.imageIds = body.imageIds;
    }
  }

  return { errors, data };
};

/**
 * Validate series query filters
 */
export const validateSeriesQuery = (query) => {
  const errors = [];
  const filters = {};

  // Category filter
  if (query.category) {
    if (isValidObjectId(query.category)) {
      filters.category = query.category;
    } else {
      errors.push('Invalid category ID');
    }
  }

  // Status filter
  if (query.status) {
    if (Object.values(ENUMS.SERIES_STATUS).includes(query.status)) {
      filters.status = query.status;
    } else {
      errors.push('Invalid status value');
    }
  }

  // Featured filter
  if (query.featured !== undefined) {
    filters.featured = query.featured === 'true';
  }

  // Search query
  if (query.search) {
    filters.$text = { $search: query.search };
  }

  return { errors, filters };
};

export default {
  validateSeriesCreate,
  validateSeriesUpdate,
  validateSeriesReorder,
  validateSeriesQuery
};
