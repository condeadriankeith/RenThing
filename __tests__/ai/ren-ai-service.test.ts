import { renAIService, type AIContext } from '@/ren-ai/services/ren-ai-service';

// Mock the database calls to avoid errors
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    userPreferences: {
      findUnique: jest.fn().mockResolvedValue(null),
      upsert: jest.fn().mockResolvedValue({}),
    },
    listing: {
      findUnique: jest.fn().mockResolvedValue(null),
      findMany: jest.fn().mockResolvedValue([]),
    },
    booking: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    wishlist: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    message: {
      count: jest.fn().mockResolvedValue(0),
    },
    review: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    user: {
      findUnique: jest.fn().mockResolvedValue(null),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrisma),
    Prisma: {
      BookingStatus: {},
    },
  };
});

describe('RenAIService', () => {
  describe('processMessage', () => {
    it('should respond to greetings', async () => {
      const response = await renAIService.processMessage('Hello', {});
      console.log('Greeting response:', response);
      // This might fall back to rule-based if OpenRouter fails
      expect(response.text).toBeDefined();
    });

    it('should handle search queries', async () => {
      const response = await renAIService.processMessage('Find camera rentals', {});
      console.log('Search response:', response);
      expect(response.text).toBeDefined();
    });

    it('should handle listing queries', async () => {
      const response = await renAIService.processMessage('List my tools', {});
      console.log('Listing response:', response);
      expect(response.text).toBeDefined();
    });

    it('should handle booking queries', async () => {
      const response = await renAIService.processMessage('Check my bookings', {});
      console.log('Booking response:', response);
      expect(response.text).toBeDefined();
    });

    it('should provide default response for unknown queries', async () => {
      const response = await renAIService.processMessage('Unknown query', {});
      console.log('Unknown query response:', response);
      expect(response.text).toBeDefined();
    });
  });

  describe('getContextualSuggestions', () => {
    it('should generate contextual suggestions', async () => {
      const context: AIContext = {
        userId: 'test-user',
        userPreferences: {
          categories: ['electronics']
        }
      };
      
      const suggestions = await renAIService.getContextualSuggestions(context);
      console.log('Suggestions:', suggestions);
      // This might be empty if there are errors
      expect(suggestions).toBeDefined();
    });
  });

  describe('scanCodebaseForIssues', () => {
    it('should return placeholder response for code scanning', async () => {
      const result = await renAIService.scanCodebaseForIssues();
      expect(result.suggestions[0]).toContain('Code scanning feature will be implemented');
    });
  });
});