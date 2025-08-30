import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { paymentService } from "@/lib/payment-service"
import { emailTriggers } from "@/lib/email-triggers"

// POST /api/payments/confirm - Confirm a payment
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { transactionId, paymentMethodId } = await request.json()

    if (!transactionId || typeof transactionId !== 'string') {
      return NextResponse.json(
        { error: "Valid transaction ID is required" },
        { status: 400 }
      )
    }

    if (paymentMethodId && typeof paymentMethodId !== 'string') {
      return NextResponse.json(
        { error: "Invalid payment method" },
        { status: 400 }
      )
    }

    try {
      const result = await paymentService.confirmPayment(
        transactionId,
        paymentMethodId
      )
      await emailTriggers.onPaymentConfirmed(result.id)
      return NextResponse.json(result)
    } catch (error) {
      console.error('Payment confirmation error:', error)
      return NextResponse.json(
        { 
          error: "Payment confirmation failed",
          details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    )
  }
}