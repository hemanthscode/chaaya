/**
 * Analytics Model
 * Tracks analytics data for dashboard
 */

import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
      unique: true
    },
    
    // Page views
    pageViews: {
      total: { type: Number, default: 0 },
      home: { type: Number, default: 0 },
      portfolio: { type: Number, default: 0 },
      about: { type: Number, default: 0 },
      contact: { type: Number, default: 0 }
    },
    
    // Image statistics
    imageViews: {
      type: Number,
      default: 0
    },
    imageLikes: {
      type: Number,
      default: 0
    },
    
    // Popular images (top 10)
    popularImages: [
      {
        imageId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Image'
        },
        views: { type: Number, default: 0 }
      }
    ],
    
    // Contact submissions
    contactSubmissions: {
      type: Number,
      default: 0
    },
    
    // Unique visitors (approximation)
    uniqueVisitors: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

// Indexes
analyticsSchema.index({ date: -1 });

/**
 * Get or create analytics for today
 */
analyticsSchema.statics.getTodayAnalytics = async function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let analytics = await this.findOne({ date: today });
  
  if (!analytics) {
    analytics = await this.create({ date: today });
  }
  
  return analytics;
};

/**
 * Increment page view
 */
analyticsSchema.methods.incrementPageView = async function (page = 'total') {
  if (this.pageViews.hasOwnProperty(page)) {
    this.pageViews[page] += 1;
  }
  this.pageViews.total += 1;
  await this.save();
};

/**
 * Increment image view
 */
analyticsSchema.methods.incrementImageView = async function (imageId) {
  this.imageViews += 1;
  
  // Update popular images
  const existingIndex = this.popularImages.findIndex(
    item => item.imageId.toString() === imageId.toString()
  );
  
  if (existingIndex >= 0) {
    this.popularImages[existingIndex].views += 1;
  } else {
    this.popularImages.push({ imageId, views: 1 });
  }
  
  // Keep only top 10, sorted by views
  this.popularImages.sort((a, b) => b.views - a.views);
  this.popularImages = this.popularImages.slice(0, 10);
  
  await this.save();
};

/**
 * Increment contact submission
 */
analyticsSchema.methods.incrementContactSubmission = async function () {
  this.contactSubmissions += 1;
  await this.save();
};

const Analytics = mongoose.model('Analytics', analyticsSchema);

export default Analytics;
