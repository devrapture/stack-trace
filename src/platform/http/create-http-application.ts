import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';

import { AppModule } from '../../app.module.js';

const ONE_MEBIBYTE = 1_048_576;

export async function createHttpApplication(): Promise<NestFastifyApplication> {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      bodyLimit: ONE_MEBIBYTE,
      trustProxy: false,
    }),
    {
      abortOnError: true,
      rawBody: true,
    },
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  return app;
}
