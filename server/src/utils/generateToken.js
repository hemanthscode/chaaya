import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateToken = (payload) => 
  jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpire });

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token) => jwt.decode(token);

export default { generateToken, verifyToken, decodeToken };
