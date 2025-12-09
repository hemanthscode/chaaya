import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true, minlength: 2, maxlength: 50 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, trim: true, maxlength: 500, default: '' },
  coverImage: { type: String, default: null },
  order: { type: Number, default: 0 },
  imageCount: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

categorySchema.index({ order: 1, imageCount: -1 });

categorySchema.virtual('images', {
  ref: 'Image',
  localField: '_id',
  foreignField: 'category'
});

categorySchema.methods.updateImageCount = async function() {
  const Image = mongoose.model('Image');
  this.imageCount = await Image.countDocuments({ category: this._id, status: 'published' });
  await this.save({ validateBeforeSave: false });
};

categorySchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  try {
    const Image = mongoose.model('Image');
    await Image.updateMany({ category: this._id }, { $set: { category: null } });
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Category', categorySchema);
