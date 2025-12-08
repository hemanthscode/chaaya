/**
 * MongoDB Database Configuration
 * Handles database connection with retry logic
 */

import mongoose from 'mongoose';
import { config } from './env.js';
import logger from '../utils/logger.js';

/**
 * Connect to MongoDB with retry logic
 */
export const connectDatabase = async (retries = 5) => {
  try {
    const options = {
      // Connection options
      maxPoolSize: 10,
      minPoolSize: 5,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
      family: 4 // Use IPv4, skip trying IPv6
    };

    await mongoose.connect(config.mongodbUri, options);

    logger.info(`📦 MongoDB Connected: ${mongoose.connection.host}`);

    // Connection event handlers
    mongoose.connection.on('error', (err) => {
      logger.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      logger.info('✅ MongoDB reconnected successfully');
    });

  } catch (error) {
    logger.error(`❌ MongoDB connection failed: ${error.message}`);

    if (retries > 0) {
      logger.info(`🔄 Retrying connection... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      return connectDatabase(retries - 1);
    }

    throw new Error('Failed to connect to MongoDB after multiple attempts');
  }
};

/**
 * Disconnect from MongoDB
 */
export const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    logger.info('✅ MongoDB connection closed');
  } catch (error) {
    logger.error('❌ Error closing MongoDB connection:', error);
    throw error;
  }
};

export default { connectDatabase, disconnectDatabase };
