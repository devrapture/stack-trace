import { Inject, Injectable } from '@nestjs/common';
import { HealthChecks, HealthResponseDto } from './health-response.dto.js';
import { type Clock, CLOCK } from '../clock/clock.port.js';

@Injectable()
export class HealthService {
  constructor(
    @Inject(CLOCK)
    private readonly clock: Clock,
  ) {}

  getLiveness(): HealthResponseDto {
    return this.buildResponse({
      process: 'up',
    });
  }

  getReadiness(): HealthResponseDto {
    return this.buildResponse({
      process: 'up',
      database: 'not-configured',
    });
  }

  private buildResponse(checks: HealthChecks): HealthResponseDto {
    return new HealthResponseDto(
      'ok',
      'stack-track-api',
      this.clock.now().toISOString(),
      Math.floor(process.uptime()),
      checks,
    );
  }
}
