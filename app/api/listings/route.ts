import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || '';
    const location = searchParams.get('location') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';

    // Build where clause
    // const where: any = {};
    // 
    // if (category) {
    //   where.category = { contains: category, mode: 'insensitive' };
    // }
    // 
    // if (location) {
    //   where.location = { contains: location, mode: 'insensitive' };
    // }
    // 
    // if (minPrice || maxPrice) {
    //   where.price = {};
    //   if (minPrice) where.price.gte = parseFloat(minPrice);
    //   if (maxPrice) where.price.lte = parseFloat(maxPrice);
    // }

    // Fetch listings
    // const listings = await prisma.listing.findMany({
    //   where,
    //   include: {
    //     owner: { select: { id: true, name: true, avatar: true } },
    //     reviews: { select: { rating: true } }
    //   },
    //   orderBy: { createdAt: 'desc' },
    //   skip: (page - 1) * limit,
    //   take: limit
    // });

    // For now, return mock listings
    const listings: any[] = [];

    // Calculate average ratings
    // const listingsWithRatings = listings.map(listing => {
    //   const totalRating = listing.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
    //   const averageRating = listing.reviews.length > 0 ? totalRating / listing.reviews.length : 0;
    //   
    //   return {
    //     ...listing,
    //     averageRating,
    //     reviewCount: listing.reviews.length
    //   };
    // });

    const listingsWithRatings = listings;

    // Get total count
    // const total = await prisma.listing.count({ where });
    const total = 0;

    return NextResponse.json({
      listings: listingsWithRatings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error("Listings fetch error", { error });
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

    const { title, description, price, location, category, priceUnit, images } = await request.json();

    // Validate input
    if (!title || !description || !price || !location || !category || !priceUnit) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create listing
    // const listing = await prisma.listing.create({
    //   data: {
    //     title,
    //     description,
    //     price: parseFloat(price),
    //     location,
    //     category,
    //     priceUnit,
    //     images: images ? JSON.stringify(images) : null,
    //     ownerId: session.user.id,
    //   },
    //   include: {
    //     owner: { select: { id: true, name: true, avatar: true } }
    //   }
    // });

    // For now, return mock listing
    const listing = {
      id: "mock-listing-id",
      title,
      description,
      price: parseFloat(price),
      location,
      category,
      priceUnit,
      images: images ? JSON.stringify(images) : null,
      ownerId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    logger.info("Listing created", { listingId: listing.id });
    
    return NextResponse.json({ listing });
  } catch (error) {
    logger.error("Listing creation error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}