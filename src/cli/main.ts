import { NestFactory } from '@nestjs/core';
import { CliModule } from './cli.module.js';
import { formatFatalError } from '../platform/errors/format-fatal-error.js';

async function runDoctorCommand() {
  const app = await NestFactory.createApplicationContext(CliModule, {
    logger: false,
  });

  app.enableShutdownHooks();

  process.stdout.write(
    'Stack Trace worker application context started successfully.\n',
  );

  await app.close();

  process.exit(0);
}

async function main() {
  const command = process.argv[2];

  if (command !== 'doctor') {
    process.stderr.write('Usage: bun run cli -- doctor\n');
    process.exitCode = 2;
    return;
  }

  await runDoctorCommand();
}

void main().catch((error: unknown) => {
  process.stderr.write(`${formatFatalError(error)}\n`);
  process.exitCode = 1;
});
