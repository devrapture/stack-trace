import { HttpException, HttpStatus } from '@nestjs/common';

import { ApplicationError } from './application-error.js';
import { EMPTY_ERROR_DETAILS, type ErrorDetails } from './error-details.js';

export interface MappedHttpError {
  readonly statusCode: number;
  readonly code: string;
  readonly message: string;
  readonly details: ErrorDetails;
}

interface GenericHttpErrorDefinition {
  readonly code: string;
  readonly message: string;
}

const genericDefinitionForStatus = (
  statusCode: number,
): GenericHttpErrorDefinition => {
  switch (statusCode) {
    case HttpStatus.BAD_REQUEST:
      return {
        code: 'bad_request',
        message: 'The request was invalid.',
      };

    case HttpStatus.UNAUTHORIZED:
      return {
        code: 'unauthorized',
        message: 'Authentication is required.',
      };

    case HttpStatus.FORBIDDEN:
      return {
        code: 'forbidden',
        message: 'You are not permitted to perform this action.',
      };

    case HttpStatus.NOT_FOUND:
      return {
        code: 'not_found',
        message: 'The requested resource was not found.',
      };

    case HttpStatus.METHOD_NOT_ALLOWED:
      return {
        code: 'method_not_allowed',
        message: 'The HTTP method is not allowed for this resource.',
      };

    case HttpStatus.CONFLICT:
      return {
        code: 'conflict',
        message: 'The request conflicts with the current resource state.',
      };

    case HttpStatus.PAYLOAD_TOO_LARGE:
      return {
        code: 'payload_too_large',
        message: 'The request body was too large.',
      };

    case HttpStatus.UNSUPPORTED_MEDIA_TYPE:
      return {
        code: 'unsupported_media_type',
        message: 'The request media type is not supported.',
      };

    case HttpStatus.UNPROCESSABLE_ENTITY:
      return {
        code: 'unprocessable_entity',
        message: 'The request could not be processed.',
      };

    case HttpStatus.TOO_MANY_REQUESTS:
      return {
        code: 'rate_limit_exceeded',
        message: 'Too many requests were received.',
      };

    default:
      return {
        code: 'http_error',
        message: 'The request could not be completed.',
      };
  }
};

function internalError(): MappedHttpError {
  return {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    code: 'internal_error',
    message: 'An unexpected error occurred.',
    details: EMPTY_ERROR_DETAILS,
  };
}

export function mapExceptionToHttpError(exception: unknown): MappedHttpError {
  if (exception instanceof ApplicationError) {
    return {
      statusCode: exception.statusCode,
      code: exception.code,
      message: exception.publicMessage,
      details: exception.details,
    };
  }

  if (exception instanceof HttpException) {
    const statusCode = exception.getStatus();

    if (statusCode < HttpStatus.BAD_REQUEST || statusCode >= 500) {
      return internalError();
    }

    const definition = genericDefinitionForStatus(statusCode);

    return {
      statusCode,
      code: definition.code,
      message: definition.message,
      details: EMPTY_ERROR_DETAILS,
    };
  }

  return internalError();
}

export function toLoggableError(exception: unknown): Error {
  if (exception instanceof Error) {
    return exception;
  }

  return new Error(`A non-Error value of type ${typeof exception} was thrown.`);
}
