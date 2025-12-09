import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

favoriteSchema.index({ user: 1, image: 1 }, { unique: true });
favoriteSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Favorite', favoriteSchema);
