import { renAIService, type AIContext } from '@/lib/ai/ren-ai-service';

describe('RenAIService', () => {
  describe('processMessage', () => {
    it('should respond to greetings', async () => {
      const response = await renAIService.processMessage('Hello', {});
      expect(response.text).toContain('Hello! I\'m REN');
    });

    it('should handle search queries', async () => {
      const response = await renAIService.processMessage('Find camera rentals', {});
      expect(response.text).toContain('help you find');
    });

    it('should handle listing queries', async () => {
      const response = await renAIService.processMessage('List my tools', {});
      expect(response.text).toContain('list');
    });

    it('should handle booking queries', async () => {
      const response = await renAIService.processMessage('Check my bookings', {});
      expect(response.text).toContain('booking');
    });

    it('should provide default response for unknown queries', async () => {
      const response = await renAIService.processMessage('Unknown query', {});
      expect(response.text).toContain('I\'m REN');
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
      expect(suggestions.length).toBeGreaterThan(0);
    });
  });

  describe('scanCodebaseForIssues', () => {
    it('should return placeholder response for code scanning', async () => {
      const result = await renAIService.scanCodebaseForIssues();
      expect(result.suggestions[0]).toContain('Code scanning feature will be implemented');
    });
  });
});