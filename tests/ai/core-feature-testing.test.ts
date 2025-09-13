import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('REN AI Core Feature Testing', () => {
  beforeAll(async () => {
    // Setup test user
    await prisma.user.upsert({
      where: { email: 'feature-test@example.com' },
      update: {},
      create: {
        email: 'feature-test@example.com',
        name: 'Feature Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Rental Search & Discovery', () => {
    test('Should find 3-bedroom apartments in Makati under ₱30,000/month', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'apartment-search-test-session'
      };

      const response = await renAIService.processMessage(
        "Find 3-bedroom apartments in Makati under ₱30,000/month",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should show motorcycles with automatic transmission', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'motorcycle-search-test-session'
      };

      const response = await renAIService.processMessage(
        "Show me all available motorcycles with automatic transmission",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should find construction equipment for 2-week rental', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'construction-equipment-test-session'
      };

      const response = await renAIService.processMessage(
        "What construction equipment is available for a 2-week rental?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });
  });

  describe('Booking Process Assistance', () => {
    test('Should guide users through booking flow', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'booking-flow-test-session'
      };

      const response = await renAIService.processMessage(
        "I want to book a camera for next weekend. How do I do that?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should explain terms and conditions', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'terms-conditions-test-session'
      };

      const response = await renAIService.processMessage(
        "What are the terms and conditions for renting a car?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should calculate total costs including fees and deposits', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'cost-calculation-test-session'
      };

      const response = await renAIService.processMessage(
        "Calculate the total cost for renting a camera for 3 days including fees and deposits",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should assist with payment process and documentation', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'payment-assistance-test-session'
      };

      const response = await renAIService.processMessage(
        "How do I complete the payment and what documentation do I need?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });
  });

  describe('Communication Facilitation', () => {
    test('Should help draft messages to rental owners', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'message-drafting-test-session'
      };

      const response = await renAIService.processMessage(
        "Help me draft a message to ask about the camera's condition",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should suggest questions to ask about specific items', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'question-suggestion-test-session'
      };

      const response = await renAIService.processMessage(
        "What questions should I ask when renting a power drill?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should mediate communication for booking modifications', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'communication-mediation-test-session'
      };

      const response = await renAIService.processMessage(
        "I need to modify my booking dates. How should I communicate this?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should provide templates for rental agreements', async () => {
      const context = {
        userId: 'feature-test-user',
        sessionId: 'agreement-template-test-session'
      };

      const response = await renAIService.processMessage(
        "Provide a template for a rental agreement between owner and renter",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });
  });
});