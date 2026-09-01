import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { PlatformLoggingModule } from '../logging/platform-logging.module.js';
import { ApiValidationPipe } from './api-validation.pipe.js';
import { GlobalHttpExceptionFilter } from './global-http-exception.filter.js';
import { RequestLogContextInterceptor } from './request-log-context.interceptor.js';

@Module({
  imports: [PlatformLoggingModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ApiValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalHttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogContextInterceptor,
    },
  ],
})
export class PlatformHttpModule {}
