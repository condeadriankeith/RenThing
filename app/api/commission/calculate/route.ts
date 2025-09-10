import { NextRequest, NextResponse } from "next/server"
import { commissionService } from "@/lib/commission-service"

// POST /api/commission/calculate - Calculate total cost including commission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, durationType } = body

    if (!amount || !durationType) {
      return NextResponse.json(
        { error: "amount and durationType are required" },
        { status: 400 }
      )
    }

    const calculation = await commissionService.calculateCommission(amount, durationType)
    return NextResponse.json(calculation)
  } catch (error) {
    console.error("Commission calculation POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}