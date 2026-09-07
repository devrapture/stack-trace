import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { getHttpRoutePattern } from './http-request-metadata.js';

@Injectable()
export class RequestLogContextInterceptor implements NestInterceptor {
  constructor(private logger: PinoLogger) {
    this.logger.setContext(RequestLogContextInterceptor.name);
  }
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    this.logger.assign({
      http_method: request.method,
      http_route: getHttpRoutePattern(request),
    });
    return next.handle();
  }
}
