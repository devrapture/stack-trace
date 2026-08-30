import { NestFactory } from '@nestjs/core';
import { formatFatalError } from '../platform/errors/format-fatal-error.js';
import { WorkerModule } from './worker.module.js';

async function bootstrapWorker() {
  const app = await NestFactory.createApplicationContext(WorkerModule, {
    logger: false,
  });

  app.enableShutdownHooks();

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
