import type { ApiError, ErrorResponse } from 'shared-types';
import { type ErrorDetails } from './error-details.js';

export class ApiErrorDto implements ApiError {
  constructor(
    readonly code: string,
    readonly message: string,
    readonly request_id: string,
    readonly details: ErrorDetails,
  ) {}
}

export class ErrorResponseDto implements ErrorResponse {
  constructor(readonly error: ApiErrorDto) {}
}
