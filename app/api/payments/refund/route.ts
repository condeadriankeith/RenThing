import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { paymentService } from "@/lib/payment-service"

// POST /api/payments/refund - Process a refund
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { transactionId, amount, reason } = await request.json()

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID is required" },
        { status: 400 }
      )
    }

    const result = await paymentService.createRefund(
      transactionId,
      amount,
      reason
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing refund:', error)
    return NextResponse.json(
      { error: "Failed to process refund" },
      { status: 500 }
    )
  }
}