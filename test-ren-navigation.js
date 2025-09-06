const { renAIService } = require('./lib/ai/ren-ai-service');

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
  console.log('Testing REN navigation to About page...');
  
  try {
    // Test message asking REN to go to the about page
    const message = "Can you take me to the about page?";
    
    console.log(`Sending message: "${message}"`);
    
    // Process the message with REN AI service
    const response = await renAIService.processMessage(message, mockContext);
    
    console.log('REN Response:', response);
    
    if (response.action && response.action.type === 'navigate') {
      console.log('✅ REN correctly identified navigation request');
      console.log('Navigation path:', response.action.payload.path);
    } else {
      console.log('❌ REN did not identify navigation request');
      console.log('Response text:', response.text);
    }
  } catch (error) {
    console.error('Error testing REN navigation:', error);
  }
}

// Run the test
testRenNavigation();