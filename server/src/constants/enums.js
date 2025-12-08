/**
 * Application Enumerations
 * Defines all enum values used in the application
 */

export const ENUMS = {
  // User Roles
  USER_ROLES: {
    ADMIN: 'admin',
    USER: 'user'
  },
  
  // Image Status
  IMAGE_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published',
    ARCHIVED: 'archived'
  },
  
  // Series Status
  SERIES_STATUS: {
    DRAFT: 'draft',
    PUBLISHED: 'published'
  },
  
  // Sort Orders
  SORT_ORDER: {
    ASC: 'asc',
    DESC: 'desc'
  },
  
  // Sort Fields for Images
  IMAGE_SORT_FIELDS: {
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
    TITLE: 'title',
    VIEWS: 'views',
    LIKES: 'likes',
    ORDER: 'order'
  },
  
  // Camera Manufacturers (for metadata)
  CAMERA_BRANDS: [
    'Canon', 'Nikon', 'Sony', 'Fujifilm', 'Olympus', 
    'Panasonic', 'Leica', 'Hasselblad', 'Phase One', 'Other'
  ],
  
  // Image Categories (default suggestions)
  DEFAULT_CATEGORIES: [
    'Portrait', 'Landscape', 'Wildlife', 'Street', 
    'Architecture', 'Fashion', 'Product', 'Abstract', 
    'Documentary', 'Event'
  ]
};

export default ENUMS;
