/**
 * Analytics Controller
 * Handles analytics and dashboard statistics
 */

import { ApiError, sendSuccess } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  getDashboardStats,
  getRecentAnalytics,
  getAnalyticsByDateRange
} from '../services/analyticsService.js';

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/v1/analytics/dashboard
 * @access  Private/Admin
 */
export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();

  sendSuccess(res, { stats }, 'Dashboard statistics retrieved successfully');
});

/**
 * @desc    Get recent analytics (last 7 days)
 * @route   GET /api/v1/analytics/recent
 * @access  Private/Admin
 */
export const getRecentStats = asyncHandler(async (req, res) => {
  const { days } = req.query;
  const dayCount = parseInt(days, 10) || 7;

  if (dayCount < 1 || dayCount > 90) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Days must be between 1 and 90'
    );
  }

  const analytics = await getRecentAnalytics(dayCount);

  sendSuccess(res, { analytics }, `Analytics for last ${dayCount} days retrieved successfully`);
});

/**
 * @desc    Get analytics by custom date range
 * @route   GET /api/v1/analytics/range
 * @access  Private/Admin
 */
export const getAnalyticsByRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Start date and end date are required'
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Invalid date format'
    );
  }

  if (start > end) {
    throw new ApiError(
      STATUS_CODES.BAD_REQUEST,
      'Start date must be before end date'
    );
  }

  const analytics = await getAnalyticsByDateRange(start, end);

  sendSuccess(res, { analytics }, 'Analytics retrieved successfully');
});

export default {
  getDashboard,
  getRecentStats,
  getAnalyticsByRange
};
