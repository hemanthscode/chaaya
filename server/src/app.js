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

const app = express();

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"]
    }
  }
}));

// CORS
app.use(corsMiddleware);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined'));

// Trust proxy
app.set('trust proxy', 1);

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/v1', routes);

// Root
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Chaaya Photography Portfolio API v1.0',
    status: 'Production Ready'
  });
});

// 404 handler
app.use(notFound);

// Error handler
app.use(errorHandler);

export default app;
