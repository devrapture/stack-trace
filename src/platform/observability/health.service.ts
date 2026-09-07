import { Inject, Injectable } from '@nestjs/common';
import { type Clock, CLOCK } from '../clock/clock.port.js';
import {
  DATABASE_HEALTH_PROBE,
  type DatabaseHealthProbe,
} from '../database/database-health-probe.js';
import { HealthChecks, HealthResponseDto } from './health-response.dto.js';

@Injectable()
export class HealthService {
  constructor(
    @Inject(CLOCK)
    private readonly clock: Clock,
    @Inject(DATABASE_HEALTH_PROBE)
    private databaseHealthProbe: DatabaseHealthProbe,
  ) {}

  getLiveness(): HealthResponseDto {
    return this.buildResponse('ok', {
      process: 'up',
    });
  }

  async getReadiness(): Promise<HealthResponseDto> {
    const { database, schema } =
      await this.databaseHealthProbe.checkReadiness();
    const healthy = database === 'up' && schema === 'up';
    return this.buildResponse(healthy ? 'ok' : 'unavailable', {
      process: 'up',
      database,
      schema,
    });
  }

  private buildResponse(
    status: 'ok' | 'unavailable',
    checks: HealthChecks,
  ): HealthResponseDto {
    return new HealthResponseDto(
      status,
      'stack-track-api',
      this.clock.now().toISOString(),
      Math.floor(process.uptime()),
      checks,
    );
  }
}
