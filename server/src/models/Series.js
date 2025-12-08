/**
 * Series Model
 * Photo series/collections
 * 
 * FIX: Removed duplicate index on 'slug' field
 * - 'unique: true' automatically creates an index
 * - Removed redundant seriesSchema.index({ slug: 1 })
 */

import mongoose from 'mongoose';
import { ENUMS } from '../constants/enums.js';

const seriesSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Series title is required'],
      trim: true,
      minlength: [2, 'Title must be at least 2 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true, // This creates an index automatically
      lowercase: true,
      trim: true,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Slug must contain only lowercase letters, numbers, and hyphens'
      ]
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: ''
    },
    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
      default: null
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image'
      }
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    },
    order: {
      type: Number,
      default: 0
    },
    featured: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: Object.values(ENUMS.SERIES_STATUS),
      default: ENUMS.SERIES_STATUS.DRAFT
    },
    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
// NOTE: 'slug' index NOT needed here because 'unique: true' creates it
seriesSchema.index({ status: 1 });
seriesSchema.index({ featured: 1 });
seriesSchema.index({ order: 1 });
seriesSchema.index({ category: 1 });
seriesSchema.index({ createdAt: -1 });
seriesSchema.index({ views: -1 }); // For sorting by popularity

// Compound indexes for common queries
seriesSchema.index({ status: 1, featured: 1 });
seriesSchema.index({ status: 1, category: 1 });
seriesSchema.index({ featured: 1, order: 1 });

/**
 * Virtual for image count
 */
seriesSchema.virtual('imageCount').get(function () {
  return this.images ? this.images.length : 0;
});

/**
 * Add image to series
 */
seriesSchema.methods.addImage = async function (imageId) {
  if (!this.images.includes(imageId)) {
    this.images.push(imageId);
    await this.save();
  }
  return this;
};

/**
 * Remove image from series
 */
seriesSchema.methods.removeImage = async function (imageId) {
  this.images = this.images.filter(id => id.toString() !== imageId.toString());
  
  // If cover image was removed, set new cover or null
  if (this.coverImage && this.coverImage.toString() === imageId.toString()) {
    this.coverImage = this.images.length > 0 ? this.images[0] : null;
  }
  
  await this.save();
  return this;
};

/**
 * Reorder images in series
 */
seriesSchema.methods.reorderImages = async function (orderedImageIds) {
  // Validate all IDs exist in current images
  const validIds = orderedImageIds.filter(id => 
    this.images.some(imgId => imgId.toString() === id.toString())
  );
  
  this.images = validIds;
  await this.save();
  return this;
};

/**
 * Increment view count
 */
seriesSchema.methods.incrementViews = async function () {
  this.views += 1;
  await this.save({ validateBeforeSave: false });
};

/**
 * Pre-remove middleware
 */
seriesSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const Image = mongoose.model('Image');
    // Remove series reference from images
    await Image.updateMany(
      { series: this._id },
      { $set: { series: null } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Series = mongoose.model('Series', seriesSchema);

export default Series;