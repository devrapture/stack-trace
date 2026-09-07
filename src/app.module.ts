import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { PlatformConfigModule } from './platform/config/platform-config.module.js';
import { PlatformHttpModule } from './platform/http/platform-http.module.js';
import { PlatformLoggingModule } from './platform/logging/platform-logging.module.js';
import { ObservabilityModule } from './platform/observability/health.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    // ObserveModule.forRoot({
    //   appKey: 'YOUR_APP_KEY',
    //   appSecret: 'YOUR_APP_SECRET',
    //   serviceId: 'stack-trace-BE',
    // }),
    PlatformConfigModule,
    PlatformLoggingModule,
    PlatformHttpModule,
    ObservabilityModule,
  ],
})
export class AppModule {}
