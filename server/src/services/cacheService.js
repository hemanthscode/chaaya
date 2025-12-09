import logger from '../utils/logger.js';

const cache = new Map();

export const setCache = (key, value, ttl = 300) => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + (ttl * 1000)
  });
  logger.debug(`Cache set: ${key}`);
};

export const getCache = (key) => {
  const cached = cache.get(key);
  if (!cached || Date.now() > cached.expiresAt) {
    cache.delete(key);
    return null;
  }
  return cached.value;
};

export const clearCacheByPattern = (pattern) => {
  let count = 0;
  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
      count++;
    }
  }
  logger.debug(`Cache cleared: ${count} keys (${pattern})`);
  return count;
};

const cleanExpiredCache = () => {
  let count = 0;
  const now = Date.now();
  for (const [key] of cache) {
    const cached = cache.get(key);
    if (now > cached.expiresAt) {
      cache.delete(key);
      count++;
    }
  }
  if (count > 0) logger.debug(`Expired cache cleaned: ${count}`);
};

setInterval(cleanExpiredCache, 5 * 60 * 1000);

export default { setCache, getCache, clearCacheByPattern };
