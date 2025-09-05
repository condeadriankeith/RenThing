import { NextResponse } from 'next/server';
import { renAIService } from '@/lib/ai/ren-ai-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/ai/suggestions
 * 
 * Get contextual suggestions for the AI chat interface
 * 
 * Request Body:
 * - context: AIContext - Context information about the user
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - suggestions?: string[] - Array of contextual suggestions
 * - error?: string - Error message if unsuccessful
 */

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Parse request body
    const { context } = await req.json();
    
    // Prepare context with user information
    const aiContext = {
      ...context,
      userId: session?.user?.id || undefined,
      userPreferences: {
        language: 'en',
        currency: 'PHP',
        ...(context?.userPreferences || {})
      }
    };
    
    // Get contextual suggestions from AI service
    const suggestions = await renAIService.generateContextualSuggestions(aiContext);
    
    // Return successful response
    return NextResponse.json({
      success: true,
      suggestions
    });
    
  } catch (error) {
    console.error('AI Suggestions API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate contextual suggestions' 
      },
      { status: 500 }
    );
  }
}