import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import { join } from "path"

// Helper function to parse CSV
function parseCSV(csv: string): any[] {
  const lines = csv.trim().split('\n')
  if (lines.length < 2) return []
  
  const headers = lines[0].split(',').map(h => h.trim())
  const rows = []
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    const row: any = {}
    
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = values[j] || ""
    }
    
    rows.push(row)
  }
  
  return rows
}

// GET /api/listings/csv - Get listings from CSV data
export async function GET(request: NextRequest) {
  try {
    // Path to the listings CSV file
    const csvPath = join(process.cwd(), 'data', 'listings.csv')
    
    // Read the CSV file
    const csvData = await fs.readFile(csvPath, 'utf8')
    
    // Parse the CSV data
    const listings = parseCSV(csvData)
    
    // Process listings to match the expected format
    const processedListings = listings.map((listing: any) => {
      // Parse JSON fields if they exist as strings
      let images = []
      let features = []
      
      try {
        if (listing.images) {
          images = JSON.parse(listing.images)
        }
      } catch (e) {
        // If parsing fails, use the value as-is or empty array
        images = listing.images ? [listing.images] : []
      }
      
      try {
        if (listing.features) {
          features = JSON.parse(listing.features)
        }
      } catch (e) {
        // If parsing fails, use the value as-is or empty array
        features = listing.features ? [listing.features] : []
      }
      
      return {
        ...listing,
        price: parseFloat(listing.price) || 0,
        images,
        features,
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
    console.error("Listings CSV GET error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}