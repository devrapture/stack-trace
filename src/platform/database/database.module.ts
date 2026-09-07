import { Module } from '@nestjs/common';
import { PrismaDatabaseHealthProbe } from './prisma-database-health-probe.js';
import { PrismaService } from './prisma.service.js';
import { PlatformConfigModule } from '../config/platform-config.module.js';
import { DATABASE_HEALTH_PROBE } from './database-health-probe.js';

@Module({
  imports: [PlatformConfigModule],
  providers: [
    PrismaService,
    PrismaDatabaseHealthProbe,
    {
      provide: DATABASE_HEALTH_PROBE,
      useExisting: PrismaDatabaseHealthProbe,
    },
  ],
  exports: [PrismaService, DATABASE_HEALTH_PROBE],
})
export class DatabaseModule {}
