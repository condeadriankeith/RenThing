import { NextResponse } from 'next/server';
import { renAIService } from '@/lib/ai/ren-ai-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/ai/chat
 * 
 * Handle AI chat messages from the frontend
 * 
 * Request Body:
 * - message: string - The user's message
 * - context: AIContext - Context information about the user
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - response?: AIResponse - The AI-generated response
 * - error?: string - Error message if unsuccessful
 */

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Parse request body
    const { message, context } = await req.json();
    
    // Validate input
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }
    
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
    
    // Process message with AI service
    const response = await renAIService.processMessage(message, aiContext);
    
    // Return successful response
    return NextResponse.json({
      success: true,
      response
    });
    
  } catch (error) {
    console.error('AI Chat API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process AI chat message' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/listing/[id]
 * 
 * Get information about a specific listing for AI recommendations
 */
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const listingInfo = await renAIService.getListingInfo(params.id);
    
    if (!listingInfo) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      listing: listingInfo
    });
    
  } catch (error) {
    console.error('AI Listing Info API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch listing information' 
      },
      { status: 500 }
    );
  }
}