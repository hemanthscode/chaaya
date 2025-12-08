/**
 * Category Model
 * Photography categories for organizing images
 * 
 * FIX: Removed duplicate indexes on 'name' and 'slug' fields
 * - 'unique: true' automatically creates an index
 * - Removed redundant categorySchema.index({ name: 1 }) and categorySchema.index({ slug: 1 })
 */

import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      unique: true, // This creates an index automatically
      minlength: [2, 'Category name must be at least 2 characters'],
      maxlength: [50, 'Category name cannot exceed 50 characters']
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
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: ''
    },
    coverImage: {
      type: String,
      default: null
    },
    order: {
      type: Number,
      default: 0
    },
    imageCount: {
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
// NOTE: 'slug' and 'name' indexes NOT needed here because 'unique: true' creates them
categorySchema.index({ order: 1 });
categorySchema.index({ imageCount: -1 }); // For sorting by popularity
categorySchema.index({ createdAt: -1 });

/**
 * Virtual populate for images
 */
categorySchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'category',
  justOne: false
});

/**
 * Update image count
 */
categorySchema.methods.updateImageCount = async function () {
  const Image = mongoose.model('Image');
  this.imageCount = await Image.countDocuments({ 
    category: this._id,
    status: 'published'
  });
  await this.save({ validateBeforeSave: false });
};

/**
 * Pre-remove middleware - handle orphaned images
 */
categorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
  try {
    const Image = mongoose.model('Image');
    // Set category to null for all images in this category
    await Image.updateMany(
      { category: this._id },
      { $set: { category: null } }
    );
    next();
  } catch (error) {
    next(error);
  }
});

const Category = mongoose.model('Category', categorySchema);

export default Category;