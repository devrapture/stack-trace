import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Injectable,
} from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { PinoLogger } from 'nestjs-pino';
import { ApiErrorDto, ErrorResponseDto } from '../errors/error-response.dto.js';
import {
  mapExceptionToHttpError,
  toLoggableError,
} from '../errors/http-error-mapper.js';
import {
  getHttpRequestId,
  getHttpRoutePattern,
} from './http-request-metadata.js';

@Catch()
@Injectable()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(GlobalHttpExceptionFilter.name);
  }
  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<FastifyRequest>();
    const response = http.getResponse<FastifyReply>();

    const mapped = mapExceptionToHttpError(exception);

    const requestId = getHttpRequestId(request);

    if (mapped.statusCode >= 500) {
      this.logger.error(
        {
          event: 'http_request_failed',
          request_id: requestId,
          error_code: mapped.code,
          err: toLoggableError(exception),
          http: {
            method: request.method,
            route: getHttpRoutePattern(request),
            status_code: mapped.statusCode,
          },
        },
        'HTTP request failed',
      );
    }

    if (response.sent) {
      return;
    }

    response
      .status(mapped.statusCode)
      .send(
        new ErrorResponseDto(
          new ApiErrorDto(
            mapped.code,
            mapped.message,
            requestId,
            mapped.details,
          ),
        ),
      );
  }
}
