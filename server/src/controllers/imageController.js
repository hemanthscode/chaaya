/**
 * Image Controller
 * Handles image CRUD operations
 */

import Image from '../models/Image.js';
import Category from '../models/Category.js';
import Series from '../models/Series.js';
import { ApiError, sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { parsePagination } from '../utils/validators.js';
import { deleteFromCloudinary } from '../services/cloudinaryService.js';
import { clearCacheByPattern } from '../services/cacheService.js';
import { trackImageView } from '../services/analyticsService.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get all images with filters
 * @route   GET /api/v1/images
 * @access  Public
 */
export const getAllImages = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, order } = req.query;
  
  const pagination = parsePagination(page, limit);
  const { errors, filters } = req.validatedData || { errors: [], filters: {} };

  // Build query
  const query = { ...filters };

  // Only show published images to non-admin users
  if (!req.user || !req.user.isAdmin()) {
    query.status = 'published';
  }

  // Build sort
  const sortField = sortBy || 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;
  const sort = { [sortField]: sortOrder };

  // Execute query with pagination
  const [images, total] = await Promise.all([
    Image.find(query)
      .populate('category', 'name slug')
      .populate('series', 'title slug')
      .populate('uploadedBy', 'name')
      .sort(sort)
      .skip(pagination.skip())
      .limit(pagination.limit)
      .lean(),
    Image.countDocuments(query)
  ]);

  sendPaginated(
    res,
    { images },
    { page: pagination.page, limit: pagination.limit, total },
    MESSAGES.IMAGES.FETCH_SUCCESS
  );
});

/**
 * @desc    Get single image by ID
 * @route   GET /api/v1/images/:id
 * @access  Public
 */
export const getImageById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const image = await Image.findById(id)
    .populate('category', 'name slug')
    .populate('series', 'title slug')
    .populate('uploadedBy', 'name avatar');

  if (!image) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.IMAGES.NOT_FOUND
    );
  }

  // Check if user can view draft images
  if (image.status !== 'published' && (!req.user || !req.user.isAdmin())) {
    throw new ApiError(
      STATUS_CODES.FORBIDDEN,
      'You do not have permission to view this image'
    );
  }

  // Track image view (non-blocking)
  trackImageView(image._id).catch(err =>
    logger.error('Failed to track image view:', err)
  );

  sendSuccess(res, { image }, MESSAGES.IMAGES.FETCH_SUCCESS);
});

/**
 * @desc    Get images by category slug
 * @route   GET /api/v1/images/category/:slug
 * @access  Public
 */
export const getImagesByCategory = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const { page, limit } = req.query;

  const pagination = parsePagination(page, limit);

  // Find category
  const category = await Category.findOne({ slug });

  if (!category) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.CATEGORIES.NOT_FOUND
    );
  }

  // Build query
  const query = {
    category: category._id,
    status: 'published'
  };

  const [images, total] = await Promise.all([
    Image.find(query)
      .populate('series', 'title slug')
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .skip(pagination.skip())
      .limit(pagination.limit)
      .lean(),
    Image.countDocuments(query)
  ]);

  sendPaginated(
    res,
    { images, category: { name: category.name, slug: category.slug } },
    { page: pagination.page, limit: pagination.limit, total },
    MESSAGES.IMAGES.FETCH_SUCCESS
  );
});

/**
 * @desc    Get images by series slug
 * @route   GET /api/v1/images/series/:slug
 * @access  Public
 */
export const getImagesBySeries = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  // Find series
  const series = await Series.findOne({ slug })
    .populate({
      path: 'images',
      match: { status: 'published' },
      populate: { path: 'category', select: 'name slug' }
    });

  if (!series) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.SERIES.NOT_FOUND
    );
  }

  sendSuccess(
    res,
    {
      images: series.images,
      series: {
        id: series._id,
        title: series.title,
        slug: series.slug,
        description: series.description
      }
    },
    MESSAGES.IMAGES.FETCH_SUCCESS
  );
});

/**
 * @desc    Get featured images
 * @route   GET /api/v1/images/featured
 * @access  Public
 */
export const getFeaturedImages = asyncHandler(async (req, res) => {
  const { limit } = req.query;
  const imageLimit = parseInt(limit, 10) || 10;

  const images = await Image.find({
    featured: true,
    status: 'published'
  })
    .populate('category', 'name slug')
    .sort({ order: 1, createdAt: -1 })
    .limit(imageLimit)
    .lean();

  sendSuccess(res, { images }, MESSAGES.IMAGES.FETCH_SUCCESS);
});

/**
 * @desc    Update image
 * @route   PUT /api/v1/images/:id
 * @access  Private/Admin
 */
export const updateImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.validatedData;

  const image = await Image.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,
      runValidators: true
    }
  ).populate('category series');

  if (!image) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.IMAGES.NOT_FOUND
    );
  }

  // Update category image count if category changed
  if (updates.category) {
    if (image.category) {
      const category = await Category.findById(image.category);
      if (category) {
        await category.updateImageCount();
      }
    }
  }

  // Clear cache
  clearCacheByPattern('images');

  logger.info(`Image updated: ${image.title}`);

  sendSuccess(res, { image }, MESSAGES.IMAGES.UPDATE_SUCCESS);
});

/**
 * @desc    Delete image
 * @route   DELETE /api/v1/images/:id
 * @access  Private/Admin
 */
export const deleteImage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const image = await Image.findById(id);

  if (!image) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.IMAGES.NOT_FOUND
    );
  }

  // Delete from Cloudinary
  await deleteFromCloudinary(image.publicId);

  // Use deleteOne to trigger pre-remove middleware
  await image.deleteOne();

  // Clear cache
  clearCacheByPattern('images');

  logger.info(`Image deleted: ${image.title}`);

  sendSuccess(res, null, MESSAGES.IMAGES.DELETE_SUCCESS);
});

/**
 * @desc    Like/Unlike image
 * @route   POST /api/v1/images/:id/like
 * @access  Public
 */
export const toggleLikeImage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // 'like' or 'unlike'

  const image = await Image.findById(id);

  if (!image) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.IMAGES.NOT_FOUND
    );
  }

  if (action === 'like') {
    await image.incrementLikes();
    logger.info(`Image liked: ${image.title}`);
    sendSuccess(res, { likes: image.likes }, MESSAGES.IMAGES.LIKE_SUCCESS);
  } else if (action === 'unlike') {
    await image.decrementLikes();
    logger.info(`Image unliked: ${image.title}`);
    sendSuccess(res, { likes: image.likes }, MESSAGES.IMAGES.UNLIKE_SUCCESS);
  } else {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid action. Use "like" or "unlike"'
    );
  }
});

/**
 * @desc    Search images
 * @route   GET /api/v1/images/search
 * @access  Public
 */
export const searchImages = asyncHandler(async (req, res) => {
  // ✅ FIXED: Handle q as array/object/string
  let q = req.query.q;
  
  // Handle nested q[q] or array format
  if (typeof q === 'object' && q !== null) {
    if (Array.isArray(q)) {
      q = q[0]; // Take first item if array
    } else if (q.q) {
      q = q.q; // Handle q[q] format
    }
  }
  
  // Convert to string and validate
  const searchTerm = String(q || '').trim();
  
  if (!searchTerm) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Search query is required'
    );
  }

  const pagination = parsePagination(req.query.page, req.query.limit);

  const query = {
    $text: { $search: searchTerm },
    status: 'published'
  };

  const [images, total] = await Promise.all([
    Image.find(query, { score: { $meta: 'textScore' } })
      .populate('category', 'name slug')
      .populate('series', 'title slug')
      .sort({ score: { $meta: 'textScore' } })
      .skip(pagination.skip())
      .limit(pagination.limit)
      .lean(),
    Image.countDocuments(query)
  ]);

  sendPaginated(
    res,
    { images, query: searchTerm },
    { page: pagination.page, limit: pagination.limit, total },
    `Found ${total} image(s) for "${searchTerm}"`
  );
});

export default {
  getAllImages,
  getImageById,
  getImagesByCategory,
  getImagesBySeries,
  getFeaturedImages,
  updateImage,
  deleteImage,
  toggleLikeImage,
  searchImages
};
