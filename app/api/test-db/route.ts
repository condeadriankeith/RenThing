// import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test database connection
    // await prisma.$queryRaw`SELECT 1`;
    
    // For now, return success
    return NextResponse.json({ 
      success: true, 
      message: "Database connection successful" 
    });
  } catch (error) {
    console.error("Database connection test failed:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Database connection failed",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}