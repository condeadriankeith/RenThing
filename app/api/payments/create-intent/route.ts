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
    const { bookingId, paymentMethod = 'stripe' } = body

    if (!bookingId) {
      return NextResponse.json(
        { error: "bookingId is required" },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
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

    let paymentData

    if (paymentMethod === 'xendit') {
      paymentData = await paymentService.createXenditPayment(
        totalAmount,
        booking.listing.currency || 'PHP',
        bookingId,
        booking.user.email || ''
      )
    } else {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      )
    }

    // Create transaction record
    const transaction = await paymentService.createTransaction({
      bookingId,
      amount: totalAmount,
      currency: booking.listing.currency || 'PHP',
      paymentMethod,

      xenditInvoiceId: paymentMethod === 'xendit' ? paymentData.id : undefined,
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