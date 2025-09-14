import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

// Check if NEXTAUTH_SECRET is configured
if (!process.env.NEXTAUTH_SECRET) {
  console.error("NEXTAUTH_SECRET is not configured in environment variables");
}

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

    // Check if NEXTAUTH_SECRET is configured
    const secret = process.env.NEXTAUTH_SECRET;
    if (!secret) {
      logger.error("NEXTAUTH_SECRET is not configured");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      )
    }

    // Find user by email using Prisma
    const user = await prisma.user.findUnique({
      where: { email }
    })

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
      secret,
      { expiresIn: '7d' }
    )

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user

    logger.info("Mobile user login successful", {
      userId: user.id, 
      email: user.email, 
      role: user.role
    })

    return NextResponse.json({
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    logger.error("Mobile login error", error as Error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}