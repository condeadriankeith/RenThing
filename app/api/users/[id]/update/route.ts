import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// PUT /api/users/[id]/update - Update user profile
export async function PUT(
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
    if (session?.user?.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { 
      bio, 
      location, 
      socialLinks, 
      theme, 
      background 
    } = body

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(bio !== undefined && { bio }),
        ...(location !== undefined && { location }),
        ...(socialLinks !== undefined && { socialLinks: JSON.stringify(socialLinks) }),
        ...(theme !== undefined && { theme }),
        ...(background !== undefined && { background })
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        location: true,
        socialLinks: true,
        responseTime: true,
        isVerified: true,
        theme: true,
        background: true,
        createdAt: true
      }
    })

    return NextResponse.json(updatedUser)

  } catch (error) {
    console.error("Error updating user profile:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}