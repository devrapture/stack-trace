import { PinoLogger } from 'nestjs-pino';
import { APP_CONFIG, AppConfig } from './platform/config/app-config.js';
import { formatFatalError } from './platform/errors/format-fatal-error.js';
import { createHttpApplication } from './platform/http/create-http-application.js';

async function bootstrap() {
  const app = await createHttpApplication();

  const config = app.get<AppConfig>(APP_CONFIG);
  app.enableShutdownHooks();

  const logger = await app.resolve<PinoLogger>(PinoLogger);
  logger.setContext('Bootstrap');

  await app.listen(config.port);

  logger.info(
    {
      event: 'api_started',
      port: config.port,
    },
    'Stack Trace API started',
  );
}

void bootstrap().catch((error: unknown) => {
  process.stderr.write(`${formatFatalError(error)}\n`);
  process.exitCode = 1;
});
