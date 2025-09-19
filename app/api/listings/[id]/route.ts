import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

interface RouteParams {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = params;

    // Fetch listing
    // const listing = await prisma.listing.findUnique({
    //   where: { id },
    //   include: {
    //     owner: { 
    //       select: { 
    //         id: true, 
    //         name: true, 
    //         avatar: true,
    //         responseTime: true,
    //         isVerified: true
    //       } 
    //     },
    //     reviews: { 
    //       include: { 
    //         user: { select: { id: true, name: true, avatar: true } } 
    //       } 
    //     }
    //   }
    // });

    // For now, return mock listing
    const listing = {
      id,
      title: "Mock Listing",
      description: "Mock description",
      price: 100,
      location: "Mock Location",
      category: "Mock Category",
      priceUnit: "per day",
      images: null,
      ownerId: "mock-owner-id",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Calculate average rating
    // const totalRating = listing.reviews.reduce((sum, review) => sum + review.rating, 0);
    // const averageRating = listing.reviews.length > 0 ? totalRating / listing.reviews.length : 0;
    const averageRating = 0;

    const listingWithRating = {
      ...listing,
      averageRating,
      reviewCount: 0 // listing.reviews.length
    };

    return NextResponse.json({ listing: listingWithRating });
  } catch (error) {
    logger.error("Listing fetch error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { title, description, price, location, category, priceUnit, images, features } = await request.json();

    // Fetch listing
    // const listing = await prisma.listing.findUnique({
    //   where: { id }
    // });

    // For now, assume listing exists
    const listing: any = {
      id,
      ownerId: session.user.id,
      title: "Mock Title",
      description: "Mock Description",
      price: 100,
      location: "Mock Location",
      category: "Mock Category",
      priceUnit: "per day",
      images: null,
      features: null
    };

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to update this listing
    if (listing.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update listing
    // const updatedListing = await prisma.listing.update({
    //   where: { id },
    //   data: {
    //     ...(title && { title }),
    //     ...(description && { description }),
    //     ...(price && { price: parseFloat(price) }),
    //     ...(location && { location }),
    //     ...(category && { category }),
    //     ...(priceUnit && { priceUnit }),
    //     ...(images && { images: JSON.stringify(images) }),
    //     ...(features && { features }),
    //   },
    //   include: {
    //     owner: { select: { id: true, name: true, avatar: true } }
    //   }
    // });

    // For now, return mock updated listing
    const updatedListing = {
      ...listing,
      title: title || listing.title,
      description: description || listing.description,
      price: price ? parseFloat(price) : listing.price,
      location: location || listing.location,
      category: category || listing.category,
      priceUnit: priceUnit || listing.priceUnit,
      images: images ? JSON.stringify(images) : listing.images,
      features: features || listing.features,
      updatedAt: new Date()
    };

    logger.info("Listing updated", { listingId: id });
    
    return NextResponse.json({ listing: updatedListing });
  } catch (error) {
    logger.error("Listing update error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Fetch listing
    // const listing = await prisma.listing.findUnique({
    //   where: { id }
    // });

    // For now, assume listing exists
    const listing: any = {
      id,
      ownerId: session.user.id
    };

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete this listing
    if (listing.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete listing
    // await prisma.listing.delete({
    //   where: { id }
    // });

    logger.info("Listing deleted", { listingId: id });
    
    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    logger.error("Listing deletion error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}