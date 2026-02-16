import type { Response } from 'express';

interface SuccessPayload<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

interface ErrorPayload {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

/**
 * Consistent JSON response helpers.
 * Every API response matches one of these two shapes.
 */
export function sendSuccess<T>(res: Response, data: T, statusCode = 200, meta?: Record<string, unknown>): void {
  const payload: SuccessPayload<T> = { success: true, data };
  if (meta) payload.meta = meta;
  res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: Array<{ field: string; message: string }>,
): void {
  const payload: ErrorPayload = {
    success: false,
    error: { code, message },
  };
  if (details) payload.error.details = details;
  res.status(statusCode).json(payload);
}

export function sendCreated<T>(res: Response, data: T): void {
  sendSuccess(res, data, 201);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}
