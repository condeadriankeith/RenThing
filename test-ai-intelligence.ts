import { renAIService } from './ren-ai/services/ren-ai-service';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function testAIIntelligence() {
  console.log('Testing REN AI intelligence fix...');
  
  // Test cases
  const testCases = [
    {
      message: "Hello",
      context: {
        userId: "test-user-1",
        sessionId: "test-session-1"
      }
    },
    {
      message: "I'm looking for a camera to rent for my vacation next week",
      context: {
        userId: "test-user-2",
        sessionId: "test-session-2"
      }
    },
    {
      message: "I want to list my power tools for rent",
      context: {
        userId: "test-user-3",
        sessionId: "test-session-3"
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log('\n--- Test Case ---');
      console.log('Message:', testCase.message);
      console.log('User ID:', testCase.context.userId);
      
      const response = await renAIService.processMessage(testCase.message, testCase.context);
      console.log('Response:', JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
}

testAIIntelligence();