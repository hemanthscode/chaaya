#!/usr/bin/env node
/**
 * Database Reset Script - Enterprise Edition
 * Safely wipes database with confirmation
 */

import mongoose from 'mongoose';
import { connectDatabase } from '../src/config/database.js';
import logger from '../src/utils/logger.js';

const clearDatabase = async () => {
  try {
    await connectDatabase();
    logger.info('🗑️  Enterprise database reset initiated...');
    
    // List all collections first
    const collections = await mongoose.connection.db.listCollections().toArray();
    logger.info(`📋 Found ${collections.length} collections: ${collections.map(c => c.name).join(', ')}`);

    // Drop database
    await mongoose.connection.dropDatabase();
    
    logger.info('✅ Database completely reset');
    logger.info('💡 Next: npm run seed');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Reset failed:', error);
    process.exit(1);
  }
};

// Safety confirmation
const force = process.argv.includes('--force');
if (!force) {
  console.log('\n⚠️  DANGER: This DELETES ALL DATA!\n');
  console.log('✅ To proceed: npm run clear -- --force');
  console.log('\n⏭️  Skip: Ctrl+C');
  process.exit(0);
}

clearDatabase();
