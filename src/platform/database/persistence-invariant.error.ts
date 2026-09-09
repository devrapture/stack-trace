export class PersistentInvariantError extends Error {
  constructor(fieldName: string) {
    super(`Persistence returned an unsupported value for ${fieldName}.`);
    this.name = 'PersistentInvariantError';
    Error.captureStackTrace(this, PersistentInvariantError);
  }
}
