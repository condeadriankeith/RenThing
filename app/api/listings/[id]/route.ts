import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/listings/[id] - Get single listing
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params as per Next.js dynamic API requirements
    const { id } = await params;
    
    const listing = await prisma.listing.findUnique({
      where: { id: id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        },
        bookings: {
          where: {
            status: "confirmed"
          },
          select: {
            startDate: true,
            endDate: true,
          }
        }
      }
    })

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      )
    }

    const averageRating = listing.reviews.length > 0
      ? listing.reviews.reduce((sum, review) => sum + review.rating, 0) / listing.reviews.length
      : 0

    const listingWithDetails = {
      ...listing,
      images: typeof listing.images === 'string' ? JSON.parse(listing.images || "[]") : [],
      features: typeof listing.features === 'string' ? JSON.parse(listing.features || "[]") : [],
      averageRating,
      reviewCount: listing.reviews.length,
    }

    return NextResponse.json(listingWithDetails)
  } catch (error) {
    console.error("Listing GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/listings/[id] - Update listing
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Await params as per Next.js dynamic API requirements
    const { id } = await params;
    
    const body = await request.json()
    const { title, description, price, location, images, features } = body

    const existingListing = await prisma.listing.findUnique({
      where: { id: id }
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      )
    }

    if (existingListing.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const updatedListing = await prisma.listing.update({
      where: { id: id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price }),
        ...(location && { location }),
        ...(images && { images: JSON.stringify(images) }),
        ...(features && { features: JSON.stringify(features) }),
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error("Listing PUT error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/listings/[id] - Delete listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Await params as per Next.js dynamic API requirements
    const { id } = await params;
    
    const existingListing = await prisma.listing.findUnique({
      where: { id: id }
    })

    if (!existingListing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      )
    }

    if (existingListing.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    await prisma.listing.delete({
      where: { id: id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Listing DELETE error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}