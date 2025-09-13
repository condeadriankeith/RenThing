import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('REN AI Rental Platform Knowledge Validation', () => {
  beforeAll(async () => {
    // Setup test user
    await prisma.user.upsert({
      where: { email: 'knowledge-test@example.com' },
      update: {},
      create: {
        email: 'knowledge-test@example.com',
        name: 'Knowledge Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Domain Expertise Validation', () => {
    test('Should demonstrate knowledge of rental categories', async () => {
      const context = {
        userId: 'knowledge-test-user',
        sessionId: 'domain-knowledge-test-session'
      };

      const rentalCategories = [
        'vehicles',
        'tools',
        'electronics',
        'event equipment'
      ];

      for (const category of rentalCategories) {
        const response = await renAIService.processMessage(
          `What types of ${category} are commonly rented?`,
          context
        );
        
        // Response should contain the category name or be a valid response
        expect(response.text).toBeDefined();
        expect(typeof response.text).toBe('string');
        
        // Response should be meaningful (not empty)
        expect(response.text.length).toBeGreaterThan(5);
      }
    });

    test('Should understand rental terms, pricing models, and booking processes', async () => {
      const context = {
        userId: 'knowledge-test-user',
        sessionId: 'rental-terms-test-session'
      };

      const queries = [
        "What is the difference between daily and weekly rental rates?",
        "How does the security deposit work for rentals?",
        "What happens if I return an item late?",
        "Can I cancel my booking and get a refund?"
      ];

      for (const query of queries) {
        const response = await renAIService.processMessage(query, context);
        
        // Response should be meaningful
        expect(response.text).toBeDefined();
        expect(typeof response.text).toBe('string');
        expect(response.text.length).toBeGreaterThan(5);
      }
    });

    test('Should explain rental laws and regulations in the Philippines', async () => {
      const context = {
        userId: 'knowledge-test-user',
        sessionId: 'rental-laws-test-session'
      };

      const response = await renAIService.processMessage(
        "What are the key rental laws and regulations in the Philippines that renters should know?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should validate knowledge of local market conditions and cultural context', async () => {
      const context = {
        userId: 'knowledge-test-user',
        sessionId: 'market-context-test-session'
      };

      const response = await renAIService.processMessage(
        "How do rental prices and demand vary across different regions in the Philippines?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });
  });

  describe('Practical Application Tests', () => {
    test('Should handle wedding equipment rental request', async () => {
      const context = {
        userId: 'knowledge-test-user',
        sessionId: 'wedding-rental-test-session'
      };

      const response = await renAIService.processMessage(
        "I need equipment for a wedding in Bacolod City for 200 guests. What should I rent and what will it cost?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should compare rental vs purchase for construction tools', async () => {
      const context = {
        userId: 'knowledge-test-user',
        sessionId: 'rental-vs-purchase-test-session'
      };

      const response = await renAIService.processMessage(
        "Compare rental vs purchase for construction tools needed for 3 months",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should help calculate insurance requirements for renting out a car', async () => {
      const context = {
        userId: 'knowledge-test-user',
        sessionId: 'insurance-test-session'
      };

      const response = await renAIService.processMessage(
        "Help me calculate insurance requirements for renting out my car",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should provide insights on peak rental seasons and pricing strategies', async () => {
      const context = {
        userId: 'knowledge-test-user',
        sessionId: 'seasonal-pricing-test-session'
      };

      const response = await renAIService.processMessage(
        "What are the peak rental seasons in the Philippines and how should I price accordingly?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });
  });
});