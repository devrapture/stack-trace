import type {
  HealthCheckState,
  HealthChecks,
  HealthResponse,
} from 'shared-types';

export type { HealthCheckState, HealthChecks };

export class HealthResponseDto implements HealthResponse {
  constructor(
    readonly status: 'ok',
    readonly service: 'stack-track-api',
    readonly checked_at: string,
    readonly uptime_seconds: number,
    readonly checks: HealthChecks,
  ) {}
}
