import { renAIService } from './ren-ai/services/ren-ai-service';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function testAIFix() {
  console.log('Testing REN AI fix...');
  
  // Test with a message that will trigger OpenRouter if Ollama is not available
  const message = "I'm looking for a camera to rent for my vacation next week";
  const context = {
    userId: "test-user",
    sessionId: "test-session"
  };
  
  try {
    console.log('Sending message:', message);
    const response = await renAIService.processMessage(message, context);
    console.log('Response:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testAIFix();