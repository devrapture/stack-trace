import { Module } from '@nestjs/common';
import { PlatformConfigModule } from '../platform/config/platform-config.module.js';
import { PlatformLoggingModule } from '../platform/logging/platform-logging.module.js';

@Module({
  imports: [PlatformConfigModule, PlatformLoggingModule],
})
export class CliModule {}
