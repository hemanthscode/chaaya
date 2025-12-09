#!/usr/bin/env node
/**
 * Database Backup Script - Enterprise Edition
 * Creates timestamped MongoDB backups with cleanup
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import logger from '../src/utils/logger.js';

const execAsync = promisify(exec);

const createBackup = async () => {
  try {
    logger.info('🔄 Starting enterprise database backup...');

    const backupDir = './backups';
    await fs.mkdir(backupDir, { recursive: true });

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const backupPath = path.join(backupDir, `chaaya-${timestamp}`);

    // Use mongodump with optimized flags
    const command = [
      'mongodump',
      '--uri=mongodb://localhost:27017/chaaya', // Use local for reliability
      '--out=' + backupPath,
      '--gzip', // Compress
      '--archive=' + path.join(backupPath, `chaaya-${timestamp}.gz`)
    ].join(' ');

    logger.info('📦 Executing mongodump...');
    const { stdout } = await execAsync(command);
    
    // Cleanup individual dumps, keep only archive
    await fs.rm(path.join(backupPath, 'chaaya'), { recursive: true, force: true });

    const stats = await fs.stat(path.join(backupPath, `chaaya-${timestamp}.gz`));
    const size = (stats.size / 1024 / 1024).toFixed(2);

    logger.info('✅ Backup completed!');
    logger.info(`📁 Location: ${backupPath}/chaaya-${timestamp}.gz`);
    logger.info(`💾 Size: ${size} MB`);
    
    // Cleanup old backups (keep last 5)
    const backups = await fs.readdir(backupDir);
    const sorted = backups
      .filter(f => f.startsWith('chaaya-'))
      .sort((a, b) => path.parse(b).name.localeCompare(path.parse(a).name))
      .slice(5);
    
    for (const old of sorted) {
      await fs.rm(path.join(backupDir, old), { recursive: true });
    }
    
    logger.info('🧹 Old backups cleaned');
    process.exit(0);
  } catch (error) {
    logger.error('❌ Backup failed:', error.message);
    process.exit(1);
  }
};

createBackup();
