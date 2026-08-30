import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import type { Server } from 'node:http';
import { createHttpApplication } from './../src/platform/http/create-http-application.js';

describe('Health endpoints (e2e)', () => {
  let app: INestApplication<Server>;

  beforeAll(async () => {
    app = await createHttpApplication();
    await app.listen(0);
  });

  afterAll(async () => {
    await app.close();
  });

  it('/healthz (GET) returns liveness', () => {
    return request(app.getHttpServer())
      .get('/healthz')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.checks.process).toBe('up');
      });
  });

  it('/readyz (GET) returns readiness', () => {
    return request(app.getHttpServer())
      .get('/readyz')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(res.body.checks.database).toBe('not-configured');
      });
  });
});
