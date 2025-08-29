import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { searchService } from '@/lib/search-service'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user is admin (optional - you can implement admin role checking)
    // For now, any authenticated user can trigger sync

    await searchService.syncDatabase()

    return NextResponse.json({
      success: true,
      message: 'Search index synced successfully',
    })
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to sync search index' },
      { status: 500 }
    )
  }
}