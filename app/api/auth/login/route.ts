import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { edgeConfigDB } from "@/lib/edge-config/edge-config-db"
import { logger } from "@/lib/logger"

// POST /api/auth/login - Mobile-compatible login endpoint
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    // Find user by email
    const allUsers = await edgeConfigDB.findMany<{id: string, email: string, name: string, password: string, role: string, createdAt: string}>("user")
    const user = allUsers.find(u => u.email === email)

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only-please-change-in-production",
      { expiresIn: '7d' }
    )

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    logger.info("Mobile user login successful", {
      details: { userId: user.id, email: user.email, role: user.role }
    })

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    logger.error("Mobile login error", error as Error, { context: "mobile-auth" })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}