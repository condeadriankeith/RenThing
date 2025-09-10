import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { purchaseService } from "@/lib/purchase-service"

// GET /api/users/{id}/purchases - Get user's purchase history
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    const userId = params.id

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      )
    }

    // Check if user is authorized to view these purchases
    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const purchases = await purchaseService.getUserPurchases(userId)
    return NextResponse.json(purchases)
  } catch (error) {
    console.error("User purchases GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}