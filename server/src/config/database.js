import mongoose from 'mongoose';
import { config } from './env.js';
import logger from '../utils/logger.js';

export const connectDatabase = async (retries = 5) => {
  try {
    const options = {
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4
    };

    await mongoose.connect(config.mongodbUri, options);
    logger.info(`📦 MongoDB: ${mongoose.connection.host}`);

    mongoose.connection.on('error', err => logger.error('MongoDB error:', err));
    mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
  } catch (error) {
    logger.error(`MongoDB failed: ${error.message}`);
    if (retries > 0) {
      logger.info(`Retrying... (${retries} left)`);
      await new Promise(r => setTimeout(r, 5000));
      return connectDatabase(retries - 1);
    }
    throw error;
  }
};

export const disconnectDatabase = async () => {
  await mongoose.connection.close();
  logger.info('MongoDB closed');
};

export default { connectDatabase, disconnectDatabase };
