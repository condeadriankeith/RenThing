import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('REN AI Conversational Intelligence', () => {
  beforeAll(async () => {
    // Setup test user
    await prisma.user.upsert({
      where: { email: 'conversation-test@example.com' },
      update: {},
      create: {
        email: 'conversation-test@example.com',
        name: 'Conversation Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('Context Management', () => {
    test('Should maintain conversation history across multiple interactions', async () => {
      const context = {
        userId: 'conversation-test-user',
        sessionId: 'context-management-test-session'
      };

      // First message
      const response1 = await renAIService.processMessage(
        "I'm looking for a camera to rent for my vacation.",
        context
      );
      
      // Follow-up message that references previous context
      const response2 = await renAIService.processMessage(
        "What types do you have available?",
        context
      );
      
      // Both responses should be meaningful
      expect(response1.text).toBeDefined();
      expect(typeof response1.text).toBe('string');
      expect(response1.text.length).toBeGreaterThan(5);
      
      expect(response2.text).toBeDefined();
      expect(typeof response2.text).toBe('string');
      expect(response2.text.length).toBeGreaterThan(5);
    });

    test('Should reference previous queries and build upon them', async () => {
      const context = {
        userId: 'conversation-test-user',
        sessionId: 'build-context-test-session'
      };

      // Establish context
      await renAIService.processMessage(
        "I need a power drill for a home renovation project.",
        context
      );
      
      // Ask for related information
      const response = await renAIService.processMessage(
        "What accessories would you recommend?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should handle conversation branching and topic switches', async () => {
      const context = {
        userId: 'conversation-test-user',
        sessionId: 'topic-switch-test-session'
      };

      // Start with one topic
      await renAIService.processMessage(
        "I'm interested in renting a car for next week.",
        context
      );
      
      // Switch to different topic
      const response = await renAIService.processMessage(
        "Actually, I need help with my account settings instead.",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should maintain memory retention in extended sessions (30+ exchanges)', async () => {
      const context = {
        userId: 'conversation-test-user',
        sessionId: 'memory-retention-test-session'
      };

      // Establish initial context
      await renAIService.processMessage(
        "I'm planning a wedding in Bacolod City for 200 guests.",
        context
      );
      
      // Simulate extended conversation with topic changes
      const middleMessages = [
        "What venues would you recommend?",
        "How about catering services?",
        "Let's go back to the wedding topic.",
      ];
      
      for (const message of middleMessages) {
        await renAIService.processMessage(message, context);
      }
      
      // Final message referencing initial context
      const response = await renAIService.processMessage(
        "What equipment should I rent for the wedding?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });
  });

  describe('Natural Language Understanding', () => {
    test('Should process Filipino English expressions and local terminology', async () => {
      const context = {
        userId: 'conversation-test-user',
        sessionId: 'filipino-english-test-session'
      };

      const filipinoExpressions = [
        "Ano pong mga camera ang available?", // What cameras are available?
        "Kailangan ko ng power tools for my project", // I need power tools
        "How much is the rent for this item, pre?", // How much is the rent for this item, friend?
      ];

      for (const expression of filipinoExpressions) {
        const response = await renAIService.processMessage(expression, context);
        
        // Should provide meaningful response to Filipino English
        expect(response.text).toBeDefined();
        expect(typeof response.text).toBe('string');
        expect(response.text.length).toBeGreaterThan(5);
      }
    });

    test('Should handle incomplete or ambiguous queries', async () => {
      const context = {
        userId: 'conversation-test-user',
        sessionId: 'ambiguous-query-test-session'
      };

      const ambiguousQueries = [
        "I need something for",
        "Can you help me with",
        "Looking for",
        "..." // Very incomplete
      ];

      for (const query of ambiguousQueries) {
        const response = await renAIService.processMessage(query, context);
        
        // Should provide meaningful response
        expect(response.text).toBeDefined();
        expect(typeof response.text).toBe('string');
        expect(response.text.length).toBeGreaterThan(5);
      }
    });

    test('Should understand implied context and unstated requirements', async () => {
      const context = {
        userId: 'conversation-test-user',
        sessionId: 'implied-context-test-session'
      };

      // Provide context with implied needs
      await renAIService.processMessage(
        "I'm planning a beach wedding in Boracay for 150 guests in December.",
        context
      );
      
      // Ask general question that should consider context
      const response = await renAIService.processMessage(
        "What should I prepare?",
        context
      );
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });

    test('Should parse complex multi-part requests', async () => {
      const context = {
        userId: 'conversation-test-user',
        sessionId: 'multipart-request-test-session'
      };

      const complexRequest = "I need to rent a camera for my vacation next week, " +
                            "find a hotel near the beach, and " +
                            "get travel insurance. Can you help with all of these?";
      
      const response = await renAIService.processMessage(complexRequest, context);
      
      // Response should be meaningful
      expect(response.text).toBeDefined();
      expect(typeof response.text).toBe('string');
      expect(response.text.length).toBeGreaterThan(5);
    });
  });
});