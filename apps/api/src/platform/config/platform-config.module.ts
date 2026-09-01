import { FactoryProvider, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidatedEnvironment, validateEnvironment } from './environment.js';
import { APP_CONFIG, AppConfig, createAppConfig } from './app-config.js';

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

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      ignoreEnvFile: true,
      validate: validateEnvironment,
    }),
  ],
  providers: [appConfigProvider],
  exports: [APP_CONFIG],
})
export class PlatformConfigModule {}
