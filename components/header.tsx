"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Menu, User, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { data: session, status } = useSession()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const isLoading = status === "loading"
  const isAuthenticated = !!session?.user

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80 sticky top-0 z-30">
      <div className="container mx-auto px-2 sm:px-4 py-3 flex items-center">
        <div className="flex-shrink-0 w-48">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">RenThing</h1>
          </Link>
        </div>

        {/* Desktop Navigation - Centered */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-8">
          <Link href="/browse" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 text-base font-medium">
            Browse
          </Link>
          {isAuthenticated && (
            <>
              <Link href="/my-bookings" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 text-base font-medium">
                My Bookings
              </Link>
              <Link href="/list-item" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 text-base font-medium">
                List Item
              </Link>
            </>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex flex-shrink-0 w-48 justify-end">
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{session.user?.email}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {session.user?.name || "User"}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/my-bookings">My Bookings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/list-item">List Item</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild size="sm">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          aria-label="Toggle navigation"
        >
          <Menu className="h-7 w-7 text-blue-600" />
        </button>

        {/* Mobile Navigation */}
        {mobileNavOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-t px-4 py-3 space-y-2">
            <Link href="/browse" className="block text-gray-700 dark:text-gray-200 py-2" onClick={() => setMobileNavOpen(false)}>
              Browse
            </Link>
            {isAuthenticated && (
              <>
                <Link href="/my-bookings" className="block text-gray-700 dark:text-gray-200 py-2" onClick={() => setMobileNavOpen(false)}>
                  My Bookings
                </Link>
                <Link href="/list-item" className="block text-gray-700 dark:text-gray-200 py-2" onClick={() => setMobileNavOpen(false)}>
                  List Item
                </Link>
              </>
            )}
            <div className="pt-2 space-y-2">
              {isLoading ? (
                <div className="h-8 w-full bg-gray-200 rounded animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/my-bookings" onClick={() => setMobileNavOpen(false)}>My Bookings</Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/list-item" onClick={() => setMobileNavOpen(false)}>List Item</Link>
                  </Button>
                  <Button variant="destructive" className="w-full justify-start" onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full" onClick={() => setMobileNavOpen(false)}>
                    <Link href="/auth/login">Login</Link>
                  </Button>
                  <Button asChild className="w-full" onClick={() => setMobileNavOpen(false)}>
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}