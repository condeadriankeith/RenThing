import { renAIService } from '@/ren-ai/services/ren-ai-service';

describe('Comprehensive AI Test Suite', () => {
  it('should run a basic test to ensure the test suite is valid', () => {
    expect(renAIService).toBeDefined();
  });

  // Add a simple test to verify the AI service can process messages
  it('should process a simple message', async () => {
    const response = await renAIService.processMessage('Hello', {});
    expect(response.text).toBeDefined();
  });
});