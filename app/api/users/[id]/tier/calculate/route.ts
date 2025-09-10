import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { userTierService } from "@/lib/user-tier-service"

// POST /api/users/{id}/tier/calculate - Calculate and update user tier based on activity
export async function POST(
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

    // Check if user is authorized to update this tier info
    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const updatedUserTier = await userTierService.updateUserTier(userId)
    const benefits = userTierService.getTierBenefits(updatedUserTier.tier)

    return NextResponse.json({
      userTier: updatedUserTier,
      benefits
    })
  } catch (error) {
    console.error("User tier calculation POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}