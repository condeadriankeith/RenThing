"use client"

import { usePathname, useRouter } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import PageTransitionLoader from "@/components/PageTransitionLoader"
import Header from "@/components/header"
import HydrationErrorBoundary from "@/components/hydration-error-boundary"
import BrowserExtensionCleanup from "@/components/browser-extension-cleanup"
import { RenMascot } from "@/components/ai/ren-mascot"
import { RenChat } from "@/components/ai/ren-chat"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Minimize } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GeolocationProvider } from "@/contexts/geolocation-context"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMinimized, setIsChatMinimized] = useState(false)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  
  const shouldShowNav = ![
    "/auth/login",
    "/auth/register",
  ].includes(pathname)

  // Don't show REN mascot on AI demo page since it already has one
  const shouldShowRenMascot = pathname !== "/ai-demo"

  // Handle navigation actions from REN
  const handleRenNavigation = (path: string) => {
    router.push(path)
    // Removed automatic minimization - chat will stay open during navigation
    // setIsChatMinimized(true)
  }

  // Handle external actions from REN
  const handleRenAction = (action: any) => {
    if (action.type === 'navigate') {
      handleRenNavigation(action.payload.path)
    } else if (action.type === 'suggest_listing') {
      // Handle listing suggestions
      console.log("REN suggested listing:", action.payload.listingId)
      // In a real implementation, we could show a preview or notification
    } else if (action.type === 'show_listing') {
      // Navigate to the specific listing
      handleRenNavigation(`/listing/${action.payload.listingId}`)
    }
    // Add more action types as needed
  }

  return (
    <HydrationErrorBoundary>
      <BrowserExtensionCleanup />
      <SessionProvider>
        <GeolocationProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <PageTransitionLoader />
            {shouldShowNav && <Header />}
            <main className={shouldShowNav ? "flex-grow" : ""}>{children}</main>
            <Toaster />
            <SpeedInsights />
            {shouldShowRenMascot && (
              <RenMascot 
                variant="floating" 
                size="md" 
                position="bottom-right" 
                onChatOpen={() => {
                  setIsChatOpen(true)
                  setIsChatMinimized(false)
                }} 
              />
            )}
            {/* Enhanced Chat Modal with minimize functionality and improved animations */}
            <AnimatePresence>
              {isChatOpen && !isChatMinimized && (
                <motion.div 
                  className="fixed inset-0 z-[100] p-4 pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Updated modal container to use dynamic height */}
                  <motion.div 
                    className="bg-white rounded-2xl shadow-lg w-full max-w-md flex flex-col h-auto max-h-[80vh] overflow-hidden border border-gray-200 fixed inset-0 m-auto pointer-events-auto"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 300, 
                      damping: 30,
                      duration: 0.3 
                    }}
                  >
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Chat with REN</h3>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-full"
                          onClick={() => setIsChatMinimized(true)}
                        >
                          <Minimize className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-full"
                          onClick={() => setIsChatOpen(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    {/* Updated container to properly handle flex layout */}
                    <div className="flex-grow overflow-hidden flex flex-col">
                      <RenChat 
                        onAction={handleRenAction}
                        onMessagesChange={setChatMessages}
                        initialMessages={chatMessages}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </ThemeProvider>
        </GeolocationProvider>
      </SessionProvider>
    </HydrationErrorBoundary>
  )
}