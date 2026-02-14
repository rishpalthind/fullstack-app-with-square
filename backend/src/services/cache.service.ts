import NodeCache from 'node-cache';
import { config } from '../config/config';
import { logger } from '../utils/logger';

/**
 * In-memory cache service using node-cache
 * Can be extended to use Redis for production
 */
export class CacheService {
  private static instance: CacheService;
  private cache: NodeCache;

  private constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl, // Default TTL in seconds
      checkperiod: 60, // Check for expired keys every 60 seconds
      maxKeys: config.cache.maxSize, // Maximum number of keys
      deleteOnExpire: true,
      useClones: false, // For performance, don't clone objects
    });

    // Log cache statistics periodically
    setInterval(() => {
      const stats = this.cache.getStats();
      if (stats.keys > 0) {
        logger.debug('Cache stats:', {
          keys: stats.keys,
          hits: stats.hits,
          misses: stats.misses,
          ksize: stats.ksize,
          vsize: stats.vsize,
        });
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Get singleton instance
   */
  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = this.cache.get<T>(key);
      if (value !== undefined) {
        logger.debug(`Cache HIT: ${key}`);
        return value;
      } else {
        logger.debug(`Cache MISS: ${key}`);
        return null;
      }
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      const success = this.cache.set(key, value, ttl || config.cache.ttl);
      if (success) {
        logger.debug(`Cache SET: ${key} (TTL: ${ttl || config.cache.ttl}s)`);
      } else {
        logger.warn(`Cache SET failed: ${key}`);
      }
      return success;
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<boolean> {
    try {
      const deletedCount = this.cache.del(key);
      const success = deletedCount > 0;
      logger.debug(`Cache DELETE: ${key} (success: ${success})`);
      return success;
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    try {
      this.cache.flushAll();
      logger.info('Cache cleared');
    } catch (error) {
      logger.error('Error clearing cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }
}