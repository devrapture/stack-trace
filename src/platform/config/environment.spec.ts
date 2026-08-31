import { describe, expect, it } from 'vitest';

import { validateEnvironment } from './environment.js';

describe('validateEnvironment', () => {
  it('applies safe defaults', () => {
    const result = validateEnvironment({});

    expect(result).toEqual({
      NODE_ENV: 'development',
      PORT: 3_000,
      LOG_LEVEL: 'info',
      LOG_PRETTY: false,
      TRUST_PROXY_HOPS: 0,
      HTTP_BODY_LIMIT_BYTES: 1_048_576,
      CORS_ORIGINS: '',
    });
  });

  it('coerces string environment values', () => {
    const result = validateEnvironment({
      NODE_ENV: 'test',
      PORT: '4000',
      LOG_PRETTY: 'false',
      TRUST_PROXY_HOPS: '2',
      HTTP_BODY_LIMIT_BYTES: '2048',
    });

    expect(result.NODE_ENV).toBe('test');
    expect(result.PORT).toBe(4_000);
    expect(result.LOG_PRETTY).toBe(false);
    expect(result.TRUST_PROXY_HOPS).toBe(2);
    expect(result.HTTP_BODY_LIMIT_BYTES).toBe(2_048);
  });

  it('names invalid keys without printing their values', () => {
    expect(() =>
      validateEnvironment({
        PORT: '70000',
        LOG_LEVEL: 'definitely-not-valid',
      }),
    ).toThrowError('Environment validation failed for: LOG_LEVEL, PORT.');
  });

  it('rejects pretty logging in production', () => {
    expect(() =>
      validateEnvironment({
        NODE_ENV: 'production',
        LOG_PRETTY: 'true',
      }),
    ).toThrowError('Environment validation failed for: LOG_PRETTY.');
  });
});
