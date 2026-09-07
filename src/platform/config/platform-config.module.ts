import { FactoryProvider, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_CONFIG, AppConfig, createAppConfig } from './app-config.js';
import {
  createDatabaseConfig,
  DATABASE_CONFIG,
  DatabaseConfig,
} from './database-config.js';
import { ValidatedEnvironment, validateEnvironment } from './environment.js';

const readValidatedEnvironment = (
  configService: ConfigService<ValidatedEnvironment, true>,
): ValidatedEnvironment => {
  return {
    NODE_ENV: configService.getOrThrow('NODE_ENV', {
      infer: true,
    }),
    PORT: configService.getOrThrow('PORT', {
      infer: true,
    }),
    LOG_LEVEL: configService.getOrThrow('LOG_LEVEL', {
      infer: true,
    }),
    LOG_PRETTY: configService.getOrThrow('LOG_PRETTY', {
      infer: true,
    }),
    TRUST_PROXY_HOPS: configService.getOrThrow('TRUST_PROXY_HOPS', {
      infer: true,
    }),
    HTTP_BODY_LIMIT_BYTES: configService.getOrThrow('HTTP_BODY_LIMIT_BYTES', {
      infer: true,
    }),
    CORS_ORIGINS: configService.getOrThrow('CORS_ORIGINS', {
      infer: true,
    }),

    DATABASE_URL: configService.getOrThrow('DATABASE_URL', {
      infer: true,
    }),
    DATABASE_POOL_MAX: configService.getOrThrow('DATABASE_POOL_MAX', {
      infer: true,
    }),
    DATABASE_CONNECTION_TIMEOUT_MS: configService.getOrThrow(
      'DATABASE_CONNECTION_TIMEOUT_MS',
      {
        infer: true,
      },
    ),
    DATABASE_IDLE_TIMEOUT_MS: configService.getOrThrow(
      'DATABASE_IDLE_TIMEOUT_MS',
      {
        infer: true,
      },
    ),
    DATABASE_MAX_LIFETIME_SECONDS: configService.getOrThrow(
      'DATABASE_MAX_LIFETIME_SECONDS',
      {
        infer: true,
      },
    ),
  };
};

const appConfigProvider: FactoryProvider<AppConfig> = {
  provide: APP_CONFIG,
  inject: [ConfigService],
  useFactory: (
    configService: ConfigService<ValidatedEnvironment, true>,
  ): AppConfig => {
    const environment = readValidatedEnvironment(configService);
    return createAppConfig(environment);
  },
};

const databaseConfigProvider: FactoryProvider<DatabaseConfig> = {
  provide: DATABASE_CONFIG,
  inject: [ConfigService],
  useFactory: (
    configService: ConfigService<ValidatedEnvironment, true>,
  ): DatabaseConfig => {
    const environment = readValidatedEnvironment(configService);
    return createDatabaseConfig(environment);
  },
};

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      // ignoreEnvFile: true,
      validate: validateEnvironment,
    }),
  ],
  providers: [appConfigProvider, databaseConfigProvider],
  exports: [APP_CONFIG, DATABASE_CONFIG],
})
export class PlatformConfigModule {}
