import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Middleware to log HTTP requests with performance metrics
 */
export const requestLogger = async (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  const { method, path, ip } = req;

  // Log incoming request
  logger.info(`${method} ${path} - ${ip}`);

  // Override res.end to capture response details
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any) {
    const duration = Date.now() - startTime;
    const { statusCode } = res;

    // Log response
    logger.info(`${method} ${path} - ${statusCode} - ${duration}ms`);

    // Call original end method
    return originalEnd.call(this, chunk, encoding);
  };

  next();
};