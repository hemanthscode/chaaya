import Image from '../models/Image.js';
import Series from '../models/Series.js';
import Category from '../models/Category.js';
import Testimonial from '../models/Testimonial.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

export const getHomepageData = async () => {
  const [
    featuredImages,
    recentImages,
    featuredSeries,
    categories,
    testimonials
  ] = await Promise.all([
    Image.find({ featured: true, status: 'published' }).limit(8).populate('category'),
    Image.find({ status: 'published' }).sort({ createdAt: -1 }).limit(12).populate('category'),
    Series.find({ featured: true, status: 'published' }).populate('coverImage').limit(6),
    Category.find().sort({ order: 1 }).limit(12),
    Testimonial.getTestimonials(4)
  ]);

  return { featuredImages, recentImages, featuredSeries, categories, testimonials };
};

export const getAboutData = async () => {
  const [
    totalImages,
    totalSeries,
    totalViews,
    topCategories
  ] = await Promise.all([
    Image.countDocuments({ status: 'published' }),
    Series.countDocuments({ status: 'published' }),
    Image.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
    Category.aggregate([
      { $lookup: { from: 'images', localField: '_id', foreignField: 'category', as: 'images' } },
      { $addFields: { imageCount: { $size: '$images' } } },
      { $match: { imageCount: { $gt: 0 } } },
      { $sort: { imageCount: -1 } },
      { $limit: 5 }
    ])
  ]);

  return {
    stats: {
      totalImages,
      totalSeries,
      totalViews: totalViews[0]?.total || 0,
      topCategories
    }
  };
};

export const getRandomImages = async (limit = 12) => 
  await Image.aggregate([
    { $match: { status: 'published' } },
    { $sample: { size: limit } },
    { $limit: limit }
  ]);

export const getRelatedImages = async (imageId, limit = 8) => {
  const image = await Image.findById(imageId);
  if (!image) throw new ApiError(STATUS_CODES.NOT_FOUND, 'Image not found');

  return await Image.find({
    status: 'published',
    category: image.category,
    _id: { $ne: imageId }
  }).limit(limit).populate('category');
};

export const generateSitemap = async () => {
  const [
    images,
    series,
    categories
  ] = await Promise.all([
    Image.find({ status: 'published' }).select('cloudinaryUrl updatedAt'),
    Series.find({ status: 'published' }).select('slug updatedAt'),
    Category.find().select('slug updatedAt')
  ]);

  return { images, series, categories };
};

export default { getHomepageData, getAboutData, getRandomImages, getRelatedImages, generateSitemap };
