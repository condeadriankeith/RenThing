import { NextResponse } from 'next/server';
import { renAIService } from '@/lib/ai/ren-ai-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * GET /api/ai/recommendations
 * 
 * Get personalized recommendations for the current user
 * 
 * Query Parameters:
 * - limit: number - Maximum number of recommendations to return (default: 5)
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - recommendations?: Listing[] - Array of recommended listings
 * - error?: string - Error message if unsuccessful
 */

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get limit from query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '5');
    
    // Get recommendations from AI service
    const recommendations = await renAIService.getRecommendations(session.user.id);
    
    // Limit results
    const limitedRecommendations = recommendations.slice(0, limit);
    
    // Return successful response
    return NextResponse.json({
      success: true,
      recommendations: limitedRecommendations
    });
    
  } catch (error) {
    console.error('AI Recommendations API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get recommendations' 
      },
      { status: 500 }
    );
  }
}