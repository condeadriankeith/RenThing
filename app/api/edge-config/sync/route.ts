import { NextRequest, NextResponse } from "next/server";
import { edgeConfigSyncService } from "@/lib/edge-config/sync-service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/edge-config/sync - Sync all models from Prisma to Edge Config
export async function POST(request: NextRequest) {
  try {
    // Check if user is admin (optional security measure)
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    console.log('[EdgeConfigSync API] Starting manual synchronization...');
    
    // Perform synchronization
    await edgeConfigSyncService.syncAllModels();
    
    console.log('[EdgeConfigSync API] Manual synchronization completed');
    
    return NextResponse.json({ 
      success: true, 
      message: "Edge Config synchronization completed successfully" 
    });
  } catch (error) {
    console.error('[EdgeConfigSync API] Synchronization failed:', error);
    return NextResponse.json(
      { 
        error: "Synchronization failed", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// GET /api/edge-config/sync - Check Edge Config status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized. Admin access required." },
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "Edge Config service is available",
      models: [
        'listing',
        'user',
        'review',
        'booking'
      ]
    });
  } catch (error) {
    console.error('[EdgeConfigSync API] Status check failed:', error);
    return NextResponse.json(
      { 
        error: "Status check failed", 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}