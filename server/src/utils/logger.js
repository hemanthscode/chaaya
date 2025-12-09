import fs from 'fs';
import path from 'path';
import { config } from '../config/env.js';

const logsDir = './logs';
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

const LOG_LEVELS = { ERROR: 'ERROR', WARN: 'WARN', INFO: 'INFO', DEBUG: 'DEBUG' };
const COLORS = { ERROR: '\x1b[31m', WARN: '\x1b[33m', INFO: '\x1b[36m', DEBUG: '\x1b[35m', RESET: '\x1b[0m' };

const getTimestamp = () => new Date().toISOString();
const writeToFile = (level, message, meta) => {
  const logFile = path.join(logsDir, `${config.nodeEnv}.log`);
  const logEntry = { timestamp: getTimestamp(), level, message, ...(meta && { meta }) };
  fs.appendFile(logFile, JSON.stringify(logEntry) + '\n', () => {});
};

const formatConsoleOutput = (level, message, meta) => {
  const color = COLORS[level] || COLORS.RESET;
  let output = `${color}[${getTimestamp()}] [${level}]${COLORS.RESET} ${message}`;
  if (meta) output += `\n${JSON.stringify(meta, null, 2)}`;
  return output;
};

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
    if (config.nodeEnv === 'production') writeToFile(LOG_LEVELS.INFO, message, meta);
  },
  debug: (message, meta) => {
    if (config.nodeEnv !== 'production') {
      console.log(formatConsoleOutput(LOG_LEVELS.DEBUG, message, meta));
    }
  }
};

export default logger;
