/**
 * Cache Service
 * Simple in-memory caching for frequently accessed data
 * In production, use Redis for distributed caching
 */

import logger from '../utils/logger.js';

// In-memory cache store
const cache = new Map();

/**
 * Set cache with TTL (Time To Live)
 */
export const setCache = (key, value, ttl = 300) => {
  try {
    const expiresAt = Date.now() + (ttl * 1000);
    
    cache.set(key, {
      value,
      expiresAt
    });

    logger.debug(`Cache set: ${key} (TTL: ${ttl}s)`);
    return true;
  } catch (error) {
    logger.error('Cache set failed:', error);
    return false;
  }
};

/**
 * Get cached value
 */
export const getCache = (key) => {
  try {
    const cached = cache.get(key);

    if (!cached) {
      logger.debug(`Cache miss: ${key}`);
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      cache.delete(key);
      logger.debug(`Cache expired: ${key}`);
      return null;
    }

    logger.debug(`Cache hit: ${key}`);
    return cached.value;
  } catch (error) {
    logger.error('Cache get failed:', error);
    return null;
  }
};

/**
 * Delete cached value
 */
export const deleteCache = (key) => {
  try {
    const deleted = cache.delete(key);
    if (deleted) {
      logger.debug(`Cache deleted: ${key}`);
    }
    return deleted;
  } catch (error) {
    logger.error('Cache delete failed:', error);
    return false;
  }
};

/**
 * Clear cache by pattern
 */
export const clearCacheByPattern = (pattern) => {
  try {
    let count = 0;
    const regex = new RegExp(pattern);

    for (const key of cache.keys()) {
      if (regex.test(key)) {
        cache.delete(key);
        count++;
      }
    }

    logger.debug(`Cache cleared: ${count} keys matching pattern "${pattern}"`);
    return count;
  } catch (error) {
    logger.error('Cache clear by pattern failed:', error);
    return 0;
  }
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  try {
    const size = cache.size;
    cache.clear();
    logger.info(`All cache cleared: ${size} keys`);
    return size;
  } catch (error) {
    logger.error('Clear all cache failed:', error);
    return 0;
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = () => {
  return {
    size: cache.size,
    keys: Array.from(cache.keys())
  };
};

/**
 * Clean expired cache entries
 */
export const cleanExpiredCache = () => {
  try {
    let count = 0;
    const now = Date.now();

    for (const [key, cached] of cache.entries()) {
      if (now > cached.expiresAt) {
        cache.delete(key);
        count++;
      }
    }

    if (count > 0) {
      logger.debug(`Expired cache cleaned: ${count} keys`);
    }

    return count;
  } catch (error) {
    logger.error('Clean expired cache failed:', error);
    return 0;
  }
};

// Auto-clean expired cache every 5 minutes
setInterval(cleanExpiredCache, 5 * 60 * 1000);

export default {
  setCache,
  getCache,
  deleteCache,
  clearCacheByPattern,
  clearAllCache,
  getCacheStats,
  cleanExpiredCache
};
