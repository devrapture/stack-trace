import { Module } from '@nestjs/common';
import { HealthService } from './health.service.js';
import { HealthController } from './health.controller.js';
import { ClockModule } from '../clock/clock.module.js';

@Module({
  imports: [ClockModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class ObservabilityModule {}
