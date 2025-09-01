import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/wishlist/check?listingId=xxx - Check if listing is in user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { isInWishlist: false },
        { status: 200 }
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

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId: listingId
        }
      }
    })

    return NextResponse.json({
      isInWishlist: !!wishlistItem,
      wishlistItemId: wishlistItem?.id || null
    })

  } catch (error) {
    console.error("Error checking wishlist:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}