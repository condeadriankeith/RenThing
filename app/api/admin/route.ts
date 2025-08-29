import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/admin - Get admin dashboard data (e.g., user count, listing count, recent activities)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userCount = await prisma.user.count()
    const listingCount = await prisma.listing.count()
    const bookingCount = await prisma.booking.count()
    const transactionCount = await prisma.transaction.count()

    // Fetch some recent activities (e.g., latest bookings, new users)
    const recentBookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { name: true } },
        listing: { select: { title: true } },
      },
    })

    const newUsers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true },
    })

    return NextResponse.json({
      userCount,
      listingCount,
      bookingCount,
      transactionCount,
      recentBookings,
      newUsers,
    })
  } catch (error) {
    console.error("Admin GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}