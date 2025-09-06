import { NextResponse } from 'next/server';
import { renAIService } from '@/ren-ai/services/ren-ai-service';

export async function GET() {
  try {
    console.log('Testing Ollama integration...');
    
    // Test with a simple message
    const message = "Hello, what can you help me with?";
    const context = {
      userId: "test-user",
      sessionId: "test-session"
    };
    
    console.log('Sending message:', message);
    const response = await renAIService.processMessage(message, context);
    console.log('Response:', JSON.stringify(response, null, 2));
    
    return NextResponse.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      },
      { status: 500 }
    );
  }
}