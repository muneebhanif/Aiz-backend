import { appConfig } from './config/app.config.js';
import { logger } from './utils/logger.js';
import app from './app.js';

const { port, nodeEnv } = appConfig;

const server = app.listen(port, () => {
  logger.info(`🚀  Server running on port ${port} [${nodeEnv}]`);
  logger.info(`   Health check: http://localhost:${port}/api/v1/health`);
});

// ─── Graceful Shutdown ─────────────────────────────────────
function gracefulShutdown(signal: string): void {
  logger.info(`⚡ Received ${signal}. Shutting down gracefully…`);
  server.close(() => {
    logger.info('✅  HTTP server closed');
    process.exit(0);
  });

  // Force exit after 10 s if connections won't close
  setTimeout(() => {
    logger.error('❌  Could not close connections in time — forcing exit');
    process.exit(1);
  }, 10_000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});
