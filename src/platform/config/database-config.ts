import { ValidatedEnvironment } from './environment.js';

export const DATABASE_CONFIG = Symbol('DATABASE_CONFIG');

export interface DatabaseConfig {
  readonly connectionString: string;
  readonly poolMax: number;
  readonly connectionTimeoutMs: number;
  readonly idleTimeoutMs: number;
  readonly maxLifetimeSeconds: number;
}

export const createDatabaseConfig = (
  environment: ValidatedEnvironment,
): DatabaseConfig => {
  return Object.freeze({
    connectionString: environment.DATABASE_URL,
    poolMax: environment.DATABASE_POOL_MAX,
    connectionTimeoutMs: environment.DATABASE_CONNECTION_TIMEOUT_MS,
    idleTimeoutMs: environment.DATABASE_IDLE_TIMEOUT_MS,
    maxLifetimeSeconds: environment.DATABASE_MAX_LIFETIME_SECONDS,
  });
};
