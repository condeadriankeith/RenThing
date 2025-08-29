import LRUCache from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, { count: number; timestamp: number }>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (res: any, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        let tokenData = tokenCache.get(token);
        if (!tokenData) {
          tokenData = { count: 0, timestamp: Date.now() };
          tokenCache.set(token, tokenData);
        }
        tokenData.count++;
        tokenData.timestamp = Date.now(); // Update timestamp on access


        const currentUsage = tokenData.count;
        const isRateLimited = currentUsage >= limit;
        const timeElapsed = Date.now() - tokenData.timestamp;
        const retryAfter = Math.round((tokenCache.ttl - timeElapsed) / 1000);



        if (isRateLimited) {
          if (res && typeof res.setHeader === 'function') {
            res.setHeader('Retry-After', retryAfter);
          }
          return reject(new Error('Rate limit exceeded'));
        }

        if (res && typeof res.setHeader === 'function') {
          res.setHeader('X-RateLimit-Limit', limit);
          res.setHeader('X-RateLimit-Remaining', limit - currentUsage);
          res.setHeader('X-RateLimit-Reset', retryAfter);
        }

        return resolve();
      }),
  };
}