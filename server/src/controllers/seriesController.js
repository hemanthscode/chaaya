import Series from '../models/Series.js';
import Image from '../models/Image.js';
import { ApiError, sendSuccess, sendCreated, sendPaginated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { parsePagination, generateSlug } from '../utils/validators.js';
import { clearCacheByPattern } from '../services/cacheService.js';
import logger from '../utils/logger.js';

export const getAllSeries = asyncHandler(async (req, res) => {
  const pagination = parsePagination(req.query.page, req.query.limit);
  const { filters } = req.validatedData || { filters: {} };

  const query = { ...filters };
  if (!req.user?.isAdmin()) query.status = 'published';

  const [seriesList, total] = await Promise.all([
    Series.find(query).populate('coverImage category').populate({ path: 'images', select: 'thumbnailUrl title', options: { limit: 5 } })
      .sort({ featured: -1, order: 1 }).skip(pagination.skip()).limit(pagination.limit).lean(),
    Series.countDocuments(query)
  ]);

  sendPaginated(res, { series: seriesList }, { page: pagination.page, limit: pagination.limit, total }, MESSAGES.SERIES.FETCH_SUCCESS);
});

export const getSeriesBySlug = asyncHandler(async (req, res) => {
  const series = await Series.findOne({ slug: req.params.slug })
    .populate('coverImage category').populate({ path: 'images', match: { status: 'published' } });
  if (!series) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);
  if (series.status === 'draft' && !req.user?.isAdmin()) throw new ApiError(STATUS_CODES.FORBIDDEN, 'Access denied');

  series.incrementViews().catch(err => logger.error('View increment failed:', err));
  sendSuccess(res, { series }, MESSAGES.SERIES.FETCH_SUCCESS);
});

export const createSeries = asyncHandler(async (req, res) => {
  const data = req.validatedData;
  if (!data.slug && data.title) data.slug = generateSlug(data.title);

  const existing = await Series.findOne({ slug: data.slug });
  if (existing) throw new ApiError(STATUS_CODES.CONFLICT, 'Slug already exists');

  if (data.images?.length) {
    const count = await Image.countDocuments({ _id: { $in: data.images } });
    if (count !== data.images.length) throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid images');
  }

  const series = await Series.create(data);
  if (data.images?.length) {
    await Image.updateMany({ _id: { $in: data.images } }, { $set: { series: series._id } });
  }

  await series.populate('coverImage category');
  clearCacheByPattern('series');
  sendCreated(res, { series }, MESSAGES.SERIES.CREATE_SUCCESS);
});

export const updateSeries = asyncHandler(async (req, res) => {
  const updates = req.validatedData;
  if (updates.slug) {
    const existing = await Series.findOne({ slug: updates.slug, _id: { $ne: req.params.id } });
    if (existing) throw new ApiError(STATUS_CODES.CONFLICT, 'Slug already exists');
  }

  const series = await Series.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    .populate('coverImage category images');
  if (!series) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);

  clearCacheByPattern('series');
  sendSuccess(res, { series }, MESSAGES.SERIES.UPDATE_SUCCESS);
});

export const deleteSeries = asyncHandler(async (req, res) => {
  const series = await Series.findById(req.params.id);
  if (!series) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);

  await series.deleteOne();
  clearCacheByPattern('series');
  sendSuccess(res, null, MESSAGES.SERIES.DELETE_SUCCESS);
});

export const addImageToSeries = asyncHandler(async (req, res) => {
  const [series, image] = await Promise.all([
    Series.findById(req.params.id),
    Image.findById(req.params.imageId)
  ]);

  if (!series) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);
  if (!image) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.IMAGES.NOT_FOUND);

  await series.addImage(req.params.imageId);
  image.series = series._id;
  await image.save();

  clearCacheByPattern('series');
  sendSuccess(res, { series }, 'Image added to series');
});

export const removeImageFromSeries = asyncHandler(async (req, res) => {
  const series = await Series.findById(req.params.id);
  if (!series) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);

  await series.removeImage(req.params.imageId);
  await Image.findByIdAndUpdate(req.params.imageId, { $set: { series: null } });

  clearCacheByPattern('series');
  sendSuccess(res, { series }, 'Image removed');
});

export const reorderSeriesImages = asyncHandler(async (req, res) => {
  const series = await Series.findById(req.params.id);
  if (!series) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.SERIES.NOT_FOUND);

  await series.reorderImages(req.validatedData.imageIds);
  clearCacheByPattern('series');
  sendSuccess(res, { series }, 'Images reordered');
});

export default {
  getAllSeries, getSeriesBySlug, createSeries, updateSeries,
  deleteSeries, addImageToSeries, removeImageFromSeries, reorderSeriesImages
};
