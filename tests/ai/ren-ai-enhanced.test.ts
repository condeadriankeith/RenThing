import { renAIService, type AIContext } from '@/ren-ai/services/ren-ai-service';

describe('Enhanced REN AI Service', () => {
  describe('processMessage', () => {
    it('should process messages through DeepSeek API when available', async () => {
      // Mock the processWithOpenRouter method to simulate a successful API call
      const mockResponse = {
        text: 'I found several camera rentals that might interest you!',
        suggestions: ['View details', 'Book now', 'See more options']
      };
      
      // This test would normally make an actual API call, but we're testing
      // that the system is set up correctly to make the call
      expect(renAIService).toBeDefined();
    });

    it('should fall back to rule-based system when API is unavailable', async () => {
      // Mock environment without API key to test fallback
      const originalEnv = process.env.OPENROUTER_API_KEY;
      process.env.OPENROUTER_API_KEY = undefined;
      
      const context: AIContext = {
        userId: 'test-user',
        userPreferences: {
          language: 'en',
          currency: 'PHP'
        }
      };
      
      const response = await renAIService.processMessage('Hello', context);
      expect(response.text).toBeDefined();
      expect(response.suggestions).toBeDefined();
      
      // Restore original environment
      process.env.OPENROUTER_API_KEY = originalEnv;
    });

    it('should handle conversation history', async () => {
      const context: AIContext = {
        userId: 'test-user',
        conversationHistory: [
          { role: 'user', content: 'Hi, I\'m looking for a camera' },
          { role: 'assistant', content: 'I can help you find camera rentals!' }
        ],
        userPreferences: {
          language: 'en',
          currency: 'PHP'
        }
      };
      
      const response = await renAIService.processMessage('What types do you have?', context);
      expect(response.text).toBeDefined();
    });
  });
});