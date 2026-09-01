import {
  BadRequestException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { describe, expect, it } from 'vitest';

import { ApplicationError } from './application-error.js';
import {
  mapExceptionToHttpError,
  toLoggableError,
} from './http-error-mapper.js';

class ProbeConflictError extends ApplicationError {
  public constructor() {
    super({
      code: 'probe_conflict',
      publicMessage: 'The probe conflicts with existing state.',
      statusCode: HttpStatus.CONFLICT,
      details: {
        field: 'probe',
      },
    });
  }
}

describe('mapExceptionToHttpError', () => {
  it('preserves expected application errors', () => {
    const result = mapExceptionToHttpError(new ProbeConflictError());

    expect(result).toEqual({
      statusCode: 409,
      code: 'probe_conflict',
      message: 'The probe conflicts with existing state.',
      details: {
        field: 'probe',
      },
    });
  });

  it('maps generic bad requests safely', () => {
    const result = mapExceptionToHttpError(
      new BadRequestException('Internal implementation detail'),
    );

    expect(result.code).toBe('bad_request');

    expect(result.message).not.toContain('implementation detail');
  });

  it('hides internal HTTP exception messages', () => {
    const result = mapExceptionToHttpError(
      new InternalServerErrorException('SQL connection string leaked'),
    );

    expect(result).toEqual({
      statusCode: 500,
      code: 'internal_error',
      message: 'An unexpected error occurred.',
      details: {},
    });
  });

  it('maps unknown exceptions to internal_error', () => {
    const result = mapExceptionToHttpError(new Error('Unexpected failure'));

    expect(result.code).toBe('internal_error');
  });
});

describe('toLoggableError', () => {
  it('does not stringify a non-Error thrown value', () => {
    const result = toLoggableError('possible-secret-value');

    expect(result.message).not.toContain('possible-secret-value');

    expect(result.message).toContain('type string');
  });
});
