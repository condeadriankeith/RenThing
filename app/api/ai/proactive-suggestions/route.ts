import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { renAIService } from "@/ren-ai/services/ren-ai-service"

// POST /api/ai/proactive-suggestions - Get proactive suggestions for user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { context } = body

    if (!context) {
      return NextResponse.json(
        { error: "context is required" },
        { status: 400 }
      )
    }

    const suggestions = await renAIService.getProactiveSuggestions(session.user.id, context)
    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Proactive suggestions POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}