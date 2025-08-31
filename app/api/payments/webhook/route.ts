import { NextRequest, NextResponse } from "next/server"
import { paymentService } from "@/lib/payment-service"

// POST /api/payments/webhook - Handle Xendit webhooks
export async function POST(request: NextRequest) {
  const body = await request.text()
  const xCallbackToken = request.headers.get("x-callback-token")

  if (xCallbackToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  let event
  try {
    event = JSON.parse(body)
  } catch (err: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  if (event.event === "invoice.paid") {
    const invoice = event.data
    if (!invoice?.external_id) {
      return NextResponse.json(
        { error: "External ID (bookingId) missing" },
        { status: 400 }
      )
    }

    await paymentService.handleWebhook(event)
  }

  return NextResponse.json({ received: true })
}