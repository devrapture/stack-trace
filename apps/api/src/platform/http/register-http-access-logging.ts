import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { PinoLogger } from 'nestjs-pino';
import {
  getHttpRequestId,
  getHttpRoutePattern,
} from './http-request-metadata.js';

const roundDuration = (durationMilliseconds: number): number => {
  return Math.round(durationMilliseconds * 1_000) / 1_000;
};

export const registerHttpAccessLogging = (
  app: NestFastifyApplication,
  logger: PinoLogger,
): void => {
  const fastify = app.getHttpAdapter().getInstance();

  fastify.addHook('onResponse', (request, reply, done) => {
    const fields = {
      event: 'http_request_completed',
      request_id: getHttpRequestId(request),
      http: {
        method: request.method,
        route: getHttpRoutePattern(request),
        status_code: reply.statusCode,
        duration_ms: roundDuration(reply.elapsedTime),
      },
    };

    if (reply.statusCode >= 500) {
      logger.error(fields, 'HTTP request completed');
    } else if (reply.statusCode >= 400) {
      logger.warn(fields, 'HTTP request completed');
    } else {
      logger.info(fields, 'HTTP request completed');
    }

    done();
  });
};
