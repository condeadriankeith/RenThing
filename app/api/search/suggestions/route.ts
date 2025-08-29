import { NextRequest, NextResponse } from 'next/server'
import { searchService } from '@/lib/search-service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''

    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }

    const suggestions = await searchService.getSuggestions(query)

    return NextResponse.json({
      success: true,
      data: suggestions,
    })
  } catch (error) {
    console.error('Suggestions error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get suggestions' },
      { status: 500 }
    )
  }
}