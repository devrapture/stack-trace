import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { PinoLogger } from 'nestjs-pino';
import { AppConfig } from '../config/app-config.js';
import { registerHttpAccessLogging } from './register-http-access-logging.js';
import { registerRequestIdHook } from './register-request-id-hook.js';
export const configHttpApplication = (
  app: NestFastifyApplication,
  config: AppConfig,
  logger: PinoLogger,
): void => {
  app.enableCors({
    origin: config.corsOrigins.length ? [...config.corsOrigins] : false,
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'Idempotency-Key',
      'X-CSRF-Token',
      'X-Guest-Capability',
      'X-Request-ID',
    ],

    exposedHeaders: ['X-Request-ID'],

    maxAge: 600,
  });

  registerRequestIdHook(app);
  registerHttpAccessLogging(app, logger);
};
