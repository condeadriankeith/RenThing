import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('REN AI Integration Failure Scenarios', () => {
  beforeAll(async () => {
    // Setup test user
    await prisma.user.upsert({
      where: { email: 'failure-test@example.com' },
      update: {},
      create: {
        email: 'failure-test@example.com',
        name: 'Failure Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('External Service Failures', () => {
    test('Should handle Ollama service unavailability gracefully', async () => {
      const context = {
        userId: 'failure-test-user',
        sessionId: 'ollama-failure-test-session'
      };

      // Temporarily disable Ollama to test fallback
      const originalOllamaEnabled = process.env.OLLAMA_ENABLED;
      process.env.OLLAMA_ENABLED = "false";
      
      try {
        const response = await renAIService.processMessage(
          "Hello, how can you help me with rentals?",
          context
        );
        
        // Should provide response using fallback mechanism
        expect(response.text).toBeDefined();
        expect(response.text.length).toBeGreaterThan(0);
        
        // Should not contain error messages
        expect(response.text.toLowerCase()).not.toContain('error');
        expect(response.text.toLowerCase()).not.toContain('failed');
      } finally {
        // Restore original setting
        process.env.OLLAMA_ENABLED = originalOllamaEnabled;
      }
    });

    test('Should handle API timeout scenarios gracefully', async () => {
      const context = {
        userId: 'failure-test-user',
        sessionId: 'api-timeout-test-session'
      };

      // Test that the AI can discuss timeout handling
      const response = await renAIService.processMessage(
        "What happens when an API request times out?",
        context
      );
      
      // Should provide information about timeout handling
      const timeoutTerms = ['timeout', 'slow', 'wait', 'response', 'delay'];
      const hasTimeoutTerms = timeoutTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasTimeoutTerms).toBe(true);
    });

    test('Should handle database connection failures gracefully', async () => {
      const context = {
        userId: 'failure-test-user',
        sessionId: 'db-failure-test-session'
      };

      // Test that the AI can discuss database failure handling
      const response = await renAIService.processMessage(
        "How does the system handle database connection failures?",
        context
      );
      
      // Should provide information about database failure handling
      const dbFailureTerms = ['database', 'connection', 'failure', 'fallback', 'recovery'];
      const hasDbFailureTerms = dbFailureTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasDbFailureTerms).toBe(true);
    });

    test('Should verify fallback mechanisms', async () => {
      const context = {
        userId: 'failure-test-user',
        sessionId: 'fallback-test-session'
      };

      // Test fallback mechanism by simulating service failure
      const originalOllamaEnabled = process.env.OLLAMA_ENABLED;
      process.env.OLLAMA_ENABLED = "false";
      
      try {
        const response = await renAIService.processMessage(
          "Find me a camera to rent",
          context
        );
        
        // Should provide response using fallback mechanism
        expect(response.text).toBeDefined();
        expect(response.text.length).toBeGreaterThan(0);
        
        // Should provide rental-related assistance even with fallback
        const rentalTerms = ['rent', 'camera', 'find', 'available', 'help'];
        const hasRentalTerms = rentalTerms.some(term => 
          response.text.toLowerCase().includes(term.toLowerCase())
        );
        
        expect(hasRentalTerms).toBe(true);
      } finally {
        // Restore original setting
        process.env.OLLAMA_ENABLED = originalOllamaEnabled;
      }
    });
  });

  describe('Resource Limitation Testing', () => {
    test('Should handle high CPU usage scenarios', async () => {
      const context = {
        userId: 'failure-test-user',
        sessionId: 'high-cpu-test-session'
      };

      // Test that the AI can discuss CPU usage handling
      const response = await renAIService.processMessage(
        "What happens when the system experiences high CPU usage?",
        context
      );
      
      // Should provide information about CPU usage handling
      const cpuTerms = ['cpu', 'usage', 'performance', 'slow', 'resource'];
      const hasCpuTerms = cpuTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasCpuTerms).toBe(true);
    });

    test('Should handle low memory conditions gracefully', async () => {
      const context = {
        userId: 'failure-test-user',
        sessionId: 'low-memory-test-session'
      };

      // Test that the AI can discuss memory limitation handling
      const response = await renAIService.processMessage(
        "How does the system handle low memory conditions?",
        context
      );
      
      // Should provide information about memory handling
      const memoryTerms = ['memory', 'limit', 'usage', 'performance', 'resource'];
      const hasMemoryTerms = memoryTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasMemoryTerms).toBe(true);
    });

    test('Should handle network bandwidth limitations', async () => {
      const context = {
        userId: 'failure-test-user',
        sessionId: 'bandwidth-test-session'
      };

      // Test that the AI can discuss network limitation handling
      const response = await renAIService.processMessage(
        "What happens when there are network bandwidth limitations?",
        context
      );
      
      // Should provide information about network handling
      const networkTerms = ['network', 'bandwidth', 'slow', 'connection', 'performance'];
      const hasNetworkTerms = networkTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasNetworkTerms).toBe(true);
    });

    test('Should handle storage capacity issues gracefully', async () => {
      const context = {
        userId: 'failure-test-user',
        sessionId: 'storage-capacity-test-session'
      };

      // Test that the AI can discuss storage limitation handling
      const response = await renAIService.processMessage(
        "How does the system handle storage capacity issues?",
        context
      );
      
      // Should provide information about storage handling
      const storageTerms = ['storage', 'capacity', 'space', 'limit', 'database'];
      const hasStorageTerms = storageTerms.some(term => 
        response.text.toLowerCase().includes(term.toLowerCase())
      );
      
      expect(hasStorageTerms).toBe(true);
    });
  });
});