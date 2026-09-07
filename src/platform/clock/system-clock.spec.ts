import { SystemClock } from './system-clock.js';

describe('System clock', () => {
  it('should be working', () => {
    const clock = new SystemClock();
    const before = Date.now();

    const actualTime = clock.now().getTime();
    const after = Date.now();

    expect(actualTime).toBeGreaterThanOrEqual(before);
    expect(actualTime).toBeLessThanOrEqual(after);
  });
});
