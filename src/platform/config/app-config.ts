import {
  LogLevel,
  NodeEnviroment,
  ValidatedEnvironment,
} from './environment.js';

export const APP_CONFIG = Symbol('APP_CONFIG');

export interface AppConfig {
  readonly nodeEnvironment: NodeEnviroment;
  readonly port: number;
  readonly logLevel: LogLevel;
  readonly logPretty: boolean;
  readonly trustProxy: false | number;
  readonly httpBodyLimitBytes: number;
  readonly corsOrigins: readonly string[];
}

const normalizeCorsOrigin = (rawOrigin: string): string => {
  let parsed: URL;

  try {
    parsed = new URL(rawOrigin);
  } catch {
    throw new Error('CORS_ORIGINS contain invalid url.');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('CORS_ORIGINS must contain only http or https origins.');
  }

  if (
    parsed.username !== '' ||
    parsed.password !== '' ||
    parsed.pathname !== '/' ||
    parsed.search !== '' ||
    parsed.hash !== ''
  ) {
    throw new Error(
      'CORS_ORIGINS entries must not contain credentials, paths, queries, or fragments.',
    );
  }

  return parsed.origin;
};

export const parseCorsOrigins = (rawOrigins: string): readonly string[] => {
  if (rawOrigins.trim() === '') {
    return Object.freeze([]);
  }
  const origins = new Set<string>();
  for (const part of rawOrigins.split(',')) {
    const origin = part.trim();

    if (origin === '') {
      continue;
    }
    origins.add(normalizeCorsOrigin(part));
  }
  return Object.freeze([...origins]);
};

export const createAppConfig = (
  environment: ValidatedEnvironment,
): AppConfig => {
  return Object.freeze({
    nodeEnvironment: environment.NODE_ENV,
    port: environment.PORT,
    logLevel: environment.LOG_LEVEL,
    logPretty: environment.LOG_PRETTY,
    trustProxy:
      environment.TRUST_PROXY_HOPS === 0 ? false : environment.TRUST_PROXY_HOPS,
    httpBodyLimitBytes: environment.HTTP_BODY_LIMIT_BYTES,
    corsOrigins: parseCorsOrigins(environment.CORS_ORIGINS),
  });
};
