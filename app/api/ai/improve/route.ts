import { NextResponse } from 'next/server';
import { renSelfImprovement } from '@/lib/ai/ren-self-improvement';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * POST /api/ai/improve
 * 
 * Trigger self-improvement analysis for REN
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - analysis?: any - Self-improvement analysis results
 * - error?: string - Error message if unsuccessful
 */

export async function POST(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (this should be restricted to admins only)
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }
    
    // Trigger self-improvement analysis
    const analysis = await renSelfImprovement.updateBehavior();
    
    // Return successful response
    return NextResponse.json({
      success: true,
      analysis
    });
    
  } catch (error) {
    console.error('AI Self-Improvement API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to perform self-improvement analysis' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/ai/improve/report
 * 
 * Get self-improvement report for REN
 * 
 * Response:
 * - success: boolean - Whether the request was successful
 * - report?: any - Self-improvement report
 * - error?: string - Error message if unsuccessful
 */

export async function GET(req: Request) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    // Check if user is admin (this could be restricted to admins only)
    // For now, we'll allow access to authenticated users
    
    // Get self-improvement report
    const report = await renSelfImprovement.getImprovementReport();
    
    // Return successful response
    return NextResponse.json({
      success: true,
      report
    });
    
  } catch (error) {
    console.error('AI Self-Improvement Report API Error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate self-improvement report' 
      },
      { status: 500 }
    );
  }
}