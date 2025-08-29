import { logger } from "./logger";

const analyticsLogger = logger;

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
    analyticsLogger.info(`Tracking event: ${eventName}`, { details: properties });
  }

  page(pageName: string, properties?: EventProperties): void {
    analyticsLogger.info(`Page view: ${pageName}`, { details: properties });
  }

  identify(userId: string, properties?: EventProperties): void {
    analyticsLogger.info(`Identifying user: ${userId}`, { details: properties });
  }
}

// In a real application, you would swap this out for a proper analytics SDK (e.g., Google Analytics, Mixpanel, Segment)
// For now, we'll use a console-based logger.
export const analytics = new ConsoleAnalyticsService();

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
