"use client"

import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import PageTransitionLoader from "@/components/PageTransitionLoader"
import Header from "@/components/header"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const shouldShowNav = ![
    "/auth/login",
    "/auth/register",
  ].includes(pathname)

  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <PageTransitionLoader />
        {shouldShowNav && <Header />}
        <main className={shouldShowNav ? "flex-grow" : ""}>{children}</main>
        <Toaster />
        <SpeedInsights />
      </ThemeProvider>
    </SessionProvider>
  )

}
