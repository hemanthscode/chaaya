import app from './src/app.js';
import { connectDatabase } from './src/config/database.js';
import { config } from './src/config/env.js';
import logger from './src/utils/logger.js';

const PORT = config.port || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    logger.info('✅ Database connected');

    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running: http://localhost:${PORT}/api/v1`);
      logger.info(`📍 Environment: ${config.nodeEnv}`);
    });

    // Graceful shutdown
    const shutdown = async (signal) => {
      logger.info(`${signal} received. Shutting down...`);
      server.close(async () => {
        logger.info('✅ Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', (err) => {
      logger.error('Unhandled rejection:', err);
      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start:', error);
    process.exit(1);
  }
};

startServer();
