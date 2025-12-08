/**
 * Database Backup Script
 * Creates a backup of the MongoDB database
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { config } from '../server/src/config/env.js';
import logger from '../server/src/utils/logger.js';

const execAsync = promisify(exec);

/**
 * Create backup
 */
const createBackup = async () => {
  try {
    logger.info('🔄 Starting database backup...');

    // Create backups directory if it doesn't exist
    const backupDir = './backups';
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupPath = path.join(backupDir, `chaya-backup-${timestamp}`);

    // Parse MongoDB URI to get database name
    const dbName = config.mongodbUri.split('/').pop().split('?')[0];

    // Create mongodump command
    const command = `mongodump --uri="${config.mongodbUri}" --out="${backupPath}"`;

    logger.info('📦 Creating backup...');
    await execAsync(command);

    logger.info('✅ Backup created successfully!');
    logger.info(`   Location: ${backupPath}`);
    logger.info(`   Database: ${dbName}`);

    // List backup size
    const { stdout } = await execAsync(`du -sh "${backupPath}"`);
    logger.info(`   Size: ${stdout.trim().split('\t')[0]}`);

    process.exit(0);
  } catch (error) {
    logger.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
};

// Run backup
createBackup();
