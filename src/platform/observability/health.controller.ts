import {
  Controller,
  Get,
  HttpStatus,
  Res,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { type FastifyReply } from 'fastify';
import { HealthService } from './health.service.js';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('/healthz')
  @Version(VERSION_NEUTRAL)
  getLiveness() {
    return this.healthService.getLiveness();
  }

  @Get('/readyz')
  @Version(VERSION_NEUTRAL)
  async getReadiness(
    @Res({
      passthrough: true,
    })
    reply: FastifyReply,
  ) {
    const response = await this.healthService.getReadiness();
    if (response.status === 'unavailable') {
      reply.status(HttpStatus.SERVICE_UNAVAILABLE);
    }
    return response;
  }
}
