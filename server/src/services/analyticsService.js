import Analytics from '../models/Analytics.js';
import Image from '../models/Image.js';
import logger from '../utils/logger.js';

export const trackPageView = async (page = 'total') => {
  try {
    const analytics = await Analytics.getTodayAnalytics();
    await analytics.incrementPageView(page);
  } catch (error) {
    logger.error('Page view tracking failed:', error);
  }
};

export const trackImageView = async (imageId) => {
  try {
    const analytics = await Analytics.getTodayAnalytics();
    await analytics.incrementImageView(imageId);
    const image = await Image.findById(imageId);
    if (image) await image.incrementViews();
  } catch (error) {
    logger.error('Image view tracking failed:', error);
  }
};

export const trackContactSubmission = async () => {
  try {
    const analytics = await Analytics.getTodayAnalytics();
    await analytics.incrementContactSubmission();
  } catch (error) {
    logger.error('Contact tracking failed:', error);
  }
};

export const getDashboardStats = async () => {
  const [
    totalImages, publishedImages, totalSeries, unreadContacts, popularImages
  ] = await Promise.all([
    Image.countDocuments(),
    Image.countDocuments({ status: 'published' }),
    mongoose.model('Series').countDocuments(),
    mongoose.model('Contact').countDocuments({ isRead: false }),
    Image.find({ status: 'published' }).sort({ views: -1 }).limit(10).select('title views likes thumbnailUrl')
  ]);

  return {
    images: { total: totalImages, published: publishedImages, draft: totalImages - publishedImages },
    series: totalSeries,
    unreadContacts,
    popularImages
  };
};

export default { trackPageView, trackImageView, trackContactSubmission, getDashboardStats };
