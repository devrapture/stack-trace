import { ValidationError } from 'class-validator';
import { describe, expect, it } from 'vitest';

import { flattenValidationErrors } from './flatten-validation-errors.js';

function createValidationError(
  property: string,
  constraints: Record<string, string> | undefined,
  children: ValidationError[] = [],
): ValidationError {
  const error = new ValidationError();

  error.property = property;
  error.constraints = constraints;
  error.children = children;

  return error;
}

describe('flattenValidationErrors', () => {
  it('flattens nested errors in deterministic order', () => {
    const result = flattenValidationErrors([
      createValidationError('profile', undefined, [
        createValidationError('displayName', {
          minLength: 'displayName is too short',
        }),
      ]),
      createValidationError('email', {
        isEmail: 'email must be an email',
      }),
    ]);

    expect(result).toEqual([
      {
        field: 'email',
        messages: ['email must be an email'],
      },
      {
        field: 'profile.displayName',
        messages: ['displayName is too short'],
      },
    ]);
  });
});
