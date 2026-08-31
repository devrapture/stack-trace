import { EMPTY_ERROR_DETAILS, type ErrorDetails } from './error-details.js';

export interface ApplicationErrorOptions {
  readonly code: string;
  readonly publicMessage: string;
  readonly statusCode: number;
  readonly details?: ErrorDetails;
  readonly cause?: unknown;
}

export class ApplicationError extends Error {
  readonly code: string;
  readonly publicMessage: string;
  readonly statusCode: number;
  readonly details: ErrorDetails;

  constructor(options: ApplicationErrorOptions) {
    super(options.publicMessage, {
      cause: options.cause,
    });

    this.name = new.target.name;
    this.code = options.code;
    this.publicMessage = options.publicMessage;
    this.statusCode = options.statusCode;
    this.details = options.details ?? EMPTY_ERROR_DETAILS;

    Error.captureStackTrace?.(this, new.target);
  }
}
