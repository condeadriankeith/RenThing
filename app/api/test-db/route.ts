import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Test database connection by counting users
    const userCount = await prisma.user.count();
    
    // Get database URL from environment
    const databaseUrl = process.env.DATABASE_URL;
    
    return NextResponse.json({
      success: true,
      userCount,
      databaseUrl: databaseUrl ? databaseUrl.substring(0, 50) + "..." : "Not set",
      message: "Database connection successful"
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Database connection failed"
    }, { status: 500 });
  }
}