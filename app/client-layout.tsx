"use client"

import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import PageTransitionLoader from "@/components/PageTransitionLoader"
import Header from "@/components/header"
import HydrationErrorBoundary from "@/components/hydration-error-boundary"
import BrowserExtensionCleanup from "@/components/browser-extension-cleanup"
import { useEffect, useState } from "react"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  const shouldShowNav = ![
    "/auth/login",
    "/auth/register",
  ].includes(pathname)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div suppressHydrationWarning>
        <main>{children}</main>
      </div>
    )
  }

  return (
    <HydrationErrorBoundary>
      <BrowserExtensionCleanup />
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PageTransitionLoader />
          {shouldShowNav && <Header />}
          <main className={shouldShowNav ? "flex-grow" : ""}>{children}</main>
          <Toaster />
          <SpeedInsights />
        </ThemeProvider>
      </SessionProvider>
    </HydrationErrorBoundary>
  )
}
