import { Module } from '@nestjs/common';
import { LoggerModule, type Params } from 'nestjs-pino';
import { APP_CONFIG, type AppConfig } from '../config/app-config.js';
import { PlatformConfigModule } from '../config/platform-config.module.js';
import { createPinoOptions } from './create-pino-options.js';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [PlatformConfigModule],
      providers: [],
      inject: [APP_CONFIG],
      useFactory: (config: AppConfig): Params => createPinoOptions(config),
    }),
  ],
})
export class PlatformLoggingModule {}
