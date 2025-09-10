import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET /api/users/[id]/achievements - Get user achievements
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

    // Check if this is the user's own profile
    const isOwnProfile = session?.user?.id === userId

    // If not own profile, only show public achievements
    const achievements = await prisma.achievement.findMany({
      where: {
        userId: userId,
        ...(isOwnProfile ? {} : {
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } }
          ]
        })
      },
      orderBy: {
        earnedAt: 'desc'
      }
    })

    return NextResponse.json(achievements)

  } catch (error) {
    console.error("Error fetching user achievements:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}