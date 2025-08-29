"use client"

import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import WebGLTransitionLoader from "@/components/WebGLTransitionLoader"
import Header from "@/components/header"
import { AnimationProvider } from "@/components/AnimationProvider"
import { WebGLPageTransition } from "@/components/WebGLPageTransition"

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
      <AnimationProvider enableWebGLAnimations={true}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <WebGLTransitionLoader />
          {shouldShowNav && <Header />}
          <main className={shouldShowNav ? "flex-grow" : ""}>
            <WebGLPageTransition>
              {children}
            </WebGLPageTransition>
          </main>
          <Toaster />
          <SpeedInsights />
        </ThemeProvider>
      </AnimationProvider>
    </SessionProvider>
  )

}
