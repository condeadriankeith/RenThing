import { logger } from "./logger";

const logContext = "Analytics";

type EventProperties = {
  [key: string]: any;
};

interface AnalyticsService {
  track(eventName: string, properties?: EventProperties): void;
  page(pageName: string, properties?: EventProperties): void;
  identify(userId: string, properties?: EventProperties): void;
}

class ConsoleAnalyticsService implements AnalyticsService {
  track(eventName: string, properties?: EventProperties): void {
    logger.info(`Tracking event: ${eventName}`, { context: logContext, details: properties });
  }

  page(pageName: string, properties?: EventProperties): void {
    logger.info(`Page view: ${pageName}`, { context: logContext, details: properties });
  }

  identify(userId: string, properties?: EventProperties): void {
    logger.info(`Identifying user: ${userId}`, { context: logContext, details: properties });
  }
}

// In a real application, you would swap this out for a proper analytics SDK (e.g., Google Analytics, Mixpanel, Segment)
// For now, we'll use a console-based logger.
export const analytics = {
  track: (event: string, properties?: Record<string, any>) => {
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ANALYTICS] ${event}`, properties)
    }
    
    // In production, you would send to your analytics service
    // Example: mixpanel.track(event, properties)
    // or: amplitude.logEvent(event, properties)
  },
  
  identify: (userId: string, traits?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ANALYTICS] identify ${userId}`, traits)
    }
  },
  
  page: (name: string, properties?: Record<string, any>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[ANALYTICS] page ${name}`, properties)
    }
  }
}

export const trackBooking = (listingId: string, amount: number) => {
  analytics.track('booking_created', { listingId, amount });
};

export const trackPayment = (status: 'success' | 'failed', amount: number, method: string) => {
  analytics.track(`payment_${status}`, { amount, method });
};

export const trackChat = (action: 'started' | 'message_sent' | 'completed') => {
  analytics.track(`chat_${action}`, { category: 'chat' });
};

export const trackSearch = (query: string, results: number) => {
  analytics.track('search_performed', { query, results });
};

export const trackUserJourney = (step: string, metadata?: Record<string, any>) => {
  analytics.track('user_journey', { step, ...metadata });
};
