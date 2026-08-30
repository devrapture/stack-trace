import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { CliModule } from './cli/cli.module.js';
import { WorkerModule } from './jobs/worker.module.js';
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
    ObservabilityModule,
    WorkerModule,
    CliModule,
  ],
})
export class AppModule {}
