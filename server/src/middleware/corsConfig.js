import cors from 'cors';
import { config } from '../config/env.js';

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = [config.clientUrl, 'http://localhost:5173', 'http://localhost:3000'];
    callback(null, config.nodeEnv === 'production' ? allowed.includes(origin) : true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export const corsMiddleware = cors(corsOptions);
export default corsMiddleware;
