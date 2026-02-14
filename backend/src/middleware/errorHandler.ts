import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  let statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  let message = error.message || 'Internal Server Error';
  let details: any = undefined;

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    statusCode = StatusCodes.BAD_REQUEST;
    message = 'Validation Error';
    details = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
  }

  // Handle Square API errors
  if (error.message.includes('Square API')) {
    statusCode = StatusCodes.BAD_GATEWAY;
    message = 'External API Error';
  }

  // Handle database errors
  if (error.message.includes('Prisma') || error.message.includes('database')) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = 'Database Error';
  }

  // Log error details
  logger.error(`Error ${statusCode}: ${message}`, {
    error: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Send error response
  const errorResponse = {
    error: getErrorName(statusCode),
    message,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
    ...(process.env['NODE_ENV'] === 'development' && { stack: error.stack }),
  };

  res.status(statusCode).json(errorResponse);
};

/**
 * Get error name from status code
 */
function getErrorName(statusCode: number): string {
  switch (statusCode) {
    case StatusCodes.BAD_REQUEST:
      return 'Bad Request';
    case StatusCodes.UNAUTHORIZED:
      return 'Unauthorized';
    case StatusCodes.FORBIDDEN:
      return 'Forbidden';
    case StatusCodes.NOT_FOUND:
      return 'Not Found';
    case StatusCodes.UNPROCESSABLE_ENTITY:
      return 'Unprocessable Entity';
    case StatusCodes.TOO_MANY_REQUESTS:
      return 'Too Many Requests';
    case StatusCodes.INTERNAL_SERVER_ERROR:
      return 'Internal Server Error';
    case StatusCodes.BAD_GATEWAY:
      return 'Bad Gateway';
    case StatusCodes.SERVICE_UNAVAILABLE:
      return 'Service Unavailable';
    default:
      return 'Error';
  }
}

/**
 * Async error handler wrapper
 */
export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};