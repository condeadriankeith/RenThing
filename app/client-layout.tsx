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
import { RenModal } from "@/components/ai/ren-modal"
import { useState, useEffect } from "react"
import { GeolocationProvider } from "@/contexts/geolocation-context"
import { getPageRoutes, findRouteByPath } from "@/ren-ai/services/project-map"

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
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
        }
        setServerRestartChecked(true);
      } catch (error) {
        console.error('Failed to check server status:', error)
        setServerRestartChecked(true);
      }
    };

    checkServerRestart();
  }, [])

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
              <RenModal onAction={handleRenAction} />
            )}
          </ThemeProvider>
        </GeolocationProvider>
      </SessionProvider>
    </HydrationErrorBoundary>
  )
}