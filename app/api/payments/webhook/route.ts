import { NextRequest, NextResponse } from "next/server"
import { paymentService } from "@/lib/payment-service"

// POST /api/payments/webhook - Handle payment webhooks
export async function POST(request: NextRequest) {
  const body = await request.text()

  let event
  try {
    event = JSON.parse(body)
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle mock payment events
  if (event.event === "payment.succeeded") {
    await paymentService.handleWebhook(event)
  }

  return NextResponse.json({ received: true })
}