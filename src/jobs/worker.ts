import { NestFactory } from '@nestjs/core';
import { PinoLogger, Logger as PinoNestLogger } from 'nestjs-pino';
import { formatFatalError } from '../platform/errors/format-fatal-error.js';
import { WorkerModule } from './worker.module.js';

async function bootstrapWorker() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(PinoNestLogger));

  app.flushLogs();
  app.enableShutdownHooks();

  const logger = await app.resolve<PinoLogger>(PinoLogger);
  logger.setContext('bootstrap worker');

  logger.info(
    {
      event: 'worker_context_started',
    },
    'Stack Trace worker application context started successfully',
  );

  process.stdout.write(
    'Stack Trace worker application context started successfully.\n',
  );

  await app.close();
  process.exit(0);
}

void bootstrapWorker().catch((error: unknown) => {
  process.stderr.write(`${formatFatalError(error)}\n`);
  process.exitCode = 1;
});
