import rateLimit from 'express-rate-limit';
import { env } from '../config/index.js';
import { sendError } from '../utils/response.js';

/**
 * Global rate limiter — prevents brute-force and DoS.
 */
export const globalLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'RATE_LIMIT_EXCEEDED', 'Too many requests, please try again later');
  },
});

/**
 * Stricter limiter for auth endpoints.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 attempts per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  handler: (_req, res) => {
    sendError(res, 429, 'AUTH_RATE_LIMIT', 'Too many authentication attempts');
  },
});
