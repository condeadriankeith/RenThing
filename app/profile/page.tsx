"use client"

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { SpinnerLoader } from "@/components/ui/spinner-loader"

export default function MyProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (!session?.user?.id) {
      // Not authenticated, redirect to login
      router.push("/auth/login?from=/profile")
      return
    }

    // Redirect to the user's profile page
    router.push(`/profile/${session.user.id}`)
  }, [session, status, router])

  if (status === "loading" || !session?.user?.id) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <SpinnerLoader size="lg" className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return null
}