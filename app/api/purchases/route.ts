import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { purchaseService } from "@/lib/purchase-service"

// POST /api/purchases - Create a new purchase
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
    const { itemType, itemId, amount, currency } = body

    if (!itemType || !amount) {
      return NextResponse.json(
        { error: "itemType and amount are required" },
        { status: 400 }
      )
    }

    const purchase = await purchaseService.createPurchase({
      userId: session.user.id,
      itemType,
      itemId,
      amount,
      currency
    })

    // If this is a badge purchase, create the badge
    if (itemType === 'badge') {
      let badgeType = ''
      let expiresAt: Date | undefined

      // Determine badge type and expiration based on item ID
      if (itemId === 'verified-badge') {
        badgeType = 'verified'
        expiresAt = new Date()
        expiresAt.setFullYear(expiresAt.getFullYear() + 1) // 1 year expiration
      } else if (itemId === 'gold-renter-status') {
        badgeType = 'gold_renter'
        expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + 1) // 1 month expiration
      } else if (itemId === 'gold-renter-status-yearly') {
        badgeType = 'gold_renter'
        expiresAt = new Date()
        expiresAt.setFullYear(expiresAt.getFullYear() + 1) // 1 year expiration
      }

      if (badgeType) {
        await purchaseService.createUserBadge({
          userId: session.user.id,
          badgeType,
          purchaseId: purchase.id,
          expiresAt
        })
      }
    }

    // If this is a voucher purchase, create the voucher
    if (itemType === 'voucher') {
      let voucherType = 'item'
      let discount = 0

      // Determine voucher type and discount based on item ID
      if (itemId === 'item-voucher-100') {
        voucherType = 'item'
        discount = 100
      } else if (itemId === 'item-voucher-200') {
        voucherType = 'item'
        discount = 200
      } else if (itemId === 'item-voucher-500') {
        voucherType = 'item'
        discount = 500
      }

      if (discount > 0) {
        await purchaseService.createVoucher({
          userId: session.user.id,
          voucherType,
          discount
        })
      }
    }

    return NextResponse.json(purchase)
  } catch (error) {
    console.error("Purchase POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}