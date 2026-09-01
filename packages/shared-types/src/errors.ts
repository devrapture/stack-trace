export type ErrorDetails = Readonly<Record<string, unknown>>;

export interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly request_id: string;
  readonly details: ErrorDetails;
}

export interface ErrorResponse {
  readonly error: ApiError;
}
