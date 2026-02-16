import { env } from './env.js';
import type { CorsOptions } from 'cors';

export const corsConfig: CorsOptions = {
  origin: (origin, callback) => {
    // In development, allow everything
    if (env.NODE_ENV === 'development') {
      callback(null, true);
      return;
    }

    const allowed = env.CORS_ALLOWED_ORIGINS.split(',').map(s => s.trim());

    if (!origin || allowed.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 hours preflight cache
};
