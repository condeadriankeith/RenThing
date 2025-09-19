import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import { prisma } from '@/lib/prisma';
import { logger } from "@/lib/logger";

interface RouteParams {
  id: string;
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
    const { rating, comment } = await request.json();

    // Fetch review
    // const review = await prisma.review.findUnique({
    //   where: { id }
    // });

    // For now, return mock review
    const review: any = {
      id,
      userId: session.user.id,
      rating: 5
    };

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to update this review
    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update review
    // const updatedReview = await prisma.review.update({
    //   where: { id },
    //   data: {
    //     rating: rating ? parseInt(rating) : undefined,
    //     comment
    //   },
    //   include: {
    //     user: { select: { name: true, avatar: true } },
    //     listing: { select: { title: true } }
    //   }
    // });

    // For now, return mock updated review
    const updatedReview = {
      ...review,
      rating: rating ? parseInt(rating) : review.rating,
      comment,
      updatedAt: new Date()
    };

    logger.info("Review updated", { reviewId: id });
    
    return NextResponse.json({ review: updatedReview });
  } catch (error) {
    logger.error("Review update error", { error });
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

    // Fetch review
    // const review = await prisma.review.findUnique({
    //   where: { id }
    // });

    // For now, return mock review
    const review: any = {
      id,
      userId: session.user.id
    };

    if (!review) {
      return NextResponse.json(
        { error: "Review not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to delete this review
    if (review.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Delete review
    // await prisma.review.delete({
    //   where: { id }
    // });

    logger.info("Review deleted", { reviewId: id });
    
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    logger.error("Review deletion error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}