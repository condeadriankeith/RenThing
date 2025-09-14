import { NextRequest, NextResponse } from "next/server"
import { edgeConfigDB } from "@/lib/edge-config/edge-config-db"



// GET /api/listings/csv - Get listings from CSV data
export async function GET(request: NextRequest) {
  try {
    // Fetch listings from Edge Config
    const listings = await edgeConfigDB.findMany("listing")
    
    // Process listings to match the expected format
    const processedListings = listings.map((listing: any) => {
      return {
        ...listing,
        price: parseFloat(listing.price) || 0,
        images: typeof listing.images === "string" ? JSON.parse(listing.images || "[]") : listing.images || [],
        features: typeof listing.features === "string" ? JSON.parse(listing.features || "[]") : listing.features || [],
        averageRating: 0,
        reviewCount: 0,
        createdAt: listing.createdAt || new Date().toISOString(),
        updatedAt: listing.updatedAt || new Date().toISOString()
      }
    })
    
    return NextResponse.json({
      listings: processedListings,
      pagination: {
        page: 1,
        limit: processedListings.length,
        total: processedListings.length,
        totalPages: 1,
      },
    })
  } catch (error) {
    console.error("Listings Edge Config GET error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}