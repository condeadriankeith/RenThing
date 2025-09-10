import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { purchaseService } from "@/lib/purchase-service"

// GET /api/users/{id}/badges - Get user's active badges
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

    // Check if user is authorized to view these badges
    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const badges = await purchaseService.getUserBadges(userId)
    return NextResponse.json(badges)
  } catch (error) {
    console.error("User badges GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST /api/users/{id}/badges - Create a new user badge
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

    // Check if user is authorized to create this badge
    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { badgeType, purchaseId, expiresAt } = body

    if (!badgeType) {
      return NextResponse.json(
        { error: "badgeType is required" },
        { status: 400 }
      )
    }

    const badge = await purchaseService.createUserBadge({
      userId,
      badgeType,
      purchaseId,
      expiresAt
    })

    return NextResponse.json(badge)
  } catch (error) {
    console.error("User badges POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}