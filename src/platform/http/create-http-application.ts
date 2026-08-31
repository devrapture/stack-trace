import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PinoLogger, Logger as PinoNestLogger } from 'nestjs-pino';

import { IncomingHttpHeaders } from 'http';
import { AppModule } from '../../app.module.js';
import { APP_CONFIG } from '../config/app-config.js';
import { configHttpApplication } from './configure-http-application.js';
import { REQUEST_ID_HEADER, resolveRequestId } from './request-id.js';

const ONE_MEBIBYTE = 1_048_576;

export const createHttpApplication =
  async (): Promise<NestFastifyApplication> => {
    const app = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter({
        bodyLimit: ONE_MEBIBYTE,
        trustProxy: false,
        genReqId: (req: { headers: IncomingHttpHeaders }) =>
          resolveRequestId(req.headers[REQUEST_ID_HEADER]),
      }),
      {
        abortOnError: true,
        bufferLogs: true,
        rawBody: true,
      },
    );

    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    app.useLogger(app.get(PinoNestLogger));

    const logger = await app.resolve(PinoLogger);
    logger.setContext('httpAccessLog');

    const runtimeConfig = app.get(APP_CONFIG);
    configHttpApplication(app, runtimeConfig, logger);

    return app;
  };
