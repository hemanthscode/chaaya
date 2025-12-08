/**
 * Express Application Setup
 * Main Express application configuration
 */

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import { corsMiddleware } from './middleware/corsConfig.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import routes from './routes/index.js';
import { config } from './config/env.js';
import logger from './utils/logger.js';

// Initialize Express app
const app = express();

/**
 * Security Middleware
 */
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

/**
 * CORS
 */
app.use(corsMiddleware);

/**
 * Body Parser Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Compression Middleware
 */
app.use(compression());

/**
 * Logging Middleware
 */
if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  }));
}

/**
 * Trust proxy (for rate limiting behind reverse proxy)
 */
app.set('trust proxy', 1);

/**
 * Rate Limiting
 */
app.use('/api/', apiLimiter);

/**
 * API Routes
 */
app.use('/api/v1', routes);

/**
 * Root route
 */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Chaya Photography Portfolio API',
    version: '1.0.0',
    status: 'Server is running',
    endpoints: {
      api: '/api/v1',
      health: '/api/v1/health',
      documentation: 'Coming soon'
    }
  });
});

/**
 * 404 Handler - must be after all other routes
 */
app.use(notFound);

/**
 * Global Error Handler - must be last
 */
app.use(errorHandler);

export default app;
