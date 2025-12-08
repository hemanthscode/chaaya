/**
 * Analytics Service
 * Tracks and aggregates analytics data
 */

import Analytics from '../models/Analytics.js';
import Image from '../models/Image.js';
import Series from '../models/Series.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

/**
 * Track page view
 */
export const trackPageView = async (page = 'total') => {
  try {
    const analytics = await Analytics.getTodayAnalytics();
    await analytics.incrementPageView(page);
  } catch (error) {
    logger.error('Failed to track page view:', error);
  }
};

/**
 * Track image view
 */
export const trackImageView = async (imageId) => {
  try {
    const analytics = await Analytics.getTodayAnalytics();
    await analytics.incrementImageView(imageId);
    
    // Also increment image view count
    const image = await Image.findById(imageId);
    if (image) {
      await image.incrementViews();
    }
  } catch (error) {
    logger.error('Failed to track image view:', error);
  }
};

/**
 * Track contact submission
 */
export const trackContactSubmission = async () => {
  try {
    const analytics = await Analytics.getTodayAnalytics();
    await analytics.incrementContactSubmission();
  } catch (error) {
    logger.error('Failed to track contact submission:', error);
  }
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalImages,
      publishedImages,
      totalSeries,
      totalCategories,
      totalViews,
      totalLikes,
      todayAnalytics,
      recentContacts,
      popularImages
    ] = await Promise.all([
      Image.countDocuments(),
      Image.countDocuments({ status: 'published' }),
      Series.countDocuments(),
      Image.distinct('category').then(cats => cats.length),
      Image.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]),
      Image.aggregate([
        { $group: { _id: null, total: { $sum: '$likes' } } }
      ]),
      Analytics.findOne({ date: today }),
      Contact.countDocuments({ isRead: false }),
      Image.find({ status: 'published' })
        .sort({ views: -1 })
        .limit(10)
        .select('title views likes thumbnailUrl')
    ]);

    return {
      images: {
        total: totalImages,
        published: publishedImages,
        draft: totalImages - publishedImages
      },
      series: totalSeries,
      categories: totalCategories,
      engagement: {
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0
      },
      today: {
        pageViews: todayAnalytics?.pageViews.total || 0,
        imageViews: todayAnalytics?.imageViews || 0,
        contactSubmissions: todayAnalytics?.contactSubmissions || 0
      },
      unreadContacts: recentContacts,
      popularImages
    };
  } catch (error) {
    logger.error('Failed to get dashboard stats:', error);
    throw error;
  }
};

/**
 * Get analytics for date range
 */
export const getAnalyticsByDateRange = async (startDate, endDate) => {
  try {
    const analytics = await Analytics.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1 });

    return analytics;
  } catch (error) {
    logger.error('Failed to get analytics by date range:', error);
    throw error;
  }
};

/**
 * Get analytics summary for last N days
 */
export const getRecentAnalytics = async (days = 7) => {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const analytics = await getAnalyticsByDateRange(startDate, new Date());

    const summary = {
      totalPageViews: 0,
      totalImageViews: 0,
      totalContactSubmissions: 0,
      dailyData: analytics.map(day => ({
        date: day.date,
        pageViews: day.pageViews.total,
        imageViews: day.imageViews,
        contactSubmissions: day.contactSubmissions
      }))
    };

    analytics.forEach(day => {
      summary.totalPageViews += day.pageViews.total;
      summary.totalImageViews += day.imageViews;
      summary.totalContactSubmissions += day.contactSubmissions;
    });

    return summary;
  } catch (error) {
    logger.error('Failed to get recent analytics:', error);
    throw error;
  }
};

export default {
  trackPageView,
  trackImageView,
  trackContactSubmission,
  getDashboardStats,
  getAnalyticsByDateRange,
  getRecentAnalytics
};
