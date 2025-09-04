import { useState, useCallback } from 'react';
import { renAIService, type AIContext, type AIResponse } from '@/lib/ai/ren-ai-service';

/**
 * useAI Hook
 * 
 * A custom hook for integrating AI functionality into components
 * 
 * Returns:
 * - sendMessage: Function to send a message to the AI
 * - recommendations: Array of recommended listings
 * - loading: Boolean indicating if an operation is in progress
 * - error: Error message if an operation failed
 */

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string, context?: AIContext): Promise<AIResponse | null> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await renAIService.processMessage(message, context || {});
      return response;
    } catch (err) {
      console.error('AI Error:', err);
      setError('Failed to get AI response');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const recommendations = await renAIService.getRecommendations(userId);
      return recommendations;
    } catch (err) {
      console.error('Recommendations Error:', err);
      setError('Failed to get recommendations');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sendMessage,
    getRecommendations,
    loading,
    error
  };
}