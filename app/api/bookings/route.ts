import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { emailTriggers } from "@/lib/email-triggers"
import { AvailabilityService } from "@/lib/availability-service"
import { logger } from "@/lib/logger"

// GET /api/bookings - Get user's bookings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }
}

// PUT /api/bookings/[id] - Update booking status (e.g., cancel)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const bookingId = searchParams.get('id')

    if (!bookingId) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { status, reason } = body

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        listing: true,
      },
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    // Only owner or renter can update booking status
    if (booking.userId !== session.user.id && booking.listing.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
    })

    if (status === 'cancelled') {
      await emailTriggers.onBookingCancelled(booking.id, reason)
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    logger.error("Bookings PUT error", error as Error, { context: "bookings" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where = {
      ...(status ? { status } : {}),
      OR: [
        { userId: session.user.id },
        { listing: { ownerId: session.user.id } }
      ]
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        listing: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        transaction: true,
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    logger.error("Bookings GET error", error as Error, { context: "bookings" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/bookings - Create new booking
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
    const { listingId, startDate, endDate } = body

    if (!listingId || !startDate || !endDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const start = new Date(startDate)
    const end = new Date(endDate)

    if (start >= end) {
      return NextResponse.json(
        { error: "Invalid date range" },
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

    if (listing.ownerId === session.user.id) {
      return NextResponse.json(
        { error: "Cannot book your own listing" },
        { status: 400 }
      )
    }

    // Check if listing is available for the requested dates using the AvailabilityService
    const isAvailable = await AvailabilityService.isDateRangeAvailable(
      listingId,
      start,
      end
    )

    if (!isAvailable) {
      return NextResponse.json(
        { error: "Listing not available for selected dates" },
        { status: 400 }
      )
    }

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    const totalPrice = listing.price * days

    const booking = await prisma.booking.create({
      data: {
        listingId,
        userId: session.user.id,
        startDate: start,
        endDate: end,
        totalPrice,
        status: "pending",
      },
      include: {
        listing: {
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    })

    await emailTriggers.onBookingCreated(booking.id)

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error("Bookings POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}