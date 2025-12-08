/**
 * Series Controller
 * Handles photo series CRUD operations - STATUS FIXED!
 */

import Series from '../models/Series.js';
import Image from '../models/Image.js';
import { ApiError, sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { parsePagination, generateSlug } from '../utils/validators.js';
import { clearCacheByPattern } from '../services/cacheService.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get all series
 * @route   GET /api/v1/series
 * @access  Public
 */
export const getAllSeries = asyncHandler(async (req, res) => {
  const { page, limit, status, featured, category, search } = req.query;
  
  const pagination = parsePagination(page, limit);
  const { errors, filters } = req.validatedData || { errors: [], filters: {} };

  // Build query
  const query = { ...filters };

  // Only show published series to non-admin users
  if (!req.user || !req.user.isAdmin()) {
    query.status = 'published';
  }

  const [seriesList, total] = await Promise.all([
    Series.find(query)
      .populate('coverImage', 'thumbnailUrl title cloudinaryUrl')
      .populate('category', 'name slug')
      .populate({
        path: 'images',
        select: 'thumbnailUrl cloudinaryUrl title _id',
        options: { limit: 5 }
      })
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .skip(pagination.skip())
      .limit(pagination.limit)
      .lean(),
    Series.countDocuments(query)
  ]);

  const seriesWithThumbnails = seriesList.map(series => ({
    ...series,
    thumbnailUrl: series.coverImage?.thumbnailUrl || 
                  series.coverImage?.cloudinaryUrl || 
                  series.images?.[0]?.thumbnailUrl || 
                  series.images?.[0]?.cloudinaryUrl ||
                  '/api/placeholder/400/300',
    imageCount: series.images ? series.images.length : 0
  }));

  sendPaginated(
    res,
    { series: seriesWithThumbnails },
    { page: pagination.page, limit: pagination.limit, total },
    MESSAGES.SERIES.FETCH_SUCCESS
  );
});

/**
 * @desc    Get single series by slug
 * @route   GET /api/v1/series/:slug
 * @access  Public
 */
export const getSeriesBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const series = await Series.findOne({ slug })
    .populate('coverImage', 'title cloudinaryUrl thumbnailUrl dimensions')
    .populate('category', 'name slug')
    .populate({
      path: 'images',
      select: 'title description cloudinaryUrl thumbnailUrl dimensions metadata tags featured views likes',
      match: { status: 'published' }
    });

  if (!series) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);
  }

  if (series.status === 'draft' && (!req.user || !req.user.isAdmin())) {
    throw new ApiError(STATUS_CODES.FORBIDDEN, 'You do not have permission to view this series');
  }

  series.thumbnailUrl = series.coverImage?.thumbnailUrl || 
                       series.coverImage?.cloudinaryUrl || 
                       series.images?.[0]?.thumbnailUrl || 
                       series.images?.[0]?.cloudinaryUrl;

  series.incrementViews().catch(err => logger.error('Failed to increment series views:', err));

  sendSuccess(res, { series }, MESSAGES.SERIES.FETCH_SUCCESS);
});

/**
 * @desc    Create new series
 * @route   POST /api/v1/series
 * @access  Private/Admin
 */
export const createSeries = asyncHandler(async (req, res) => {
  const data = req.validatedData;

  if (!data.slug && data.title) {
    data.slug = generateSlug(data.title);
  }

  const existingSlug = await Series.findOne({ slug: data.slug });
  if (existingSlug) {
    throw new ApiError(STATUS_CODES.CONFLICT, 'A series with this slug already exists');
  }

  if (data.images && data.images.length > 0) {
    const imageCount = await Image.countDocuments({ _id: { $in: data.images } });
    if (imageCount !== data.images.length) {
      throw new ApiError(STATUS_CODES.BAD_REQUEST, 'One or more images do not exist');
    }
  }

  const series = await Series.create(data);

  if (data.images && data.images.length > 0) {
    await Image.updateMany({ _id: { $in: data.images } }, { $set: { series: series._id } });
  }

  await series.populate('coverImage category');
  clearCacheByPattern('series');
  logger.info(`Series created: ${series.title}`);

  sendCreated(res, { series }, MESSAGES.SERIES.CREATE_SUCCESS);
});

/**
 * @desc    Update series - ✅ FIXED STATUS BUG
 * @route   PUT /api/v1/series/:id
 * @access  Private/Admin
 */
export const updateSeries = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let updates = req.validatedData;

  // ✅ FIXED: Ensure status is properly set
  if (updates.status === 'published' || updates.status === 'draft') {
    logger.info(`Updating series ${id} status to: ${updates.status}`);
  }

  // Check if slug already exists
  if (updates.slug) {
    const existingSlug = await Series.findOne({
      slug: updates.slug,
      _id: { $ne: id }
    });
    if (existingSlug) {
      throw new ApiError(STATUS_CODES.CONFLICT, 'A series with this slug already exists');
    }
  }

  // ✅ FIXED: Use findByIdAndUpdate with proper options
  const series = await Series.findByIdAndUpdate(
    id,
    updates,
    {
      new: true,
      runValidators: true,
      context: 'query' // ✅ Ensures enum validation works
    }
  ).populate('coverImage category images', 'title thumbnailUrl cloudinaryUrl');

  if (!series) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);
  }

  // ✅ Log the actual updated status
  logger.info(`Series updated: ${series.title} (Status: ${series.status})`);

  clearCacheByPattern('series');
  sendSuccess(res, { series }, MESSAGES.SERIES.UPDATE_SUCCESS);
});

/**
 * @desc    Delete series
 * @route   DELETE /api/v1/series/:id
 * @access  Private/Admin
 */
export const deleteSeries = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const series = await Series.findById(id);
  if (!series) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);
  }

  await series.deleteOne();
  clearCacheByPattern('series');
  logger.info(`Series deleted: ${series.title}`);

  sendSuccess(res, null, MESSAGES.SERIES.DELETE_SUCCESS);
});

/**
 * @desc    Add image to series
 * @route   POST /api/v1/series/:id/images/:imageId
 * @access  Private/Admin
 */
export const addImageToSeries = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const [series, image] = await Promise.all([
    Series.findById(id),
    Image.findById(imageId)
  ]);

  if (!series) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);
  }

  if (!image) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.IMAGES.NOT_FOUND);
  }

  await series.addImage(imageId);
  image.series = series._id;
  await image.save();

  clearCacheByPattern('series');
  logger.info(`Image added to series: ${image.title} -> ${series.title}`);

  sendSuccess(res, { series }, 'Image added to series successfully');
});

/**
 * @desc    Remove image from series
 * @route   DELETE /api/v1/series/:id/images/:imageId
 * @access  Private/Admin
 */
export const removeImageFromSeries = asyncHandler(async (req, res) => {
  const { id, imageId } = req.params;

  const series = await Series.findById(id);
  if (!series) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);
  }

  await series.removeImage(imageId);
  await Image.findByIdAndUpdate(imageId, { $set: { series: null } });

  clearCacheByPattern('series');
  logger.info(`Image removed from series: ${imageId} -> ${series.title}`);

  sendSuccess(res, { series }, 'Image removed from series successfully');
});

/**
 * @desc    Reorder images in series
 * @route   PUT /api/v1/series/:id/reorder
 * @access  Private/Admin
 */
export const reorderSeriesImages = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { imageIds } = req.validatedData;

  const series = await Series.findById(id);
  if (!series) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);
  }

  await series.reorderImages(imageIds);
  clearCacheByPattern('series');
  logger.info(`Series images reordered: ${series.title}`);

  sendSuccess(res, { series }, MESSAGES.SERIES.REORDER_SUCCESS);
});

export default {
  getAllSeries,
  getSeriesBySlug,
  createSeries,
  updateSeries,
  deleteSeries,
  addImageToSeries,
  removeImageFromSeries,
  reorderSeriesImages
};
