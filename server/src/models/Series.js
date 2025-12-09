import mongoose from 'mongoose';
import { ENUMS } from '../constants/enums.js';

const seriesSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true, maxlength: 1000, default: '' },
  coverImage: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Image' }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  order: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: Object.values(ENUMS.SERIES_STATUS), default: ENUMS.SERIES_STATUS.DRAFT },
  views: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

seriesSchema.index({ status: 1, featured: 1 });
seriesSchema.index({ status: 1, category: 1 });

seriesSchema.virtual('imageCount').get(function() {
  return this.images?.length || 0;
});

seriesSchema.methods.addImage = async function(imageId) {
  if (!this.images.includes(imageId)) {
    this.images.push(imageId);
    await this.save();
  }
  return this;
};

seriesSchema.methods.removeImage = async function(imageId) {
  this.images = this.images.filter(id => id.toString() !== imageId.toString());
  if (this.coverImage?.toString() === imageId.toString()) {
    this.coverImage = this.images.length ? this.images[0] : null;
  }
  await this.save();
  return this;
};

seriesSchema.methods.reorderImages = async function(imageIds) {
  this.images = imageIds.filter(id => this.images.some(imgId => imgId.toString() === id.toString()));
  await this.save();
  return this;
};

seriesSchema.methods.incrementViews = async function() {
  this.views += 1;
  await this.save({ validateBeforeSave: false });
};

seriesSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    const Image = mongoose.model('Image');
    await Image.updateMany({ series: this._id }, { $set: { series: null } });
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Series', seriesSchema);
