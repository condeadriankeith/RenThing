import { NextRequest, NextResponse } from 'next/server'
import { searchService } from '@/lib/search-service'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const query = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.getAll('category')
    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined
    const location = searchParams.getAll('location')
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined
    const available = searchParams.get('available') ? searchParams.get('available') === 'true' : undefined
    const features = searchParams.getAll('features')
    const sortField = searchParams.get('sortField') as any
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | undefined
    const lat = searchParams.get('lat') ? parseFloat(searchParams.get('lat')!) : undefined
    const lng = searchParams.get('lng') ? parseFloat(searchParams.get('lng')!) : undefined
    const radius = searchParams.get('radius') ? parseFloat(searchParams.get('radius')!) : undefined

    const searchOptions = {
      query,
      filters: {
        ...(category.length > 0 && { category }),
        ...(priceMin !== undefined && priceMax !== undefined && { priceRange: [priceMin, priceMax] as [number, number] }),
        ...(location.length > 0 && { location }),
        ...(rating !== undefined && { rating }),
        ...(available !== undefined && { available }),
        ...(features.length > 0 && { features }),
      },
      sort: sortField && sortOrder ? { field: sortField, order: sortOrder } : undefined,
      pagination: { page, limit },
      geo: lat && lng && radius ? { lat, lng, radius } : undefined,
    }

    const results = await searchService.search(searchOptions)

    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search listings' },
      { status: 500 }
    )
  }
}