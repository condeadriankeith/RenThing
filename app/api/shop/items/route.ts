import { NextRequest, NextResponse } from "next/server"
import { purchaseService } from "@/lib/purchase-service"

// GET /api/shop/items - Get available items for purchase
export async function GET(request: NextRequest) {
  try {
    const items = await purchaseService.getAvailableItems()
    return NextResponse.json(items)
  } catch (error) {
    console.error("Shop items GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}