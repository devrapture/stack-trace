import Joi from 'joi';

export const NODE_ENVIRONMENTS = ['development', 'test', 'production'] as const;
export type NodeEnviroment = (typeof NODE_ENVIRONMENTS)[number];

export const LOG_LEVELS = [
  'fatal',
  'error',
  'warn',
  'info',
  'debug',
  'trace',
  'silent',
] as const;
export type LogLevel = (typeof LOG_LEVELS)[number];

export interface ValidatedEnvironment {
  readonly NODE_ENV: NodeEnviroment;
  readonly PORT: number;
  readonly LOG_LEVEL: LogLevel;
  readonly LOG_PRETTY: boolean;
  readonly TRUST_PROXY_HOPS: number;
  readonly HTTP_BODY_LIMIT_BYTES: number;
  readonly CORS_ORIGINS: string;
}

const MAXIMUM_BODY_LIMIT_BYTES = 5 * 1_024 * 1_024; // 5MiB

const environmentSchema = Joi.object<ValidatedEnvironment>({
  NODE_ENV: Joi.string()
    .valid(...NODE_ENVIRONMENTS)
    .default('development'),
  PORT: Joi.number().integer().min(1).max(65_535).default(3_000),
  LOG_LEVEL: Joi.string()
    .valid(...LOG_LEVELS)
    .default('info'),
  LOG_PRETTY: Joi.boolean().default(false),
  TRUST_PROXY_HOPS: Joi.number().integer().min(0).max(10).default(0),
  HTTP_BODY_LIMIT_BYTES: Joi.number()
    .integer()
    .min(1_024)
    .max(MAXIMUM_BODY_LIMIT_BYTES)
    .default(1_048_576),
  CORS_ORIGINS: Joi.string().trim().allow('').max(4_096).default(''),
}).unknown(true);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNodeEnvironment = (value: unknown): value is NodeEnviroment => {
  return NODE_ENVIRONMENTS.includes(value as NodeEnviroment);
};

const isLogLevel = (value: unknown): value is LogLevel => {
  return LOG_LEVELS.includes(value as LogLevel);
};

function getInvalidEnvironmentKeys(
  error: Joi.ValidationError,
): readonly string[] {
  const keys = new Set<string>();

  for (const detail of error.details) {
    const key =
      detail.path.length === 0 ? 'environment' : detail.path.join('.');
    keys.add(key);
  }

  return [...keys].sort();
}

export const validateEnvironment = (
  input: Record<string, unknown>,
): ValidatedEnvironment => {
  const result = environmentSchema.validate(input, {
    abortEarly: false,
    allowUnknown: true,
    convert: true,
  });

  if (result.error !== undefined) {
    const keys = getInvalidEnvironmentKeys(result.error);
    throw new Error(`Environment validation failed for: ${keys.join(', ')}.`);
  }

  const value: unknown = result.value;
  if (!isRecord(value)) {
    throw new Error('Environment validation produced an invalid result.');
  }

  const nodeEnvironment = value['NODE_ENV'];
  const port = value['PORT'];
  const logLevel = value['LOG_LEVEL'];
  const logPretty = value['LOG_PRETTY'];
  const trustProxyHops = value['TRUST_PROXY_HOPS'];
  const bodyLimitBytes = value['HTTP_BODY_LIMIT_BYTES'];
  const corsOrigins = value['CORS_ORIGINS'];

  if (
    !isNodeEnvironment(nodeEnvironment) ||
    typeof port !== 'number' ||
    !isLogLevel(logLevel) ||
    typeof logPretty !== 'boolean' ||
    typeof trustProxyHops !== 'number' ||
    typeof bodyLimitBytes !== 'number' ||
    typeof corsOrigins !== 'string'
  ) {
    throw new Error('Environment validation produced an invalid typed result.');
  }

  if (nodeEnvironment === 'production' && logPretty) {
    throw new Error('Environment validation failed for: LOG_PRETTY.');
  }

  return Object.freeze({
    NODE_ENV: nodeEnvironment,
    PORT: port,
    LOG_LEVEL: logLevel,
    LOG_PRETTY: logPretty,
    TRUST_PROXY_HOPS: trustProxyHops,
    HTTP_BODY_LIMIT_BYTES: bodyLimitBytes,
    CORS_ORIGINS: corsOrigins,
  });
};
