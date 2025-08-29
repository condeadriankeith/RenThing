import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

// GET /api/bookings/[id] - Get single booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
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
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    const isOwner = booking.listing.ownerId === session.user.id
    const isCustomer = booking.userId === session.user.id

    if (!isOwner && !isCustomer) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    return NextResponse.json(booking)
  } catch (error) {
    logger.error("Booking GET by ID error", error as Error, { context: "bookings" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT /api/bookings/[id] - Update booking status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status } = body

    if (!status || !['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        listing: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      )
    }

    const isOwner = booking.listing.ownerId === session.user.id
    const isCustomer = booking.userId === session.user.id

    if (!isOwner && !isCustomer) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    if (status === 'confirmed' && !isOwner) {
      return NextResponse.json(
        { error: "Only listing owner can confirm bookings" },
        { status: 403 }
      )
    }

    if (status === 'cancelled' && !isCustomer) {
      return NextResponse.json(
        { error: "Only customer can cancel bookings" },
        { status: 403 }
      )
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
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

    return NextResponse.json(updatedBooking)
  } catch (error) {
    logger.error("Booking PUT error", error as Error, { context: "bookings" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}