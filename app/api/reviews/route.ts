import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { listingId, rating, comment } = await request.json();

    // Validate input
    if (!listingId || !rating) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user has booked this listing
    // const booking = await prisma.booking.findFirst({
    //   where: {
    //     userId: session.user.id,
    //     listingId,
    //     status: "confirmed"
    //   }
    // });

    // For now, assume user has booked
    const booking = {
      id: "mock-booking-id"
    };

    if (!booking) {
      return NextResponse.json(
        { error: "You must book this listing before reviewing it" },
        { status: 400 }
      );
    }

    // Check if user has already reviewed this listing
    // const existingReview = await prisma.review.findUnique({
    //   where: {
    //     userId_listingId: {
    //       userId: session.user.id,
    //       listingId
    //     }
    //   }
    // });

    // For now, assume no existing review
    const existingReview = null;

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this listing" },
        { status: 400 }
      );
    }

    // Create review
    // const review = await prisma.review.create({
    //   data: {
    //     rating: parseInt(rating),
    //     comment,
    //     userId: session.user.id,
    //     listingId,
    //   },
    //   include: {
    //     user: { select: { name: true, avatar: true } },
    //     listing: { select: { title: true } }
    //   }
    // });

    // For now, return mock review
    const review = {
      id: "mock-review-id",
      rating: parseInt(rating),
      comment,
      userId: session.user.id,
      listingId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    logger.info("Review created", { reviewId: review.id });
    
    return NextResponse.json({ review });
  } catch (error) {
    logger.error("Review creation error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}