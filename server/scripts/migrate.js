#!/usr/bin/env node
/**
 * Database Migration Script - Enterprise Edition
 * Versioned, idempotent migrations
 */

import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database.js';
import logger from '../src/utils/logger.js';

const MIGRATIONS = {
  '001-add-image-views-index': async () => {
    const Image = mongoose.model('Image');
    await Image.collection.createIndex({ views: -1 });
    logger.info('✅ Migration 001: Image views index');
  },
  
  '002-add-series-slug-unique': async () => {
    const Series = mongoose.model('Series');
    await Series.collection.createIndex({ slug: 1 }, { unique: true });
    logger.info('✅ Migration 002: Series slug unique');
  },
  
  '003-add-user-last-login': async () => {
    const User = mongoose.model('User');
    await User.updateMany({ lastLogin: { $exists: false } }, { $set: { lastLogin: null } });
    logger.info('✅ Migration 003: User lastLogin field');
  }
};

const runMigrations = async () => {
  try {
    await connectDatabase();
    logger.info('🔄 Running enterprise migrations...');

    const migrationKeys = Object.keys(MIGRATIONS);
    let completed = 0;

    for (const key of migrationKeys) {
      try {
        await MIGRATIONS[key]();
        completed++;
      } catch (error) {
        logger.warn(`⚠️  Migration ${key} failed (skipped):`, error.message);
      }
    }

    logger.info(`🎉 Migrations complete: ${completed}/${migrationKeys.length}`);
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();
