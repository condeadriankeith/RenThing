import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { purchaseService } from "@/lib/purchase-service"

// POST /api/vouchers - Create a new voucher
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
    const { voucherType, discount, expiresAt } = body

    if (!voucherType || !discount) {
      return NextResponse.json(
        { error: "voucherType and discount are required" },
        { status: 400 }
      )
    }

    const voucher = await purchaseService.createVoucher({
      userId: session.user.id,
      voucherType,
      discount,
      expiresAt
    })

    return NextResponse.json(voucher)
  } catch (error) {
    console.error("Voucher POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}