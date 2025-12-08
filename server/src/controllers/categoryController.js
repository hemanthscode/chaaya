/**
 * Category Controller
 * Handles category CRUD operations
 */

import Category from '../models/Category.js';
import Image from '../models/Image.js';
import { ApiError, sendSuccess, sendCreated } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { MESSAGES } from '../constants/messages.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { generateSlug } from '../utils/validators.js';
import { clearCacheByPattern } from '../services/cacheService.js';
import logger from '../utils/logger.js';

/**
 * @desc    Get all categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find()
    .sort({ order: 1, name: 1 })
    .select('name slug description coverImage imageCount order');

  sendSuccess(res, { categories }, MESSAGES.CATEGORIES.FETCH_SUCCESS);
});

/**
 * @desc    Get single category by slug
 * @route   GET /api/v1/categories/:slug
 * @access  Public
 */
export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await Category.findOne({ slug });

  if (!category) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.CATEGORIES.NOT_FOUND
    );
  }

  // Get images count
  const imageCount = await Image.countDocuments({
    category: category._id,
    status: 'published'
  });

  const categoryData = {
    ...category.toObject(),
    imageCount
  };

  sendSuccess(res, { category: categoryData }, MESSAGES.CATEGORIES.FETCH_SUCCESS);
});

/**
 * @desc    Create new category
 * @route   POST /api/v1/categories
 * @access  Private/Admin
 */
export const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, coverImage, order } = req.body;

  if (!name || name.trim().length === 0) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Category name is required');
  }

  const categorySlug = slug || generateSlug(name);
  const existingCategory = await Category.findOne({ slug: categorySlug });
  
  if (existingCategory) {
    throw new ApiError(STATUS_CODES.CONFLICT, MESSAGES.CATEGORIES.SLUG_EXISTS);
  }

  const category = await Category.create({
    name,
    slug: categorySlug,
    description: description || '',
    coverImage: coverImage || null,
    order: order || 0
  });

  clearCacheByPattern('categories');
  logger.info(`Category created: ${name}`);
  sendCreated(res, { category }, MESSAGES.CATEGORIES.CREATE_SUCCESS);
});

/**
 * @desc    Update category
 * @route   PUT /api/v1/categories/:id
 * @access  Private/Admin
 */
export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.slug) {
    const existingCategory = await Category.findOne({
      slug: updates.slug,
      _id: { $ne: id }
    });

    if (existingCategory) {
      throw new ApiError(STATUS_CODES.CONFLICT, MESSAGES.CATEGORIES.SLUG_EXISTS);
    }
  }

  const category = await Category.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  });

  if (!category) {
    throw new ApiError(STATUS_CODES.NOT_FOUND, MESSAGES.CATEGORIES.NOT_FOUND);
  }

  clearCacheByPattern('categories');
  logger.info(`Category updated: ${category.name}`);
  sendSuccess(res, { category }, MESSAGES.CATEGORIES.UPDATE_SUCCESS);
});

/**
 * @desc    Delete category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private/Admin
 */
export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.CATEGORIES.NOT_FOUND
    );
  }

  // Use deleteOne to trigger pre-remove middleware
  await category.deleteOne();

  // Clear cache
  clearCacheByPattern('categories');

  logger.info(`Category deleted: ${category.name}`);

  sendSuccess(res, null, MESSAGES.CATEGORIES.DELETE_SUCCESS);
});

/**
 * @desc    Get category statistics
 * @route   GET /api/v1/categories/:id/stats
 * @access  Public
 */
export const getCategoryStats = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new ApiError(
      STATUS_CODES.NOT_FOUND,
      MESSAGES.CATEGORIES.NOT_FOUND
    );
  }

  // Get detailed statistics
  const [totalImages, publishedImages, totalViews, totalLikes] = await Promise.all([
    Image.countDocuments({ category: id }),
    Image.countDocuments({ category: id, status: 'published' }),
    Image.aggregate([
      { $match: { category: category._id } },
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]),
    Image.aggregate([
      { $match: { category: category._id } },
      { $group: { _id: null, total: { $sum: '$likes' } } }
    ])
  ]);

  const stats = {
    category: {
      id: category._id,
      name: category.name,
      slug: category.slug
    },
    images: {
      total: totalImages,
      published: publishedImages,
      draft: totalImages - publishedImages
    },
    engagement: {
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0
    }
  };

  sendSuccess(res, { stats }, 'Category statistics retrieved successfully');
});

export default {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryStats
};
