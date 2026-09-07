import { Module } from '@nestjs/common';
import { ClockModule } from '../clock/clock.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';

@Module({
  imports: [ClockModule, DatabaseModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class ObservabilityModule {}
