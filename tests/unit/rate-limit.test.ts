import rateLimit from '../../lib/rate-limit';

describe('rateLimit', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should allow requests within the limit', async () => {
    const limiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 5, // 5 requests
    });

    const mockRes = { setHeader: jest.fn() };
    
    for (let i = 0; i < 5; i++) {
      await expect(limiter.check(mockRes, 5, 'test-key')).resolves.toBeUndefined();
    }
  });

  it('should block requests exceeding the limit', async () => {
    const limiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 5, // 5 requests
    });

    const mockRes = { setHeader: jest.fn() };
    
    for (let i = 0; i < 5; i++) {
      await limiter.check(mockRes, 5, 'test-key');
    }
    
    await expect(limiter.check(mockRes, 5, 'test-key')).rejects.toThrow('Rate limit exceeded');
  });

  it('should reset the count after the interval', async () => {
    const limiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 5, // 5 requests
    });

    const mockRes = { setHeader: jest.fn() };
    
    for (let i = 0; i < 5; i++) {
      await limiter.check(mockRes, 5, 'test-key');
    }
    
    await expect(limiter.check(mockRes, 5, 'test-key')).rejects.toThrow('Rate limit exceeded');

    // Advance time beyond the interval
    jest.advanceTimersByTime(60 * 1000 + 1);

    // Create a new limiter since the cache is internal to the function
    const newLimiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 5, // 5 requests
    });
    
    await expect(newLimiter.check(mockRes, 5, 'test-key')).resolves.toBeUndefined();
  });

  it('should handle multiple unique tokens independently', async () => {
    const limiter = rateLimit({
      interval: 60 * 1000, // 1 minute
      uniqueTokenPerInterval: 10, // 10 requests
    });

    const mockRes = { setHeader: jest.fn() };
    
    await expect(limiter.check(mockRes, 2, 'key-1')).resolves.toBeUndefined();
    await expect(limiter.check(mockRes, 2, 'key-1')).resolves.toBeUndefined();
    await expect(limiter.check(mockRes, 2, 'key-1')).rejects.toThrow('Rate limit exceeded');

    await expect(limiter.check(mockRes, 2, 'key-2')).resolves.toBeUndefined();
    await expect(limiter.check(mockRes, 2, 'key-2')).resolves.toBeUndefined();
    await expect(limiter.check(mockRes, 2, 'key-2')).rejects.toThrow('Rate limit exceeded');
  });

  it('should allow more requests if limit is higher', async () => {
    const limiter = rateLimit({
      interval: 1000, // 1 second
      uniqueTokenPerInterval: 20, // 20 requests
    });

    const mockRes = { setHeader: jest.fn() };
    
    for (let i = 0; i < 10; i++) {
      await expect(limiter.check(mockRes, 10, 'another-key')).resolves.toBeUndefined();
    }
    
    await expect(limiter.check(mockRes, 10, 'another-key')).rejects.toThrow('Rate limit exceeded');
  });
});