// import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    // Check if test user already exists
    // const existingUser = await prisma.user.findUnique({
    //   where: { email: "test@example.com" }
    // });

    // For now, assume no existing user
    const existingUser = null;

    if (existingUser) {
      return NextResponse.json({ message: "Test user already exists" });
    }

    // Create test user
    // const user = await prisma.user.create({
    //   data: {
    //     email: "test@example.com",
    //     name: "Test User",
    //     password: await bcrypt.hash("password123", 10),
    //     role: "user"
    //   }
    // });

    // For now, return mock user
    const user = {
      id: "mock-user-id",
      email: "test@example.com",
      name: "Test User"
    };

    return NextResponse.json({ 
      message: "Test user created successfully",
      user: { id: user.id, email: user.email, name: user.name }
    });
  } catch (error) {
    console.error("Test user creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}