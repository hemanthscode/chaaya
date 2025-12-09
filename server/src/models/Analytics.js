import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  pageViews: {
    total: { type: Number, default: 0 },
    home: { type: Number, default: 0 },
    portfolio: { type: Number, default: 0 }
  },
  imageViews: { type: Number, default: 0 },
  imageLikes: { type: Number, default: 0 },
  contactSubmissions: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  popularImages: [{
    imageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Image' },
    views: { type: Number, default: 0 }
  }]
}, { timestamps: true });

analyticsSchema.index({ date: -1 });

analyticsSchema.statics.getTodayAnalytics = async function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let analytics = await this.findOne({ date: today });
  if (!analytics) analytics = await this.create({ date: today });
  return analytics;
};

analyticsSchema.methods.incrementPageView = async function(page = 'total') {
  if (this.pageViews[page]) this.pageViews[page] += 1;
  this.pageViews.total += 1;
  await this.save();
};

analyticsSchema.methods.incrementImageView = async function(imageId) {
  this.imageViews += 1;
  const idx = this.popularImages.findIndex(item => item.imageId.toString() === imageId.toString());
  if (idx >= 0) {
    this.popularImages[idx].views += 1;
  } else {
    this.popularImages.push({ imageId, views: 1 });
  }
  this.popularImages.sort((a, b) => b.views - a.views);
  this.popularImages = this.popularImages.slice(0, 10);
  await this.save();
};

export default mongoose.model('Analytics', analyticsSchema);
