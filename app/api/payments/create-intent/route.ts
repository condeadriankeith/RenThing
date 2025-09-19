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

    const { listingId, startDate, endDate } = await request.json();

    // Validate input
    if (!listingId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Fetch listing
    // const listing = await prisma.listing.findUnique({
    //   where: { id: listingId }
    // });

    // For now, return mock listing
    const listing = {
      id: listingId,
      price: 100,
      title: "Mock Listing"
    };

    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Calculate total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalPrice = listing.price * diffDays;

    // Create payment intent
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(totalPrice * 100), // Convert to cents
    //   currency: 'usd',
    //   metadata: {
    //     userId: session.user.id,
    //     listingId,
    //     startDate,
    //     endDate
    //   }
    // });

    // For now, return mock payment intent
    const paymentIntent = {
      client_secret: "mock_client_secret"
    };

    // Create booking
    // const booking = await prisma.booking.create({
    //   data: {
    //     startDate: new Date(startDate),
    //     endDate: new Date(endDate),
    //     totalPrice,
    //     userId: session.user.id,
    //     listingId,
    //   }
    // });

    // For now, return mock booking
    const booking = {
      id: "mock-booking-id"
    };

    logger.info("Payment intent created", { 
      paymentIntentId: paymentIntent.client_secret?.substring(0, 10),
      bookingId: booking.id 
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      bookingId: booking.id
    });
  } catch (error) {
    logger.error("Payment intent creation error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}