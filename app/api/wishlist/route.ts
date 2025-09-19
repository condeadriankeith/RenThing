import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Fetch wishlist items
    // const wishlistItems = await prisma.wishlist.findMany({
    //   where: { userId: session.user.id },
    //   include: {
    //     listing: {
    //       include: {
    //         owner: { select: { name: true, avatar: true } },
    //         reviews: { select: { rating: true } }
    //       }
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' }
    // });

    // For now, return mock wishlist items
    const wishlistItems: any[] = [];

    // Calculate average ratings
    // const wishlistItemsWithRatings = wishlistItems.map(item => {
    //   const totalRating = item.listing.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    //   const averageRating = item.listing.reviews.length > 0 ? totalRating / item.listing.reviews.length : 0;
    //   
    //   return {
    //     ...item,
    //     listing: {
    //       ...item.listing,
    //       averageRating,
    //       reviewCount: item.listing.reviews.length
    //     }
    //   };
    // });

    const wishlistItemsWithRatings = wishlistItems;

    return NextResponse.json({ wishlist: wishlistItemsWithRatings });
  } catch (error) {
    logger.error("Wishlist fetch error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { listingId } = await request.json();

    // Validate input
    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Check if listing exists
    // const listing = await prisma.listing.findUnique({
    //   where: { id: listingId }
    // });

    // For now, assume listing exists
    const listing = {
      id: listingId
    };

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if already in wishlist
    // const existingWishlistItem = await prisma.wishlist.findUnique({
    //   where: {
    //     userId_listingId: {
    //       userId: session.user.id,
    //       listingId
    //     }
    //   }
    // });

    // For now, assume not in wishlist
    const existingWishlistItem = null;

    if (existingWishlistItem) {
      return NextResponse.json(
        { error: "Listing already in wishlist" },
        { status: 400 }
      );
    }

    // Add to wishlist
    // const wishlistItem = await prisma.wishlist.create({
    //   data: {
    //     userId: session.user.id,
    //     listingId,
    //   },
    //   include: {
    //     listing: {
    //       include: {
    //         owner: { select: { name: true, avatar: true } }
    //       }
    //     }
    //   }
    // });

    // For now, return mock wishlist item
    const wishlistItem = {
      id: "mock-wishlist-id",
      userId: session.user.id,
      listingId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    logger.info("Listing added to wishlist", { listingId });
    
    return NextResponse.json({ wishlistItem });
  } catch (error) {
    logger.error("Wishlist add error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');

    // Validate input
    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID is required" },
        { status: 400 }
      );
    }

    // Check if in wishlist
    // const wishlistItem = await prisma.wishlist.findUnique({
    //   where: {
    //     userId_listingId: {
    //       userId: session.user.id,
    //       listingId
    //     }
    //   }
    // });

    // For now, assume in wishlist
    const wishlistItem = {
      id: "mock-wishlist-id"
    };

    if (!wishlistItem) {
      return NextResponse.json(
        { error: "Listing not in wishlist" },
        { status: 404 }
      );
    }

    // Remove from wishlist
    // await prisma.wishlist.delete({
    //   where: {
    //     userId_listingId: {
    //       userId: session.user.id,
    //       listingId
    //     }
    //   }
    // });

    logger.info("Listing removed from wishlist", { listingId });
    
    return NextResponse.json({ message: "Listing removed from wishlist" });
  } catch (error) {
    logger.error("Wishlist remove error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}