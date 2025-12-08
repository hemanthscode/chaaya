/**
 * Logger Utility
 * Provides consistent logging throughout the application
 */

import fs from 'fs';
import path from 'path';
import { config } from '../config/env.js';

// Ensure logs directory exists
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * Log levels
 */
const LOG_LEVELS = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * ANSI color codes for console output
 */
const COLORS = {
  ERROR: '\x1b[31m', // Red
  WARN: '\x1b[33m',  // Yellow
  INFO: '\x1b[36m',  // Cyan
  DEBUG: '\x1b[35m', // Magenta
  RESET: '\x1b[0m'
};

/**
 * Format timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Write log to file
 */
const writeToFile = (level, message, meta) => {
  const logFile = path.join(logsDir, `${config.nodeEnv}.log`);
  const logEntry = {
    timestamp: getTimestamp(),
    level,
    message,
    ...(meta && { meta })
  };
  
  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFile(logFile, logLine, (err) => {
    if (err) console.error('Failed to write to log file:', err);
  });
};

/**
 * Format console output
 */
const formatConsoleOutput = (level, message, meta) => {
  const color = COLORS[level] || COLORS.RESET;
  const timestamp = getTimestamp();
  
  let output = `${color}[${timestamp}] [${level}]${COLORS.RESET} ${message}`;
  
  if (meta) {
    output += `\n${JSON.stringify(meta, null, 2)}`;
  }
  
  return output;
};

/**
 * Logger object with level methods
 */
const logger = {
  error: (message, meta) => {
    console.error(formatConsoleOutput(LOG_LEVELS.ERROR, message, meta));
    writeToFile(LOG_LEVELS.ERROR, message, meta);
  },
  
  warn: (message, meta) => {
    console.warn(formatConsoleOutput(LOG_LEVELS.WARN, message, meta));
    writeToFile(LOG_LEVELS.WARN, message, meta);
  },
  
  info: (message, meta) => {
    console.log(formatConsoleOutput(LOG_LEVELS.INFO, message, meta));
    if (config.nodeEnv === 'production') {
      writeToFile(LOG_LEVELS.INFO, message, meta);
    }
  },
  
  debug: (message, meta) => {
    if (config.nodeEnv !== 'production') {
      console.log(formatConsoleOutput(LOG_LEVELS.DEBUG, message, meta));
    }
  }
};

export default logger;
