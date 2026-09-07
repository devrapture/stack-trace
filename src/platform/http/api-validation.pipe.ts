import { Injectable, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { RequestValidationError } from '../errors/request-validation.error.js';
import { flattenValidationErrors } from './flatten-validation-errors.js';

@Injectable()
export class ApiValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },

      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      stopAtFirstError: false,

      validationError: {
        target: false,
        value: false,
      },

      exceptionFactory: (errors: ValidationError[]) => {
        return new RequestValidationError(flattenValidationErrors(errors));
      },
    });
  }
}
