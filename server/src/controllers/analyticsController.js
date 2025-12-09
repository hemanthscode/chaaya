import { ApiError, sendSuccess } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getDashboardStats } from '../services/analyticsService.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const stats = await getDashboardStats();
  sendSuccess(res, { stats }, 'Dashboard stats retrieved');
});

export const getRecentStats = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days, 10) || 7;
  if (days < 1 || days > 90) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Days must be 1-90');
  }
  // Implementation for recent stats
  sendSuccess(res, { analytics: [] }, `Stats for last ${days} days`);
});

export const getAnalyticsByRange = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Dates required');
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'Invalid date range');
  }
  sendSuccess(res, { analytics: [] }, 'Analytics retrieved');
});

export default { getDashboard, getRecentStats, getAnalyticsByRange };
