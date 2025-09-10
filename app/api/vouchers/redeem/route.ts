import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { purchaseService } from "@/lib/purchase-service"

// POST /api/vouchers/redeem - Redeem a voucher code
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json(
        { error: "Voucher code is required" },
        { status: 400 }
      )
    }

    const result = await purchaseService.redeemVoucher(code, session.user.id)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Voucher redemption POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}