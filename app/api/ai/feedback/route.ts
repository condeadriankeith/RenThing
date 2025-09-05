import { NextResponse } from 'next/server';
import { renFeedbackService } from '@/lib/ai/ren-feedback-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/ai/feedback
 * 
 * Submit feedback for an AI interaction
 * 
 * Request Body:
 * - messageId: string - The ID of the message being rated
 * - rating: number - Rating from 1-5
 * - comment?: string - Optional feedback comment
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - feedback?: any - The saved feedback record
 * - error?: string - Error message if unsuccessful
 */

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Parse request body
    const { messageId, rating, comment } = await req.json();
    
    // Validate input
    if (!messageId || rating === undefined) {
      return NextResponse.json(
        { success: false, error: 'Message ID and rating are required' },
        { status: 400 }
      );
    }
    
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }
    
    // Save feedback
    const feedback = await renFeedbackService.logFeedback({
      userId: session?.user?.id,
      messageId: messageId,
      rating: rating,
      comment: comment,
      timestamp: new Date()
    });
    
    // Return successful response
    return NextResponse.json({
      success: true,
      feedback
    });
    
  } catch (error) {
    console.error('AI Feedback API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to submit feedback' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/feedback/stats
 * 
 * Get feedback statistics for AI improvement
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - stats?: any - Feedback statistics
 * - error?: string - Error message if unsuccessful
 */

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (optional - could be public or restricted)
    // For now, we'll allow access to authenticated users
    
    // Get feedback statistics
    const stats = await renFeedbackService.getFeedbackStats();
    
    // Return successful response
    return NextResponse.json({
      success: true,
      stats
    });
    
  } catch (error) {
    console.error('AI Feedback Stats API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch feedback statistics' 
      },
      { status: 500 }
    );
  }
}