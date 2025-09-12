import { NextResponse } from 'next/server';
import { renMonitoringService } from '@/ren-ai/services/ren-monitoring-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/ai/proactive
 * 
 * Check for proactive notifications for the user
 * 
 * Request Body:
 * - userId: string - The user ID
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - notification?: object - The proactive notification
 * - error?: string - Error message if unsuccessful
 */

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Parse request body
    const { userId } = await req.json();
    
    // Validate input
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    // Check if user is authorized
    if (session?.user?.id !== userId && session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Check for proactive notifications
    const notification = await renMonitoringService.checkForProactiveNotifications(userId);
    
    // Return successful response
    return NextResponse.json({
      success: true,
      notification
    });
    
  } catch (error) {
    console.error('Proactive Notification API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to check for proactive notifications' 
      },
      { status: 500 }
    );
  }
}