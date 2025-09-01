import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        listing: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedWishlist = wishlistItems.map(item => ({
      id: item.id,
      listingId: item.listingId,
      addedAt: item.createdAt,
      listing: {
        id: item.listing.id,
        title: item.listing.title,
        description: item.listing.description,
        price: item.listing.price,
        location: item.listing.location,
        images: JSON.parse(item.listing.images),
        features: JSON.parse(item.listing.features),
        owner: item.listing.owner,
        createdAt: item.listing.createdAt
      }
    }))

    return NextResponse.json({
      wishlist: formattedWishlist,
      count: formattedWishlist.length
    })

  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { listingId } = await request.json()

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      )
    }

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    })

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      )
    }

    // Check if already in wishlist
    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId: listingId
        }
      }
    })

    if (existingWishlistItem) {
      return NextResponse.json(
        { error: "Item already in wishlist" },
        { status: 409 }
      )
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userId: session.user.id,
        listingId: listingId
      },
      include: {
        listing: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      message: "Item added to wishlist",
      wishlistItem: {
        id: wishlistItem.id,
        listingId: wishlistItem.listingId,
        addedAt: wishlistItem.createdAt,
        listing: {
          id: wishlistItem.listing.id,
          title: wishlistItem.listing.title,
          description: wishlistItem.listing.description,
          price: wishlistItem.listing.price,
          location: wishlistItem.listing.location,
          images: JSON.parse(wishlistItem.listing.images),
          features: JSON.parse(wishlistItem.listing.features),
          owner: wishlistItem.listing.owner,
          createdAt: wishlistItem.listing.createdAt
        }
      }
    }, { status: 201 })

  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE /api/wishlist - Remove item from wishlist
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const listingId = searchParams.get('listingId')

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      )
    }

    // Check if item exists in wishlist
    const existingWishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId: listingId
        }
      }
    })

    if (!existingWishlistItem) {
      return NextResponse.json(
        { error: "Item not found in wishlist" },
        { status: 404 }
      )
    }

    // Remove from wishlist
    await prisma.wishlist.delete({
      where: {
        id: existingWishlistItem.id
      }
    })

    return NextResponse.json({
      message: "Item removed from wishlist"
    })

  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}