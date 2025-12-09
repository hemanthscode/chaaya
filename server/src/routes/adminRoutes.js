import express from 'express';
import { bulkDeleteImages, getAuditLogs, createBackup } from '../services/adminService.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { ApiError, sendSuccess } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';

const router = express.Router();

router.use(protect, adminOnly);

router.delete('/images/bulk', asyncHandler(async (req, res) => {
  const { imageIds } = req.body;
  if (!Array.isArray(imageIds) || imageIds.length === 0) {
    throw new ApiError(STATUS_CODES.BAD_REQUEST, 'imageIds array required');
  }
  const result = await bulkDeleteImages(imageIds);
  sendSuccess(res, result, `${result.deletedCount} images deleted`);
}));

router.get('/audit-logs', asyncHandler(async (req, res) => {
  const logs = await getAuditLogs();
  sendSuccess(res, logs, 'Audit logs');
}));

router.post('/backup', asyncHandler(async (req, res) => {
  const backup = await createBackup();
  sendSuccess(res, backup, 'Backup created');
}));

export default router;
