const { renAIService } = require('./ren-ai/services/ren-ai-service.ts');

async function testOllama() {
  console.log('Testing Ollama integration...');
  
  // Test with a simple message
  const message = "Hello, what can you help me with?";
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

testOllama();