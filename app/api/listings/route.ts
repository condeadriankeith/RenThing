import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/listings - Get all listings
export async function GET(request: NextRequest) {
  try {
    // Add more detailed error logging
    console.log('Fetching listings from database...')
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search")
    const minPrice = parseFloat(searchParams.get("minPrice") || "0")
    const maxPrice = parseFloat(searchParams.get("maxPrice") || "999999")
    const location = searchParams.get("location")

    const skip = (page - 1) * limit

    const where = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { description: { contains: search, mode: "insensitive" as const } },
        ],
      }),
      ...(location && {
        location: { contains: location, mode: "insensitive" as const },
      }),
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    }

    console.log('Query parameters:', { page, limit, search, minPrice, maxPrice, location })

    const listingsData = await prisma.listing.findMany({
      where,
      skip,
      take: limit,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    console.log(`Found ${listingsData.length} listings`)

    const total = await prisma.listing.count({ where })

    const listings = listingsData.map((listing) => {
      const { reviews, ...restOfListing } = listing
      const averageRating =
        reviews.length > 0
          ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
          : 0

      return {
        ...restOfListing,
        images: JSON.parse(listing.images || "[]"),
        features: JSON.parse(listing.features || "[]"),
        averageRating,
        reviewCount: reviews.length,
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
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, price, location, images, features } = body

    if (!title || !description || !price || !location) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const newListing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseFloat(price),
        location,
        images: JSON.stringify(images || []),
        features: JSON.stringify(features || []),
        ownerId: session.user.id,
      },
    })

    return NextResponse.json(newListing, { status: 201 })
  } catch (error) {
    console.error("Listings POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
