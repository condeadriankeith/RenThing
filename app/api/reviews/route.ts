import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('listingId');
    const userId = searchParams.get('userId');

    if (listingId) {
      const reviews = await prisma.review.findMany({
        where: { listingId },
        include: { user: { select: { id: true, name: true } } },
      });
      return NextResponse.json(reviews);
    }

    if (userId) {
      const reviews = await prisma.review.findMany({
        where: { userId },
        include: { listing: { select: { id: true, title: true } } },
      });
      return NextResponse.json(reviews);
    }

    const reviews = await prisma.review.findMany({
      include: { user: { select: { id: true, name: true } }, listing: { select: { id: true, title: true } } },
    });
    return NextResponse.json(reviews);
  } catch (error) {
    logger.error("Reviews GET error", error as Error, { context: "reviews" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/reviews - Create new review
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { listingId, rating, comment } = body

    if (!listingId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Invalid rating or missing listingId" },
        { status: 400 }
      )
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    })

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      )
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        listingId,
        userId: session.user.id,
        status: "completed"
      }
    })

    if (!existingBooking) {
      return NextResponse.json(
        { error: "Must complete a booking before reviewing" },
        { status: 400 }
      )
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        listingId,
        userId: session.user.id
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this listing" },
        { status: 400 }
      )
    }

    const review = await prisma.review.create({
      data: {
        listingId,
        userId: session.user.id,
        rating,
        comment: comment || "",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    logger.error("Reviews POST error", error as Error, { context: "reviews" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}