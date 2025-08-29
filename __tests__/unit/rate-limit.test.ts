import rateLimit from '../../lib/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should allow requests within the limit', () => {
    const limiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokens: 5, // 5 requests
    });

    for (let i = 0; i < 5; i++) {
      expect(limiter.check('test-key')).toBe(true);
    }
  });

  it('should block requests exceeding the limit', () => {
    const limiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokens: 5, // 5 requests
    });

    for (let i = 0; i < 5; i++) {
      limiter.check('test-key');
    }
    expect(limiter.check('test-key')).toBe(false);
  });

  it('should reset the count after the interval', () => {
    const limiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokens: 5, // 5 requests
    });

    for (let i = 0; i < 5; i++) {
      limiter.check('test-key');
    }
    expect(limiter.check('test-key')).toBe(false);

    jest.advanceTimersByTime(60 * 1000 + 1);

    expect(limiter.check('test-key')).toBe(true);
  });

  it('should handle multiple unique tokens independently', () => {
    const limiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokens: 2, // 2 requests
    });

    expect(limiter.check('key-1')).toBe(true);
    expect(limiter.check('key-1')).toBe(true);
    expect(limiter.check('key-1')).toBe(false);

    expect(limiter.check('key-2')).toBe(true);
    expect(limiter.check('key-2')).toBe(true);
    expect(limiter.check('key-2')).toBe(false);
  });

  it('should allow more requests if uniqueTokenPerInterval is higher', () => {
    const limiter = rateLimit({
      interval: 1000, // 1 second
      uniqueTokenPerInterval: 10, // 10 requests per second
    });

    for (let i = 0; i < 10; i++) {
      expect(limiter.check('another-key')).toBe(true);
    }
    expect(limiter.check('another-key')).toBe(false);
  });
});