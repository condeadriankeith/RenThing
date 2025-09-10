import { NextRequest, NextResponse } from "next/server"
import { userTierService } from "@/lib/user-tier-service"

// GET /api/tiers/benefits - Get benefits for each tier level
export async function GET(request: NextRequest) {
  try {
    const benefits = userTierService.getAllTierBenefits()
    return NextResponse.json(benefits)
  } catch (error) {
    console.error("Tier benefits GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}