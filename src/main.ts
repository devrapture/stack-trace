import { formatFatalError } from './platform/errors/format-fatal-error.js';
import { createHttpApplication } from './platform/http/create-http-application.js';

async function bootstrap() {
  const app = await createHttpApplication();
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap().catch((error: unknown) => {
  process.stderr.write(`${formatFatalError(error)}\n`);
  process.exitCode = 1;
});
