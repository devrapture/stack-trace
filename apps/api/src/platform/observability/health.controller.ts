import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
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
  getReadiness() {
    return this.healthService.getReadiness();
  }
}
