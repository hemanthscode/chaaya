/**
 * Image Validators
 * Validates image-related request data
 */

import { 
  isValidObjectId, 
  sanitizeString 
} from '../utils/validators.js';
import { ENUMS } from '../constants/enums.js';

/**
 * Validate image upload data
 */
export const validateImageUpload = (body) => {
  const errors = [];
  const data = {};

  // Title validation (required)
  if (!body.title || body.title.trim().length === 0) {
    errors.push('Image title is required');
  } else if (body.title.trim().length < 2) {
    errors.push('Title must be at least 2 characters');
  } else if (body.title.trim().length > 200) {
    errors.push('Title cannot exceed 200 characters');
  } else {
    data.title = sanitizeString(body.title);
  }

  // Description (optional)
  if (body.description !== undefined) {
    if (body.description.length > 2000) {
      errors.push('Description cannot exceed 2000 characters');
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

  // Series (optional)
  if (body.series !== undefined && body.series !== null) {
    if (!isValidObjectId(body.series)) {
      errors.push('Invalid series ID');
    } else {
      data.series = body.series;
    }
  }

  // Tags (optional)
  if (body.tags !== undefined) {
    if (Array.isArray(body.tags)) {
      data.tags = body.tags
        .filter(tag => tag && tag.trim().length > 0)
        .map(tag => tag.toLowerCase().trim())
        .slice(0, 20); // Max 20 tags
    } else if (typeof body.tags === 'string') {
      // Parse comma-separated tags
      data.tags = body.tags
        .split(',')
        .filter(tag => tag.trim().length > 0)
        .map(tag => tag.toLowerCase().trim())
        .slice(0, 20);
    }
  }

  // Featured (optional)
  if (body.featured !== undefined) {
    data.featured = body.featured === 'true' || body.featured === true;
  }

  // Order (optional)
  if (body.order !== undefined) {
    const order = parseInt(body.order, 10);
    if (!isNaN(order)) {
      data.order = order;
    }
  }

  // Status (optional)
  if (body.status !== undefined) {
    if (Object.values(ENUMS.IMAGE_STATUS).includes(body.status)) {
      data.status = body.status;
    } else {
      errors.push('Invalid status value');
    }
  }

  // Metadata (optional)
  if (body.metadata !== undefined) {
    data.metadata = {};
    
    const metadataFields = [
      'camera', 'lens', 'iso', 'aperture', 
      'shutterSpeed', 'focalLength', 'location'
    ];
    
    metadataFields.forEach(field => {
      if (body.metadata[field] !== undefined && body.metadata[field] !== null) {
        if (field === 'iso') {
          const iso = parseInt(body.metadata[field], 10);
          if (!isNaN(iso)) {
            data.metadata[field] = iso;
          }
        } else {
          data.metadata[field] = sanitizeString(body.metadata[field]);
        }
      }
    });

    // Date taken
    if (body.metadata.dateTaken) {
      const date = new Date(body.metadata.dateTaken);
      if (!isNaN(date.getTime())) {
        data.metadata.dateTaken = date;
      }
    }
  }

  return { errors, data };
};

/**
 * Validate image update data
 */
export const validateImageUpdate = (body, params) => {
  const errors = [];
  const data = {};

  // Validate image ID from params
  if (!params.id || !isValidObjectId(params.id)) {
    errors.push('Invalid image ID');
  }

  // Same validation as upload but all fields optional
  if (body.title !== undefined) {
    if (body.title.trim().length < 2) {
      errors.push('Title must be at least 2 characters');
    } else if (body.title.trim().length > 200) {
      errors.push('Title cannot exceed 200 characters');
    } else {
      data.title = sanitizeString(body.title);
    }
  }

  if (body.description !== undefined) {
    if (body.description.length > 2000) {
      errors.push('Description cannot exceed 2000 characters');
    } else {
      data.description = sanitizeString(body.description);
    }
  }

  if (body.category !== undefined) {
    if (body.category === null) {
      data.category = null;
    } else if (!isValidObjectId(body.category)) {
      errors.push('Invalid category ID');
    } else {
      data.category = body.category;
    }
  }

  if (body.series !== undefined) {
    if (body.series === null) {
      data.series = null;
    } else if (!isValidObjectId(body.series)) {
      errors.push('Invalid series ID');
    } else {
      data.series = body.series;
    }
  }

  if (body.tags !== undefined) {
    if (Array.isArray(body.tags)) {
      data.tags = body.tags
        .filter(tag => tag && tag.trim().length > 0)
        .map(tag => tag.toLowerCase().trim())
        .slice(0, 20);
    }
  }

  if (body.featured !== undefined) {
    data.featured = body.featured === 'true' || body.featured === true;
  }

  if (body.order !== undefined) {
    const order = parseInt(body.order, 10);
    if (!isNaN(order)) {
      data.order = order;
    }
  }

  if (body.status !== undefined) {
    if (Object.values(ENUMS.IMAGE_STATUS).includes(body.status)) {
      data.status = body.status;
    } else {
      errors.push('Invalid status value');
    }
  }

  if (body.metadata !== undefined) {
    data.metadata = {};
    
    const metadataFields = [
      'camera', 'lens', 'iso', 'aperture', 
      'shutterSpeed', 'focalLength', 'location'
    ];
    
    metadataFields.forEach(field => {
      if (body.metadata[field] !== undefined) {
        if (field === 'iso') {
          const iso = parseInt(body.metadata[field], 10);
          if (!isNaN(iso)) {
            data.metadata[field] = iso;
          }
        } else {
          data.metadata[field] = sanitizeString(body.metadata[field]);
        }
      }
    });

    if (body.metadata.dateTaken) {
      const date = new Date(body.metadata.dateTaken);
      if (!isNaN(date.getTime())) {
        data.metadata.dateTaken = date;
      }
    }
  }

  return { errors, data };
};

/**
 * Validate image query filters
 */
export const validateImageQuery = (query) => {
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

  // Series filter
  if (query.series) {
    if (isValidObjectId(query.series)) {
      filters.series = query.series;
    } else {
      errors.push('Invalid series ID');
    }
  }

  // Status filter
  if (query.status) {
    if (Object.values(ENUMS.IMAGE_STATUS).includes(query.status)) {
      filters.status = query.status;
    } else {
      errors.push('Invalid status value');
    }
  }

  // Featured filter
  if (query.featured !== undefined) {
    filters.featured = query.featured === 'true';
  }

  // Tags filter
  if (query.tags) {
    if (typeof query.tags === 'string') {
      filters.tags = { $in: query.tags.split(',').map(t => t.trim()) };
    }
  }

  // Search query
  if (query.search) {
    filters.$text = { $search: query.search };
  }

  return { errors, filters };
};

export default {
  validateImageUpload,
  validateImageUpdate,
  validateImageQuery
};
