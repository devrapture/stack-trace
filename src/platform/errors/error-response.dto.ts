import { ErrorDetails } from './error-details.js';

export class ApiErrorDto {
  constructor(
    readonly code: string,
    readonly message: string,
    readonly request_id: string,
    readonly details: ErrorDetails,
  ) {}
}

export class ErrorResponseDto {
  constructor(readonly error: ApiErrorDto) {}
}
