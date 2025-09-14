import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Check if NEXTAUTH_SECRET is configured
if (!process.env.NEXTAUTH_SECRET) {
  console.error("NEXTAUTH_SECRET is not configured in environment variables");
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }