import { renAIService } from './ren-ai/services/ren-ai-service';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

// Mock AI context
const mockContext = {
  sessionId: 'test-session',
  conversationHistory: [],
  userPreferences: {
    language: 'en',
    currency: 'PHP'
  }
};

async function testRenNavigation() {
  console.log('Testing REN navigation capabilities...');
  
  const testCases = [
    {
      message: "Can you take me to the about page?",
      expectedAction: 'navigate',
      expectedPath: '/about'
    },
    {
      message: "Take me to the browse page",
      expectedAction: 'navigate',
      expectedPath: '/browse'
    },
    {
      message: "Go to my profile",
      expectedAction: 'navigate',
      expectedPath: '/profile'
    },
    {
      message: "Show me a camera listing",
      expectedAction: 'suggest_listing',
      expectedListingId: 'cam-001'
    }
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n--- Testing: "${testCase.message}" ---`);
      
      // Process the message with REN AI service
      const response = await renAIService.processMessage(testCase.message, mockContext);
      
      console.log('REN Response:', JSON.stringify(response, null, 2));
      
      if (response.action && response.action.type === testCase.expectedAction) {
        console.log(`✅ REN correctly identified ${testCase.expectedAction} request`);
        if (testCase.expectedPath) {
          if (response.action.payload && response.action.payload.path === testCase.expectedPath) {
            console.log(`✅ REN correctly identified path: ${testCase.expectedPath}`);
          } else {
            console.log(`❌ REN identified wrong path. Expected: ${testCase.expectedPath}, Got: ${response.action.payload?.path}`);
          }
        } else if (testCase.expectedListingId) {
          if (response.action.payload && response.action.payload.listingId === testCase.expectedListingId) {
            console.log(`✅ REN correctly identified listing ID: ${testCase.expectedListingId}`);
          } else {
            console.log(`❌ REN identified wrong listing ID. Expected: ${testCase.expectedListingId}, Got: ${response.action.payload?.listingId}`);
          }
        }
      } else {
        console.log(`❌ REN did not identify ${testCase.expectedAction} request`);
        console.log('Response text:', response.text);
      }
    } catch (error) {
      console.error('Error testing REN navigation:', error);
    }
  }
}

// Run the test
testRenNavigation();