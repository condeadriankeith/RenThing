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
import { X, Minimize, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { GeolocationProvider } from "@/contexts/geolocation-context"
import { getPageRoutes, findRouteByPath } from "@/ren-ai/services/project-map"

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
  const [serverRestartChecked, setServerRestartChecked] = useState(false)

  // Check for server restart and load chat history accordingly
  useEffect(() => {
    const checkServerRestart = async () => {
      try {
        const response = await fetch('/api/server-status');
        const serverStatus = await response.json();
        
        if (serverStatus.restarted) {
          console.log('Server was restarted, clearing chat history');
          // Clear chat history from localStorage
          localStorage.removeItem('renChatMessages');
          // Set to default welcome message
          setChatMessages([
            {
              id: "1",
              content: "Hi! I'm REN, your assistant for RenThing. How can I help you today?",
              role: "assistant",
              timestamp: new Date(),
              suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
            }
          ]);
        } else {
          // Load existing chat history from localStorage
          try {
            const savedMessages = localStorage.getItem('renChatMessages')
            if (savedMessages) {
              const parsedMessages = JSON.parse(savedMessages)
              // Convert timestamp strings back to Date objects
              const messagesWithDates = parsedMessages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }))
              setChatMessages(messagesWithDates)
            } else {
              // Set default welcome message if no history exists
              setChatMessages([
                {
                  id: "1",
                  content: "Hi! I'm REN, your assistant for RenThing. How can I help you today?",
                  role: "assistant",
                  timestamp: new Date(),
                  suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
                }
              ])
            }
          } catch (error) {
            console.error('Failed to load chat history:', error)
            // Reset to default welcome message if there's an error
            setChatMessages([
              {
                id: "1",
                content: "Hi! I'm REN, your assistant for RenThing. How can I help you today?",
                role: "assistant",
                timestamp: new Date(),
                suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
              }
            ])
          }
        }
        setServerRestartChecked(true);
      } catch (error) {
        console.error('Failed to check server status:', error)
        // Fallback to loading existing chat history
        try {
          const savedMessages = localStorage.getItem('renChatMessages')
          if (savedMessages) {
            const parsedMessages = JSON.parse(savedMessages)
            // Convert timestamp strings back to Date objects
            const messagesWithDates = parsedMessages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
            setChatMessages(messagesWithDates)
          } else {
            // Set default welcome message if no history exists
            setChatMessages([
              {
                id: "1",
                content: "Hi! I'm REN, your assistant for RenThing. How can I help you today?",
                role: "assistant",
                timestamp: new Date(),
                suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
              }
            ])
          }
        } catch (loadError) {
          console.error('Failed to load chat history:', loadError)
          // Reset to default welcome message if there's an error
          setChatMessages([
            {
              id: "1",
              content: "Hi! I'm REN, your assistant for RenThing. How can I help you today?",
              role: "assistant",
              timestamp: new Date(),
              suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
            }
          ])
        }
        setServerRestartChecked(true);
      }
    };

    checkServerRestart();
  }, [])

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    // Only save if we've already checked for server restart
    if (serverRestartChecked && chatMessages.length > 0) {
      try {
        localStorage.setItem('renChatMessages', JSON.stringify(chatMessages))
      } catch (error) {
        console.error('Failed to save chat history:', error)
      }
    }
  }, [chatMessages, serverRestartChecked])
  
  const shouldShowNav = ![
    "/auth/login",
    "/auth/register",
  ].includes(pathname)

  // Don't show REN mascot on AI demo page since it already has one
  const shouldShowRenMascot = pathname !== "/ai-demo"

  // Validate if a path exists in the project map
  const isValidPath = async (path: string): Promise<boolean> => {
    // Check exact path matches
    if (findRouteByPath(path)) {
      return true;
    }
    
    // Check dynamic paths
    if (path.startsWith('/listing/')) {
      // Validate that it has a listing ID
      const pathParts = path.split('/');
      const listingId = pathParts[2];
      if (!listingId || listingId.length === 0) {
        return false;
      }
      
      // Check if the listing actually exists in the database
      try {
        const response = await fetch(`/api/listings/${listingId}`);
        return response.ok;
      } catch (error) {
        console.error('Error checking listing existence:', error);
        return false;
      }
    }
    
    if (path.startsWith('/profile/')) {
      // Validate that it has a user ID
      const pathParts = path.split('/');
      const userId = pathParts[2];
      return userId !== undefined && userId.length > 0;
    }
    
    // Check if it's a help sub-path
    if (path.startsWith('/help/')) {
      // Get all help sub-paths from the project map
      const helpRoutes = getPageRoutes().filter(route => route.path.startsWith('/help/'));
      // Check if the specific help path exists
      return helpRoutes.some(route => route.path === path) || 
             // Also allow help sub-paths that might not be explicitly listed
             path.split('/').length <= 3; // Basic validation: /help/something
    }
    
    return false;
  }

  // Handle navigation actions from REN with path validation
  const handleRenNavigation = async (path: string) => {
    // Validate the path before navigating
    const isValid = await isValidPath(path);
    if (isValid) {
      router.push(path)
    } else {
      console.warn(`REN tried to navigate to invalid path: ${path}`)
      // Optionally show an error message to the user
    }
    // Removed automatic minimization - chat will stay open during navigation
    // setIsChatMinimized(true)
  }

  // Handle external actions from REN
  const handleRenAction = async (action: any) => {
    if (action.type === 'navigate') {
      await handleRenNavigation(action.payload.path)
    } else if (action.type === 'suggest_listing') {
      // Handle listing suggestions
      console.log("REN suggested listing:", action.payload.listingId)
      // In a real implementation, we could show a preview or notification
    } else if (action.type === 'show_listing') {
      // Navigate to the specific listing
      await handleRenNavigation(`/listing/${action.payload.listingId}`)
    }
    // Add more action types as needed
  }

  // Clear chat history
  const clearChatHistory = () => {
    const welcomeMessage = [
      {
        id: "1",
        content: "Hi! I'm REN, your assistant for RenThing. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
        suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
      }
    ]
    setChatMessages(welcomeMessage)
    // Also clear localStorage
    try {
      localStorage.removeItem('renChatMessages')
    } catch (error) {
      console.error('Failed to clear chat history from localStorage:', error)
    }
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
                onChatOpen={async () => {
                  setIsChatOpen(true)
                  setIsChatMinimized(false)
                }} 
              />
            )}
            {/* Enhanced Chat Modal with minimize functionality and improved animations */}
            <AnimatePresence>
              {isChatOpen && !isChatMinimized && (
                <motion.div 
                  className="fixed bottom-24 right-4 z-[100] pointer-events-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Updated modal container to use dynamic height */}
                  <motion.div 
                    className="bg-white rounded-2xl shadow-lg w-80 flex flex-col h-[500px] overflow-hidden border border-gray-200 pointer-events-auto"
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
                          onClick={clearChatHistory}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="h-8 w-8 text-gray-500 hover:bg-gray-100 rounded-full"
                          onClick={() => setIsChatMinimized(true)}
                        >
                          <Minimize className="h-4 w-4" />
                        </Button>
                        {/* Removed X close button as requested */}
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