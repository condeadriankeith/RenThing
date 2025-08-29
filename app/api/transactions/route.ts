import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/transactions - Get user's transactions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            booking: {
              userId: session.user.id
            }
          },
          {
            booking: {
              listing: {
                ownerId: session.user.id
              }
            }
          }
        ]
      },
      include: {
        booking: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                price: true,
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
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Transactions GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/transactions - Create new transaction
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
    const { bookingId, amount, currency, paymentMethod } = body

    if (!bookingId || !amount || !currency || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
        listing: true
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

    const existingTransaction = await prisma.transaction.findFirst({
      where: { bookingId }
    })

    if (existingTransaction) {
      return NextResponse.json(
        { error: "Transaction already exists for this booking" },
        { status: 400 }
      )
    }

    const transaction = await prisma.transaction.create({
      data: {
        bookingId,
        amount,
        currency,
        paymentMethod,
        status: "pending",
      },
      include: {
        booking: {
          include: {
            listing: {
              select: {
                id: true,
                title: true,
                price: true,
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
        }
      }
    })

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Transactions POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}