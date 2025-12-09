import mongoose from 'mongoose';
import { ENUMS } from '../constants/enums.js';

const imageSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  series: { type: mongoose.Schema.Types.ObjectId, ref: 'Series' },
  cloudinaryId: { type: String, required: true, unique: true },
  cloudinaryUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  dimensions: {
    width: { type: Number, required: true },
    height: { type: Number, required: true }
  },
  metadata: {
    camera: String, lens: String, iso: Number,
    aperture: String, shutterSpeed: String,
    focalLength: String, dateTaken: Date, location: String
  },
  tags: [{ type: String, trim: true, lowercase: true }],
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  status: { type: String, enum: Object.values(ENUMS.IMAGE_STATUS), default: ENUMS.IMAGE_STATUS.PUBLISHED },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

imageSchema.index({ status: 1, featured: 1, order: 1 });
imageSchema.index({ status: 1, category: 1 });
imageSchema.index({ status: 1, series: 1 });
imageSchema.index({ status: 1, views: -1 });
imageSchema.index({ '$**': 'text' });

imageSchema.virtual('aspectRatio').get(function() {
  return this.dimensions.width && this.dimensions.height 
    ? (this.dimensions.width / this.dimensions.height).toFixed(2) : null;
});

imageSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save({ validateBeforeSave: false });
};

imageSchema.methods.incrementLikes = async function() {
  this.likes += 1;
  await this.save({ validateBeforeSave: false });
};

imageSchema.methods.decrementLikes = async function() {
  if (this.likes > 0) {
    this.likes -= 1;
    await this.save({ validateBeforeSave: false });
  }
};

imageSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    if (this.category) {
      const Category = mongoose.model('Category');
      const category = await Category.findById(this.category);
      if (category) await category.updateImageCount();
    }
    if (this.series) {
      const Series = mongoose.model('Series');
      const series = await Series.findById(this.series);
      if (series) await series.removeImage(this._id);
    }
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Image', imageSchema);
