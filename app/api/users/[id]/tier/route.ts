import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { userTierService } from "@/lib/user-tier-service"

// GET /api/users/{id}/tier - Get user's current tier and progress
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

    // Check if user is authorized to view this tier info
    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userTier = await userTierService.getUserTier(userId)
    
    if (!userTier) {
      return NextResponse.json(
        { error: "User tier not found" },
        { status: 404 }
      )
    }

    const benefits = userTierService.getTierBenefits(userTier.tier)

    return NextResponse.json({
      userTier,
      benefits
    })
  } catch (error) {
    console.error("User tier GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}