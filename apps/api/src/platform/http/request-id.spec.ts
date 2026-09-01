import { describe, expect, it, vi } from 'vitest';

import { isSafeRequestId, resolveRequestId } from './request-id.js';

describe('isSafeRequestId', () => {
  it.each(['request-123', 'req_123', 'ios:device.42'])(
    'accepts %s',
    (value) => {
      expect(isSafeRequestId(value)).toBe(true);
    },
  );

  it.each(['', 'contains spaces', 'contains/slash', 'x'.repeat(129)])(
    'rejects %s',
    (value) => {
      expect(isSafeRequestId(value)).toBe(false);
    },
  );
});

describe('resolveRequestId', () => {
  it('preserves one safe client request ID', () => {
    const generator = vi.fn((): string => 'req_generated');

    const result = resolveRequestId('client_123', generator);

    expect(result).toBe('client_123');
    expect(generator).not.toHaveBeenCalled();
  });

  it('replaces an unsafe request ID', () => {
    const generator = vi.fn((): string => 'req_generated');

    const result = resolveRequestId('unsafe request id', generator);

    expect(result).toBe('req_generated');
    expect(generator).toHaveBeenCalledOnce();
  });

  it('rejects multiple header values', () => {
    const generator = vi.fn((): string => 'req_generated');

    expect(resolveRequestId(['first', 'second'], generator)).toBe(
      'req_generated',
    );
  });
});
