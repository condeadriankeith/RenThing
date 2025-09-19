import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Fetch transactions
    // const transactions = await prisma.transaction.findMany({
    //   where: { 
    //     OR: [
    //       { booking: { userId: session.user.id } },
    //       { booking: { listing: { ownerId: session.user.id } } }
    //     ]
    //   },
    //   include: {
    //     booking: {
    //       include: {
    //         listing: { select: { title: true } },
    //         user: { select: { name: true } }
    //       }
    //     }
    //   },
    //   orderBy: { createdAt: 'desc' },
    //   skip: (page - 1) * limit,
    //   take: limit
    // });

    // For now, return mock transactions
    const transactions: any[] = [];

    // Get total count
    // const total = await prisma.transaction.count({
    //   where: { 
    //     OR: [
    //       { booking: { userId: session.user.id } },
    //       { booking: { listing: { ownerId: session.user.id } } }
    //     ]
    //   }
    // });
    const total = 0;

    return NextResponse.json({
      transactions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error("Transactions fetch error", { error });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { bookingId, amount, currency, paymentMethod } = body;

    if (!bookingId || !amount || !currency || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // const booking = await prisma.booking.findUnique({
    //   where: { id: bookingId },
    //   include: {
    //     user: true,
    //     listing: true
    //   }
    // })

    // For now, return mock booking
    const booking: any = {
      id: bookingId,
      userId: session.user.id,
      status: "confirmed"
    }

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

    // const existingTransaction = await prisma.transaction.findFirst({
    //   where: { bookingId }
    // })

    // For now, assume no existing transaction
    const existingTransaction = null

    if (existingTransaction) {
      return NextResponse.json(
        { error: "Transaction already exists for this booking" },
        { status: 400 }
      )
    }

    // const transaction = await prisma.transaction.create({
    //   data: {
    //     bookingId,
    //     amount,
    //     currency,
    //     paymentMethod,
    //     status: "pending",
    //   },
    //   include: {
    //     booking: {
    //       include: {
    //         listing: {
    //           select: {
    //             id: true,
    //             title: true,
    //             price: true,
    //           }
    //         },
    //         user: {
    //           select: {
    //             id: true,
    //             name: true,
    //             email: true,
    //           }
    //         }
    //       }
    //     }
    //   }
    // })

    // For now, return mock transaction
    const transaction: any = {
      id: "mock-transaction-id",
      bookingId,
      amount,
      currency,
      paymentMethod,
      status: "pending",
    }

    return NextResponse.json(transaction, { status: 201 })
  } catch (error) {
    console.error("Transactions POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}