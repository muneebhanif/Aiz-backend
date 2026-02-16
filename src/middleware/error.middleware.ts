import type { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';
import { sendError } from '../utils/response.js';
import { logger } from '../utils/logger.js';
import { appConfig } from '../config/index.js';

/**
 * Central error handler — catches every error that propagates through Express.
 * Never leaks raw database errors, stack traces, or internal details to the client.
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  // Already sent response — bail
  if (res.headersSent) return;

  // Known operational errors
  if (err instanceof ValidationError) {
    sendError(res, err.statusCode, err.code, err.message, err.details);
    return;
  }

  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error('Non-operational error:', err);
    }
    sendError(res, err.statusCode, err.code, err.message);
    return;
  }

  // Unknown / unexpected errors — log full details, return generic message
  logger.error('Unhandled error:', err);
  sendError(
    res,
    500,
    'INTERNAL_ERROR',
    appConfig.isProduction ? 'An unexpected error occurred' : err.message,
  );
}

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(_req: Request, res: Response): void {
  sendError(res, 404, 'ROUTE_NOT_FOUND', 'The requested endpoint does not exist');
}
