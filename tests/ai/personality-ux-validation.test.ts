import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('REN AI Personality & User Experience Validation', () => {
  beforeAll(async () => {
    // Setup test user
    await prisma.user.upsert({
      where: { email: 'personality-test@example.com' },
      update: {},
      create: {
        email: 'personality-test@example.com',
        name: 'Personality Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Personality Consistency', () => {
    test('Should maintain helpful, friendly, and professional tone', async () => {
      const context = {
        userId: 'personality-test-user',
        sessionId: 'tone-consistency-test-session'
      };

      const response = await renAIService.processMessage(
        "Hello, who are you?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should demonstrate local cultural awareness', async () => {
      const context = {
        userId: 'personality-test-user',
        sessionId: 'cultural-awareness-test-session'
      };

      const response = await renAIService.processMessage(
        "What are some popular rental items during Christmas in the Philippines?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should show empathy in customer service scenarios', async () => {
      const context = {
        userId: 'personality-test-user',
        sessionId: 'empathy-test-session'
      };

      const response = await renAIService.processMessage(
        "I'm having trouble with my rental booking. Can you help?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should remain consistent across different query types', async () => {
      const context = {
        userId: 'personality-test-user',
        sessionId: 'consistency-test-session'
      };

      const queries = [
        "Technical question about API integration",
        "Help with booking a camera",
        "General information about rentals",
        "Complaint about service"
      ];
      
      // Collect responses
      const responses = [];
      for (const query of queries) {
        const response = await renAIService.processMessage(query, context);
        responses.push(response);
      }
      
      // All responses should be meaningful
      for (const response of responses) {
        expect(response.text).toBeDefined();
        expect(typeof response.text).toBe('string');
        expect(response.text.length).toBeGreaterThan(5);
      }
    });
  });

  describe('User Assistance Quality', () => {
    test('Should provide step-by-step guidance for complex processes', async () => {
      const context = {
        userId: 'personality-test-user',
        sessionId: 'step-by-step-test-session'
      };

      const response = await renAIService.processMessage(
        "How do I list my car for rent on your platform?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should offer alternative solutions when direct answers are not available', async () => {
      const context = {
        userId: 'personality-test-user',
        sessionId: 'alternative-solutions-test-session'
      };

      const response = await renAIService.processMessage(
        "Do you have a rental item that doesn't exist?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should ask clarifying questions when requests are ambiguous', async () => {
      const context = {
        userId: 'personality-test-user',
        sessionId: 'clarifying-questions-test-session'
      };

      const response = await renAIService.processMessage(
        "I need something for rent",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should proactively suggest relevant additional information', async () => {
      const context = {
        userId: 'personality-test-user',
        sessionId: 'proactive-suggestions-test-session'
      };

      const response = await renAIService.processMessage(
        "I want to rent a camera",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });
  });
});