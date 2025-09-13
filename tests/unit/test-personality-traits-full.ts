import { renAIService } from './ren-ai/services/ren-ai-service';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

const prisma = new PrismaClient();

async function testPersonalityTraits() {
  console.log('Testing personality traits implementation...');
  
  try {
    // Create a test user first
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        email: 'test@example.com',
        name: 'Test User',
        password: 'testpassword',
        role: 'USER'
      }
    });
    
    console.log('Test user created/updated:', testUser.id);
    
    // Test getting personality traits for a user
    const traits = await renAIService['getUserPersonalityTraits'](testUser.id);
    console.log('Current personality traits:', traits);
    
    // Test updating personality traits
    console.log('Updating personality traits based on interaction...');
    await renAIService['updateUserPersonalityTraits'](testUser.id, 'helpful_response', {
      tone: 'positive',
      confidence: 0.8,
      indicators: ['thank you', 'helpful']
    });
    
    // Check updated traits
    const updatedTraits = await renAIService['getUserPersonalityTraits'](testUser.id);
    console.log('Updated personality traits:', updatedTraits);
    
    // Test getting personality development history
    const developmentHistory = await prisma.personalityDevelopment.findMany({
      where: { userId: testUser.id }
    });
    console.log('Personality development history:', developmentHistory.length, 'entries');
    
    console.log('Personality traits test completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPersonalityTraits();