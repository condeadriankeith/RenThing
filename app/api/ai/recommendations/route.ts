import { NextResponse } from 'next/server';
import { renAIService } from '@/lib/ai/ren-ai-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/ai/recommendations
 * 
 * Get personalized recommendations for a user
 * 
 * Query Parameters:
 * - userId: string - The user ID to get recommendations for
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - recommendations?: any[] - Array of recommended listings
 * - error?: string - Error message if unsuccessful
 */

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    
    // Validate user authentication
    if (userId && session?.user?.id !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Generate recommendations
    const recommendations = await renAIService.generateRecommendations(userId || session?.user?.id || '');
    
    // Return successful response
    return NextResponse.json({
      success: true,
      recommendations
    });
    
  } catch (error) {
    console.error('AI Recommendations API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate recommendations' 
      },
      { status: 500 }
    );
  }
}