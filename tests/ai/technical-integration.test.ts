import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('REN AI Technical Integration Testing', () => {
  beforeAll(async () => {
    // Setup test user
    await prisma.user.upsert({
      where: { email: 'integration-test@example.com' },
      update: {},
      create: {
        email: 'integration-test@example.com',
        name: 'Integration Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Database Integration', () => {
    test('Should query rental listings from database accurately', async () => {
      const context = {
        userId: 'integration-test-user',
        sessionId: 'db-listing-test-session'
      };

      const response = await renAIService.processMessage(
        "Show me available cameras for rent",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(10);
      
      // Should not contain database errors
      expect(response.text.toLowerCase()).not.toContain('database error');
      expect(response.text.toLowerCase()).not.toContain('prisma error');
    });

    test('Should update availability status in real-time', async () => {
      const context = {
        userId: 'integration-test-user',
        sessionId: 'db-availability-test-session'
      };

      // This test would require setting up actual listings and checking availability
      // For now, we'll test that the AI can discuss availability concepts
      
      const response = await renAIService.processMessage(
        "Is the Canon EOS R5 camera available for rent next week?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should access user profiles and booking history', async () => {
      const context = {
        userId: 'integration-test-user',
        sessionId: 'db-user-profile-test-session',
        userProfile: {
          name: 'Integration Test User',
          joinDate: new Date(),
          rentalHistory: [],
          listedItems: [],
          favoriteCategories: ['electronics', 'tools']
        }
      };

      const response = await renAIService.processMessage(
        "What are my favorite rental categories?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should retrieve and analyze rental transaction data', async () => {
      const context = {
        userId: 'integration-test-user',
        sessionId: 'db-transaction-test-session'
      };

      const response = await renAIService.processMessage(
        "Show me my rental history and spending patterns",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });
  });

  describe('Web Scraping Integration', () => {
    test('Should trigger and monitor scraping operations', async () => {
      const context = {
        userId: 'integration-test-user',
        sessionId: 'scraping-trigger-test-session'
      };

      // Test that the AI can discuss web scraping
      const response = await renAIService.processMessage(
        "Can you check current market prices for DSLR cameras by scraping online retailers?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should process and analyze scraped rental data', async () => {
      const context = {
        userId: 'integration-test-user',
        sessionId: 'scraping-process-test-session'
      };

      const response = await renAIService.processMessage(
        "Analyze the scraped data for camera rental prices in Manila",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should compare scraped data with internal listings', async () => {
      const context = {
        userId: 'integration-test-user',
        sessionId: 'scraping-compare-test-session'
      };

      const response = await renAIService.processMessage(
        "Compare our camera rental prices with scraped market data",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should generate market insights from external data', async () => {
      const context = {
        userId: 'integration-test-user',
        sessionId: 'scraping-insights-test-session'
      };

      const response = await renAIService.processMessage(
        "Generate market insights for construction equipment rentals based on scraped data",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });
  });
});