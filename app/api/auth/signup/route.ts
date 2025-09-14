import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { edgeConfigDB } from "@/lib/edge-config/edge-config-db"
import { emailTriggers } from "@/lib/email-triggers"
import rateLimit from "@/lib/rate-limit"
import { logger } from "@/lib/logger"
import { analytics } from "@/lib/analytics"

const ADMIN_EMAILS = [
  "adriankeithconde@gmail.com",
  "roelslumauagjr@gmail.com",
];

const signupLimiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 10, // 10 requests per 60 seconds
})

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    try {
      await signupLimiter.check(null, 5, ip);
    } catch {
      logger.warn("Too many signup requests", { context: "signup", details: { ip } });
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const { email, name, password } = await request.json();

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Basic email format validation
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const allUsers = await edgeConfigDB.findMany<{id: string, email: string}>("user");
    const existingUser = allUsers.find(u => u.email === email);

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = ADMIN_EMAILS.includes(email) ? "ADMIN" : "USER";

    const user = await edgeConfigDB.create("user", {
      id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      email,
      name,
      password: hashedPassword,
      role: userRole,
    });

    await emailTriggers.onUserWelcome(user.id);
    analytics.track("user_signup", { userId: user.id, email: user.email });

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    logger.error("Signup error", error as Error, { context: "signup" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
