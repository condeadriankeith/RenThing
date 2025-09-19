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
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Fetch booking
    // const booking = await prisma.booking.findUnique({
    //   where: { id },
    //   include: {
    //     user: { select: { name: true, email: true } },
    //     listing: { 
    //       select: { 
    //         title: true, 
    //         description: true,
    //         price: true,
    //         location: true,
    //         images: true,
    //         owner: { select: { name: true, email: true } } 
    //       } 
    //     }
    //   }
    // });

    // For now, return mock booking
    const booking = {
      id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 86400000), // 1 day later
      totalPrice: 100,
      status: "pending",
      userId: session.user.id,
      listingId: "mock-listing-id",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to view this booking
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    return NextResponse.json({ booking });
  } catch (error) {
    logger.error("Booking fetch error", { error });
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
    const { status } = await request.json();

    // Fetch booking
    // const booking = await prisma.booking.findUnique({
    //   where: { id }
    // });

    // For now, assume booking exists
    const booking = {
      id,
      userId: session.user.id
    };

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    // Check if user is authorized to update this booking
    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Update booking
    // const updatedBooking = await prisma.booking.update({
    //   where: { id },
    //   data: { status },
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

    // For now, return mock updated booking
    const updatedBooking = {
      ...booking,
      status,
      updatedAt: new Date()
    };

    logger.info("Booking updated", { bookingId: id, status });
    
    return NextResponse.json({ booking: updatedBooking });
  } catch (error) {
    logger.error("Booking update error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}