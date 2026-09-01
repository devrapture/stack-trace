import { HttpStatus } from '@nestjs/common';

import { ApplicationError } from './application-error.js';

export interface ValidationIssue {
  readonly field: string;
  readonly messages: readonly string[];
}

function freezeValidationIssues(
  issues: readonly ValidationIssue[],
): readonly ValidationIssue[] {
  return Object.freeze(
    issues.map((issue) =>
      Object.freeze({
        field: issue.field,
        messages: Object.freeze([...issue.messages]),
      }),
    ),
  );
}

export class RequestValidationError extends ApplicationError {
  public constructor(issues: readonly ValidationIssue[]) {
    super({
      code: 'validation_failed',
      publicMessage: 'The request was invalid.',
      statusCode: HttpStatus.BAD_REQUEST,
      details: Object.freeze({
        issues: freezeValidationIssues(issues),
      }),
    });
  }
}
