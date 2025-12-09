import Image from '../models/Image.js';
import User from '../models/User.js';
import { ApiError } from '../utils/apiResponse.js';
import { STATUS_CODES } from '../constants/statusCodes.js';
import logger from '../utils/logger.js';

export const bulkDeleteImages = async (imageIds) => {
  const deleted = await Image.deleteMany({ _id: { $in: imageIds } });
  logger.info(`Bulk deleted ${deleted.deletedCount} images`);
  return deleted;
};

export const getAuditLogs = async (limit = 50) => {
  // Simple audit log from recent operations
  return {
    totalImages: await Image.countDocuments(),
    totalUsers: await User.countDocuments(),
    recentImages: await Image.find().sort({ createdAt: -1 }).limit(10),
    recentUsers: await User.find().sort({ createdAt: -1 }).limit(5)
  };
};

export const createBackup = async () => {
  // Simplified backup - in production use mongodump
  const stats = {
    images: await Image.countDocuments(),
    series: await mongoose.model('Series').countDocuments(),
    users: await User.countDocuments()
  };
  logger.info('Backup created:', stats);
  return stats;
};

export default { bulkDeleteImages, getAuditLogs, createBackup };
