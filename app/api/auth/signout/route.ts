import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (session?.user) {
      logger.info("User signing out", {
        details: { userId: session.user.id },
      })
    }

    const response = NextResponse.json({
      success: true,
      message: "Signed out successfully",
    })

    // By setting the cookie's maxAge to -1, it will be expired immediately.
    // We set both potential cookie names to ensure signout works in all environments.
    response.cookies.set("next-auth.session-token", "", { maxAge: -1, path: "/" })
    response.cookies.set("__Secure-next-auth.session-token", "", {
      maxAge: -1,
      path: "/",
    })

    return response
  } catch (error) {
    logger.error("Signout error", error as Error, { context: "auth" })
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
