import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { corsConfig } from './config/cors.config.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import apiRoutes from './routes/index.js';

const app = express();

// ─── Security ──────────────────────────────────────────────
// @ts-ignore -- helmet CJS/ESM interop on Vercel
app.use(helmet());
app.use(cors(corsConfig));

// ─── Body Parsing ──────────────────────────────────────────
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: false }));

// ─── Health Check (unauthenticated) ────────────────────────
app.get('/api/v1/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    },
  });
});

// ─── API Routes ────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

// ─── Error Handling (MUST be last) ─────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
