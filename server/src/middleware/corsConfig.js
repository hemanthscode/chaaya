/**
 * CORS Configuration Middleware
 * Handles Cross-Origin Resource Sharing
 */

import cors from 'cors';
import { config } from '../config/env.js';

/**
 * CORS options
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allowed origins
    const allowedOrigins = [
      config.clientUrl,
      'http://localhost:5173',
      'http://localhost:3000'
    ];

    // In production, only allow specified client URL
    if (config.nodeEnv === 'production') {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    } else {
      // In development, allow all origins
      callback(null, true);
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ]
};

/**
 * CORS middleware
 */
export const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
