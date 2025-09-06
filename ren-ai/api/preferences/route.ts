import { NextResponse } from 'next/server';
import { renAIService } from '@/ren-ai/services/ren-ai-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/ai/preferences
 * 
 * Get user preferences (explicit + implicit)
 * 
 * Query Parameters:
 * - userId: string - The user ID to get preferences for
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - preferences?: any - The user preferences
 * - error?: string - Error message if unsuccessful
 */

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    // Validate input
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user is authorized to get preferences
    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get user preferences
    const preferences = await renAIService.getUserPreferences(userId);
    
    // Return successful response
    return NextResponse.json({
      success: true,
      preferences
    });
    
  } catch (error) {
    console.error('AI Preferences API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch user preferences' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/ai/preferences
 * 
 * Update user's explicit preferences
 * 
 * Request Body:
 * - userId: string - The user ID to update preferences for
 * - preferences: object - The preferences to update
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - preferences?: any - The updated preferences
 * - error?: string - Error message if unsuccessful
 */

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Parse request body
    const { userId, preferences } = await req.json();
    
    // Validate input
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user is authorized to update preferences
    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Update user preferences
    const updatedPreferences = await renAIService.updateExplicitUserPreferences(userId, preferences);
    
    // Return successful response
    return NextResponse.json({
      success: true,
      preferences: updatedPreferences
    });
    
  } catch (error) {
    console.error('AI Preferences Update API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update user preferences' 
      },
      { status: 500 }
    );
  }
}