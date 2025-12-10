import Image from '../models/Image.js';
import Category from '../models/Category.js';
import Series from '../models/Series.js';
import { ApiError, sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { parsePagination } from '../utils/validators.js';
import { deleteFromCloudinary } from '../services/cloudinaryService.js';
import { clearCacheByPattern } from '../services/cacheService.js';
import { trackImageView } from '../services/analyticsService.js';
import logger from '../utils/logger.js';

export const getAllImages = asyncHandler(async (req, res) => {
  const { page, limit, sortBy, order } = req.query;
  const pagination = parsePagination(page, limit);
  const validated = req.validatedData || {};
  const filters = validated.filters || {};

  const query = { ...filters };

  if (!req.user?.isAdmin()) {
    query.status = 'published';
  }

  const sort = {
    [sortBy || 'createdAt']: order === 'asc' ? 1 : -1
  };

  const [images, total] = await Promise.all([
    Image.find(query)
      .populate('category series uploadedBy', 'name slug title')
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

export const getImageById = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id).populate(
    'category series uploadedBy'
  );
  if (!image) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.IMAGES.NOT_FOUND);
  }

  if (image.status !== 'published' && !req.user?.isAdmin()) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, 'Access denied');
  }

  trackImageView(image._id).catch((err) =>
    logger.error('Track view failed:', err)
  );

  sendSuccess(res, { image }, MESSAGES.IMAGES.FETCH_SUCCESS);
});

export const getImagesByCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.CATEGORIES.NOT_FOUND);
  }

  const pagination = parsePagination(req.query.page, req.query.limit);

  const baseQuery = { category: category._id, status: 'published' };

  const [images, total] = await Promise.all([
    Image.find(baseQuery)
      .sort({ featured: -1, order: 1 })
      .skip(pagination.skip())
      .limit(pagination.limit)
      .lean(),
    Image.countDocuments(baseQuery)
  ]);

  sendPaginated(
    res,
    {
      images,
      category: { name: category.name, slug: category.slug }
    },
    { page: pagination.page, limit: pagination.limit, total },
    MESSAGES.IMAGES.FETCH_SUCCESS
  );
});

export const getImagesBySeries = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ slug: req.params.slug }).populate({
    path: 'images',
    match: { status: 'published' },
    populate: { path: 'category' }
  });

  if (!series) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);
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

export const getFeaturedImages = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;

  const images = await Image.find({ featured: true, status: 'published' })
    .populate('category')
    .sort({ order: 1 })
    .limit(limit)
    .lean();

  sendSuccess(res, { images }, MESSAGES.IMAGES.FETCH_SUCCESS);
});

export const updateImage = asyncHandler(async (req, res) => {
  const data = req.validatedData || req.body || {};

  // Get the current image to track series changes
  const currentImage = await Image.findById(req.params.id);
  if (!currentImage) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.IMAGES.NOT_FOUND);
  }

  const oldSeriesId = currentImage.series?.toString() || null;
  const newSeriesId = data.series?.toString() || null;

  // Update the image
  const image = await Image.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true
  }).populate('category series');

  // Handle series changes
  if (oldSeriesId !== newSeriesId) {
    // Remove from old series
    if (oldSeriesId) {
      await Series.findByIdAndUpdate(oldSeriesId, {
        $pull: { images: image._id }
      });
    }

    // Add to new series
    if (newSeriesId) {
      await Series.findByIdAndUpdate(newSeriesId, {
        $addToSet: { images: image._id }
      });
    }
  }

  // Update category image count
  if (data.category && image.category) {
    const category = await Category.findById(image.category);
    if (category && typeof category.updateImageCount === 'function') {
      await category.updateImageCount();
    }
  }

  clearCacheByPattern('images');
  clearCacheByPattern('series');
  sendSuccess(res, { image }, MESSAGES.IMAGES.UPDATE_SUCCESS);
});

export const deleteImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.IMAGES.NOT_FOUND);
  }

  await deleteFromCloudinary(image.publicId);
  await image.deleteOne();
  clearCacheByPattern('images');

  sendSuccess(res, null, MESSAGES.IMAGES.DELETE_SUCCESS);
});

export const toggleLikeImage = asyncHandler(async (req, res) => {
  const image = await Image.findById(req.params.id);
  if (!image) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.IMAGES.NOT_FOUND);
  }

  const { action } = req.body;

  if (action === 'like') {
    await image.incrementLikes();
    sendSuccess(res, { likes: image.likes }, MESSAGES.IMAGES.LIKE_SUCCESS);
  } else if (action === 'unlike') {
    await image.decrementLikes();
    sendSuccess(res, { likes: image.likes }, 'Image unliked');
  } else {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid action');
  }
});

export const searchImages = asyncHandler(async (req, res) => {
  let q = req.query.q;
  if (typeof q === 'object') {
    q = Array.isArray(q) ? q[0] : q.q;
  }
  const searchTerm = String(q || '').trim();
  if (!searchTerm) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Search query required');
  }

  const pagination = parsePagination(req.query.page, req.query.limit);

  const query = {
    $text: { $search: searchTerm },
    status: 'published'
  };

  const [images, total] = await Promise.all([
    Image.find(query, { score: { $meta: 'textScore' } })
      .populate('category series')
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
    `Found ${total} image(s)`
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
