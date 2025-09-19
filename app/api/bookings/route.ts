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

    const { listingId, startDate, endDate, totalPrice } = await request.json();

    // Validate input
    if (!listingId || !startDate || !endDate || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if listing exists
    // const listing = await prisma.listing.findUnique({
    //   where: { id: listingId }
    // });

    // For now, assume listing exists
    const listing = {
      id: listingId,
      ownerId: "mock-owner-id"
    };

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if user is trying to book their own listing
    if (listing.ownerId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot book your own listing" },
        { status: 400 }
      );
    }

    // Check for booking conflicts
    // const existingBookings = await prisma.booking.findMany({
    //   where: {
    //     listingId,
    //     status: { not: "cancelled" },
    //     OR: [
    //       {
    //         startDate: { lte: new Date(endDate) },
    //         endDate: { gte: new Date(startDate) }
    //       }
    //     ]
    //   }
    // });

    // For now, assume no conflicts
    const existingBookings = [];

    if (existingBookings.length > 0) {
      return NextResponse.json(
        { error: "Listing is already booked for these dates" },
        { status: 400 }
      );
    }

    // Create booking
    // const booking = await prisma.booking.create({
    //   data: {
    //     startDate: new Date(startDate),
    //     endDate: new Date(endDate),
    //     totalPrice: parseFloat(totalPrice),
    //     userId: session.user.id,
    //     listingId,
    //   },
    //   include: {
    //     user: { select: { name: true, email: true } },
    //     listing: { 
    //       select: { 
    //         title: true, 
    //         owner: { select: { name: true, email: true } } 
    //       } 
    //     }
    //   }
    // });

    // For now, return mock booking
    const booking = {
      id: "mock-booking-id",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice: parseFloat(totalPrice),
      status: "pending",
      userId: session.user.id,
      listingId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    logger.info("Booking created", { bookingId: booking.id });
    
    return NextResponse.json({ booking });
  } catch (error) {
    logger.error("Booking creation error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
