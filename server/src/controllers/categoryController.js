import Category from '../models/Category.js';
import Image from '../models/Image.js';
import { ApiError, sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateSlug } from '../utils/validators.js';
import { clearCacheByPattern } from '../services/cacheService.js';

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ order: 1, name: 1 }).lean();
  sendSuccess(res, { categories }, MESSAGES.CATEGORIES.FETCH_SUCCESS);
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (!category) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.CATEGORIES.NOT_FOUND);

  const imageCount = await Image.countDocuments({ category: category._id, status: 'published' });
  sendSuccess(res, { category: { ...category.toObject(), imageCount } }, MESSAGES.CATEGORIES.FETCH_SUCCESS);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, coverImage, order } = req.body;
  if (!name?.trim()) throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Name required');

  const categorySlug = slug || generateSlug(name);
  const existing = await Category.findOne({ slug: categorySlug });
  if (existing) throw new ApiError(STATUS_CODES.CONFLICT, 'Slug already exists');

  const category = await Category.create({ name, slug: categorySlug, description, coverImage, order });
  clearCacheByPattern('categories');
  sendCreated(res, { category }, MESSAGES.CATEGORIES.CREATE_SUCCESS);
});

export const updateCategory = asyncHandler(async (req, res) => {
  if (req.body.slug) {
    const existing = await Category.findOne({ slug: req.body.slug, _id: { $ne: req.params.id } });
    if (existing) throw new ApiError(STATUS_CODES.CONFLICT, 'Slug already exists');
  }

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.CATEGORIES.NOT_FOUND);

  clearCacheByPattern('categories');
  sendSuccess(res, { category }, 'Category updated');
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.CATEGORIES.NOT_FOUND);

  await category.deleteOne();
  clearCacheByPattern('categories');
  sendSuccess(res, null, MESSAGES.CATEGORIES.DELETE_SUCCESS);
});

export default { getAllCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
