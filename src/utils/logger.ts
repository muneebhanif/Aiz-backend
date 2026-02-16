import { createLogger, format, transports } from 'winston';
import { appConfig } from '../config/index.js';

export const logger = createLogger({
  level: appConfig.isDevelopment ? 'debug' : 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    appConfig.isProduction
      ? format.json()
      : format.combine(format.colorize(), format.printf(({ timestamp, level, message, stack }) => {
          return `${timestamp as string} ${level}: ${message as string}${stack ? `\n${stack as string}` : ''}`;
        })),
  ),
  transports: [new transports.Console()],
  silent: false,
});
