import { renAIService } from './ren-ai/services/ren-ai-service';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function testPersonalityTraits() {
  console.log('Testing personality traits implementation...');
  
  try {
    // Test getting personality traits for a user
    const userId = "test-user";
    const traits = await renAIService['getUserPersonalityTraits'](userId);
    console.log('Current personality traits:', traits);
    
    // Test updating personality traits
    console.log('Updating personality traits based on interaction...');
    await renAIService['updateUserPersonalityTraits'](userId, 'helpful_response', {
      tone: 'positive',
      confidence: 0.8,
      indicators: ['thank you', 'helpful']
    });
    
    // Check updated traits
    const updatedTraits = await renAIService['getUserPersonalityTraits'](userId);
    console.log('Updated personality traits:', updatedTraits);
    
    console.log('Personality traits test completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

testPersonalityTraits();