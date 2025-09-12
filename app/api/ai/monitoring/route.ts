import { NextResponse } from 'next/server';
import { renMonitoringService } from '@/ren-ai/services/ren-monitoring-service';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/ai/monitoring/scan
 * 
 * Scan the codebase for potential issues
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - issues?: Array - The detected issues
 * - error?: string - Error message if unsuccessful
 */
export async function POST() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Scan the codebase for issues
    const issues = await renMonitoringService.scanCodebase();
    
    // Return successful response
    return NextResponse.json({
      success: true,
      issues
    });
    
  } catch (error) {
    console.error('Monitoring Scan API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to scan codebase' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/monitoring/report
 * 
 * Generate a platform health report
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - report?: object - The health report
 * - error?: string - Error message if unsuccessful
 */
export async function GET() {
  try {
    // Check if user is admin
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Generate a platform health report
    const report = await renMonitoringService.generateHealthReport();
    
    // Return successful response
    return NextResponse.json({
      success: true,
      report
    });
    
  } catch (error) {
    console.error('Monitoring Report API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate health report' 
      },
      { status: 500 }
    );
  }
}