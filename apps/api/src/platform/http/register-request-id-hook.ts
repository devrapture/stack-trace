import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { REQUEST_ID_HEADER } from './request-id.js';

export const registerRequestIdHook = (app: NestFastifyApplication): void => {
  const fastify = app.getHttpAdapter().getInstance();
  fastify.addHook('onRequest', (request, reply, done) => {
    reply.header(REQUEST_ID_HEADER, request.id);
    done();
  });
};
