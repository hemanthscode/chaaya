/**
 * Image Model
 * Main model for photography portfolio images
 * 
 * OPTIMIZATION: Reviewed and optimized index strategy
 * - Removed redundant single-field indexes that are covered by compound indexes
 * - Kept essential indexes for query performance
 */

import mongoose from 'mongoose';
import { ENUMS } from '../constants/enums.js';

const imageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Image title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: ''
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    series: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Series',
      default: null
    },
    
    // Cloudinary data
    cloudinaryId: {
      type: String,
      required: [true, 'Cloudinary ID is required'],
      unique: true // Ensures no duplicate uploads
    },
    cloudinaryUrl: {
      type: String,
      required: [true, 'Cloudinary URL is required']
    },
    publicId: {
      type: String,
      required: [true, 'Public ID is required']
    },
    thumbnailUrl: {
      type: String,
      required: true
    },
    
    // Image dimensions
    dimensions: {
      width: {
        type: Number,
        required: true
      },
      height: {
        type: Number,
        required: true
      }
    },
    
    // EXIF metadata
    metadata: {
      camera: {
        type: String,
        default: null
      },
      lens: {
        type: String,
        default: null
      },
      iso: {
        type: Number,
        default: null
      },
      aperture: {
        type: String,
        default: null
      },
      shutterSpeed: {
        type: String,
        default: null
      },
      focalLength: {
        type: String,
        default: null
      },
      dateTaken: {
        type: Date,
        default: null
      },
      location: {
        type: String,
        default: null
      }
    },
    
    // Tags for searching
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      }
    ],
    
    // Display options
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    },
    
    // Engagement metrics
    views: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    
    // Status
    status: {
      type: String,
      enum: Object.values(ENUMS.IMAGE_STATUS),
      default: ENUMS.IMAGE_STATUS.PUBLISHED
    },
    
    // Owner
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Primary indexes for most common queries
// NOTE: cloudinaryId index created automatically by 'unique: true'

// Single field indexes for frequent queries
imageSchema.index({ uploadedBy: 1 });
imageSchema.index({ createdAt: -1 }); // For recent images
imageSchema.index({ tags: 1 }); // For tag-based searches

// Compound indexes for common query patterns (more efficient than multiple single indexes)
imageSchema.index({ status: 1, featured: 1, order: 1 }); // Homepage featured images
imageSchema.index({ status: 1, category: 1, createdAt: -1 }); // Category listings
imageSchema.index({ status: 1, series: 1, order: 1 }); // Series images in order
imageSchema.index({ status: 1, views: -1 }); // Popular published images
imageSchema.index({ status: 1, likes: -1 }); // Most liked published images
imageSchema.index({ uploadedBy: 1, status: 1, createdAt: -1 }); // User's images

// Text index for full-text search
imageSchema.index({ 
  title: 'text', 
  description: 'text', 
  tags: 'text' 
}, {
  weights: {
    title: 10,
    tags: 5,
    description: 1
  },
  name: 'ImageTextIndex'
});

/**
 * Virtual for aspect ratio
 */
imageSchema.virtual('aspectRatio').get(function () {
  if (this.dimensions.width && this.dimensions.height) {
    return (this.dimensions.width / this.dimensions.height).toFixed(2);
  }
  return null;
});

/**
 * Virtual for formatted metadata
 */
imageSchema.virtual('formattedMetadata').get(function () {
  const meta = this.metadata;
  const parts = [];
  
  if (meta.camera) parts.push(meta.camera);
  if (meta.lens) parts.push(meta.lens);
  if (meta.iso) parts.push(`ISO ${meta.iso}`);
  if (meta.aperture) parts.push(`f/${meta.aperture}`);
  if (meta.shutterSpeed) parts.push(meta.shutterSpeed);
  if (meta.focalLength) parts.push(meta.focalLength);
  
  return parts.join(' • ');
});

/**
 * Generate thumbnail URL with transformations
 */
imageSchema.methods.getThumbnailUrl = function (width = 400, height = 400) {
  const baseUrl = this.cloudinaryUrl.split('/upload/')[0];
  const imagePath = this.cloudinaryUrl.split('/upload/')[1];
  return `${baseUrl}/upload/c_fill,w_${width},h_${height},q_auto,f_auto/${imagePath}`;
};

/**
 * Generate optimized URL with transformations
 */
imageSchema.methods.getOptimizedUrl = function (width = 1920, quality = 80) {
  const baseUrl = this.cloudinaryUrl.split('/upload/')[0];
  const imagePath = this.cloudinaryUrl.split('/upload/')[1];
  return `${baseUrl}/upload/w_${width},q_${quality},f_auto/${imagePath}`;
};

/**
 * Generate responsive image URLs
 */
imageSchema.methods.getResponsiveUrls = function () {
  return {
    thumbnail: this.getThumbnailUrl(400, 400),
    small: this.getOptimizedUrl(640, 80),
    medium: this.getOptimizedUrl(1024, 85),
    large: this.getOptimizedUrl(1920, 90),
    original: this.cloudinaryUrl
  };
};

/**
 * Increment view count
 */
imageSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save({ validateBeforeSave: false });
};

/**
 * Increment like count
 */
imageSchema.methods.incrementLikes = async function () {
  this.likes += 1;
  await this.save({ validateBeforeSave: false });
};

/**
 * Decrement like count
 */
imageSchema.methods.decrementLikes = async function () {
  if (this.likes > 0) {
    this.likes -= 1;
    await this.save({ validateBeforeSave: false });
  }
};

/**
 * Pre-remove middleware - update related documents
 */
imageSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    // Update category image count
    if (this.category) {
      const Category = mongoose.model('Category');
      const category = await Category.findById(this.category);
      if (category) {
        await category.updateImageCount();
      }
    }
    
    // Remove from series
    if (this.series) {
      const Series = mongoose.model('Series');
      const series = await Series.findById(this.series);
      if (series) {
        await series.removeImage(this._id);
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

const Image = mongoose.model('Image', imageSchema);

export default Image;