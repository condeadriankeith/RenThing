import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

// Check if NEXTAUTH_SECRET is configured
if (!process.env.NEXTAUTH_SECRET) {
  console.error("NEXTAUTH_SECRET is not configured in environment variables");
}

// GET /api/auth/me - Get current user for mobile
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      )
    }

    // Check if NEXTAUTH_SECRET is configured
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      logger.error("NEXTAUTH_SECRET is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    const token = authHeader.split(' ')[1]

    try {
      const decoded = jwt.verify(token, secret) as { userId: string; email: string; role?: string }

      // Get fresh user data from database
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        )
      }

      return NextResponse.json(user)
    } catch (jwtError) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }
  } catch (error) {
    logger.error("Mobile auth me error", error as Error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}