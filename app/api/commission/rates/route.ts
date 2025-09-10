import { NextRequest, NextResponse } from "next/server"
import { commissionService } from "@/lib/commission-service"

// GET /api/commission/rates - Retrieve current commission rates by duration
export async function GET(request: NextRequest) {
  try {
    const rates = await commissionService.getCommissionRates()
    return NextResponse.json(rates)
  } catch (error) {
    console.error("Commission rates GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}