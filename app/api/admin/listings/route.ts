import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin/listings - Get all listings (admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const listings = await prisma.listing.findMany({
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(listings)
  } catch (error) {
    console.error("Admin Listings GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/admin/listings/[id] - Update listing (admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('id')

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { title, description, price, location, category, status } = body

    const updatedListing = await prisma.listing.update({
      where: { id: listingId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(price && { price }),
        ...(location && { location }),
        ...(category && { category }),
        ...(status && { status }),
      },
      include: {
        owner: { select: { id: true, name: true, email: true } },
      },
    })

    return NextResponse.json(updatedListing)
  } catch (error) {
    console.error("Admin Listings PUT error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/listings/[id] - Delete listing (admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('id')

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      )
    }

    await prisma.listing.delete({
      where: { id: listingId },
    })

    return NextResponse.json({ message: "Listing deleted successfully" })
  } catch (error) {
    console.error("Admin Listings DELETE error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}