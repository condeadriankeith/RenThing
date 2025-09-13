// Simple import test to verify our AI components can be imported correctly
import { renAIService } from '@/ren-ai/services/ren-ai-service';

describe('AI Component Imports', () => {
  it('should import all AI components successfully', () => {
    expect(renAIService).toBeDefined();
  });
});