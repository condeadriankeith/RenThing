import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { edgeConfigDB } from "@/lib/edge-config/edge-config-db"
import { shouldUseEdgeConfig, shouldSyncFromPrisma } from "@/lib/edge-config/config"

// GET /api/listings - Get all listings
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageParam = searchParams.get("page")
    const limitParam = searchParams.get("limit")
    const search = searchParams.get("search")
    const minPriceParam = searchParams.get("minPrice")
    const maxPriceParam = searchParams.get("maxPrice")
    const location = searchParams.get("location")

    // Parse and validate parameters
    const page = pageParam ? parseInt(pageParam) : 1
    const limit = limitParam ? parseInt(limitParam) : 10
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : 0
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : 999999

    // Input validation
    if (isNaN(page) || page < 1) {
      return NextResponse.json(
        { error: "Page must be a valid number greater than 0" },
        { status: 400 }
      )
    }

    if (isNaN(limit) || limit < 1) {
      return NextResponse.json(
        { error: "Limit must be a valid number greater than 0" },
        { status: 400 }
      )
    }

    if (isNaN(minPrice) || isNaN(maxPrice)) {
      return NextResponse.json(
        { error: "Invalid price range parameters" },
        { status: 400 }
      )
    }

    if (minPrice < 0 || maxPrice < 0) {
      return NextResponse.json(
        { error: "Price values must be non-negative" },
        { status: 400 }
      )
    }

    if (minPrice > maxPrice) {
      return NextResponse.json(
        { error: "Minimum price cannot be greater than maximum price" },
        { status: 400 }
      )
    }

    const skip = (page - 1) * limit

    // Check if we should use Edge Config for listings
    const useEdgeConfig = shouldUseEdgeConfig('listing');
    
    if (useEdgeConfig) {
      console.log('Using Edge Config for listings')
      // Use Edge Config for faster reads
      try {
        const allListings = await edgeConfigDB.findMany('listing');
        
        // Apply filters manually since Edge Config doesn't support complex queries
        let filteredListings = allListings.filter((listing: any) => {
          // Price filter
          if (listing.price < minPrice || listing.price > maxPrice) {
            return false;
          }
          
          // Search filter
          if (search) {
            const searchLower = search.toLowerCase();
            if (!listing.title.toLowerCase().includes(searchLower) && 
                !listing.description.toLowerCase().includes(searchLower)) {
              return false;
            }
          }
          
          // Location filter
          if (location && !listing.location.toLowerCase().includes(location.toLowerCase())) {
            return false;
          }
          
          return true;
        });
        
        // Apply pagination
        const total = filteredListings.length;
        const paginatedListings = filteredListings.slice(skip, skip + limit);
        
        const listings = paginatedListings.map((listing: any) => {
          return {
            ...listing,
            images: Array.isArray(listing.images) ? listing.images : 
                   (typeof listing.images === "string" ? JSON.parse(listing.images || "[]") : listing.images || []),
            features: Array.isArray(listing.features) ? listing.features : 
                     (typeof listing.features === "string" ? JSON.parse(listing.features || "[]") : listing.features || []),
            averageRating: 0, // For now, we'll set this to 0 since we're not handling reviews in this implementation
            reviewCount: 0,   // For now, we'll set this to 0 since we're not handling reviews in this implementation
          }
        })

        console.log('Successfully processed listings from Edge Config')

        return NextResponse.json({
          listings,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        })
      } catch (edgeConfigError) {
        console.error("Failed to fetch from Edge Config, falling back to Prisma:", edgeConfigError)
        // Fall back to Prisma if Edge Config fails
      }
    }
    
    // Fallback to Prisma if Edge Config is not configured or fails
    console.log('Using Prisma for listings')
    
    // Build where clause for Prisma
    const where: any = {
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    console.log('Query parameters:', { page, limit, search, minPrice, maxPrice, location })

    // Fetch listings with pagination
    const [listingsData, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.listing.count({ where })
    ])

    console.log(`Found ${listingsData.length} listings`)

    const listings = listingsData.map((listing: any) => {
      return {
        ...listing,
        images: typeof listing.images === "string" ? JSON.parse(listing.images || "[]") : listing.images || [],
        features: typeof listing.features === "string" ? JSON.parse(listing.features || "[]") : listing.features || [],
        averageRating: 0, // For now, we'll set this to 0 since we're not handling reviews in this implementation
        reviewCount: 0,   // For now, we'll set this to 0 since we're not handling reviews in this implementation
      }
    })

    console.log('Successfully processed listings from Prisma')

    return NextResponse.json({
      listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Listings GET error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      cause: error instanceof Error ? error.cause : undefined
    })
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// POST /api/listings - Create new listing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, location, images, features, category, priceUnit } = body

    if (!title || !description || !price || !location || !category || !priceUnit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate that the user exists in the database
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!userExists) {
      console.error("User not found in database:", session.user.id);
      return NextResponse.json(
        { error: "User not found", details: "The authenticated user does not exist in the database" },
        { status: 400 }
      )
    }

    console.log("Creating listing for user:", session.user.id);
    console.log("Database URL being used:", process.env.DATABASE_URL);

    // Create listing in Prisma database
    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        category,
        priceUnit,
        images: images ? JSON.stringify(images) : JSON.stringify([]),
        features: features ? JSON.stringify(features) : JSON.stringify([]),
        ownerId: session.user.id,
      }
    })

    console.log("Listing created successfully:", newListing.id);

    // Also create listing in Edge Config if configured
    const useEdgeConfig = shouldUseEdgeConfig('listing');
    if (useEdgeConfig) {
      try {
        await edgeConfigDB.create("listing", {
          id: newListing.id,
          title,
          description,
          price: parseFloat(price),
          location,
          category,
          priceUnit,
          images: images || [],
          features: features || [],
          ownerId: session.user.id,
          createdAt: newListing.createdAt.toISOString(),
          updatedAt: newListing.updatedAt.toISOString(),
        })
        console.log("Listing also created in Edge Config")
      } catch (edgeConfigError) {
        console.error("Failed to create listing in Edge Config:", edgeConfigError)
        // We don't return an error here because the main operation (Prisma) succeeded
      }
    }

    return NextResponse.json(newListing, { status: 201 })
  } catch (error: any) {
    console.error("Listings POST error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      code: error.code,
      clientVersion: error.clientVersion
    });
    
    // Check if it's a foreign key constraint error
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "User not found", details: "The user associated with this listing does not exist" },
        { status: 400 }
      )
    }
    
    // Check if it's a readonly database error
    if (error.message && error.message.includes('attempt to write a readonly database')) {
      return NextResponse.json(
        { 
          error: "Database permission error", 
          details: "The database file is readonly. Please check file permissions.",
          suggestion: "Ensure the database file has write permissions for the application."
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}