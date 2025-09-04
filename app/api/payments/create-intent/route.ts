import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { paymentService } from "@/lib/payment-service"

// POST /api/payments/create-intent - Create payment intent for booking
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { bookingId, paymentMethod = 'mock' } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId is required" },
        { status: 400 }
      )
    }

    const booking = await prisma!.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: true,
        user: {
          select: {
            email: true,
            name: true,
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    if (booking.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    if (booking.status !== "confirmed") {
      return NextResponse.json(
        { error: "Booking must be confirmed before payment" },
        { status: 400 }
      )
    }

    // Calculate total amount
    const totalAmount = booking.totalPrice || booking.listing.price

    // Create a mock payment intent
    const paymentData = {
      id: `mock_${Date.now()}`,
      amount: totalAmount,
      currency: 'PHP',
      status: 'requires_payment_method',
      client_secret: `mock_secret_${Date.now()}`,
    }

    // Create transaction record
    const transaction = await paymentService.createTransaction({
      bookingId,
      amount: totalAmount,
      currency: 'PHP',
      paymentMethod,
      userId: session.user.id,
    })

    return NextResponse.json({
      paymentIntent: paymentData,
      transaction,
    })
  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}