import { renAIService } from './ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const prisma = new PrismaClient();

async function testLongTermMemory() {
  console.log('Testing long-term memory implementation...');
  
  try {
    // Create a test user first
    const testUser = await prisma.user.upsert({
      where: { email: 'memorytest@example.com' },
      update: {},
      create: {
        email: 'memorytest@example.com',
        name: 'Memory Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
    
    console.log('Test user created/updated:', testUser.id);
    
    // Test saving conversation history
    console.log('Saving conversation history...');
    await renAIService['saveConversationHistory'](
      testUser.id,
      'test-session-1',
      'Hello REN, how can you help me today?',
      'Hello! I\'m REN, your rental marketplace assistant. I can help you find items to rent, list your own items, manage bookings, and more. How can I assist you today?'
    );
    
    // Save another interaction
    await renAIService['saveConversationHistory'](
      testUser.id,
      'test-session-1',
      'I\'m looking for a camera to rent for my trip next week.',
      'Great! I can help you find a camera for your trip. Could you tell me what type of camera you\'re looking for and what features are important to you?'
    );
    
    // Test retrieving conversation history
    console.log('Retrieving conversation history...');
    const history = await renAIService['getConversationHistory'](
      testUser.id,
      'test-session-1',
      5
    );
    
    console.log('Retrieved conversation history:');
    history.forEach((msg, index) => {
      console.log(`${index + 1}. ${msg.role}: ${msg.content}`);
    });
    
    // Test enhancing context with memory
    console.log('Testing context enhancement with memory...');
    const enhancedContext = await renAIService['enhanceContextWithMemory']({
      userId: testUser.id,
      sessionId: 'test-session-1'
    });
    
    console.log('Enhanced context has conversation history:', 
      !!enhancedContext.conversationHistory && enhancedContext.conversationHistory.length > 0);
    
    if (enhancedContext.conversationHistory) {
      console.log('Conversation history length:', enhancedContext.conversationHistory.length);
    }
    
    console.log('Long-term memory test completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLongTermMemory();