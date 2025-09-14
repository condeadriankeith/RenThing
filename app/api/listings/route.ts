import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { edgeConfigDB } from "@/lib/edge-config/edge-config-db"

// GET /api/listings - Get all listings
export async function GET(request: NextRequest) {
  try {
    // Check if prisma is available
    if (!prisma) {
      console.error("Prisma client is not available for fetching listings")
      return NextResponse.json(
        { error: "Database connection error", details: "Prisma client is not available" },
        { status: 500 }
      )
    }
    
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

    console.log('Successfully processed listings')

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
    // Check if prisma is available
    if (!prisma) {
      console.error("Prisma client is not available for creating listings")
      return NextResponse.json(
        { error: "Database connection error", details: "Prisma client is not available" },
        { status: 500 }
      )
    }

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

    // Also create listing in Edge Config (simultaneously)
    try {
      await edgeConfigDB.create("listing", {
        id: newListing.id,
        title,
        description,
        price: parseFloat(price),
        location,
        category,
        priceUnit,
        images: images ? JSON.stringify(images) : JSON.stringify([]),
        features: features ? JSON.stringify(features) : JSON.stringify([]),
        ownerId: session.user.id,
        createdAt: newListing.createdAt.toISOString(),
        updatedAt: newListing.updatedAt.toISOString(),
      })
      console.log("Listing also created in Edge Config")
    } catch (edgeConfigError) {
      console.error("Failed to create listing in Edge Config:", edgeConfigError)
      // We don't return an error here because the main operation (Prisma) succeeded
    }

    return NextResponse.json(newListing, { status: 201 })
  } catch (error: any) {
    console.error("Listings POST error:", error)
    // Check if it's a foreign key constraint error
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "User not found", details: "The user associated with this listing does not exist" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}