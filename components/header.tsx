"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Menu, User, LogOut, X, Search, Calendar, MessageCircle, Heart, Plus, List, ShoppingBag } from "lucide-react"
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
      <div className="container mx-auto px-2 sm:px-4 py-3 flex items-center justify-between">
        <div className="flex-shrink-0">
          <Link href="/" className="flex items-center space-x-2">
            <div className="relative h-7 sm:h-8 w-auto">
              <Image 
                src="/RenThing_Logo.png" 
                alt="RenThing" 
                width={32} 
                height={32} 
                className="h-7 sm:h-8 w-auto"
                priority
              />
            </div>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white">RenThing</h1>
          </Link>
        </div>

        {/* Desktop Navigation - Simplified with Menu Button */}
        <nav className="hidden lg:flex flex-1 items-center justify-center">
          {/* Navigation items are now in a dropdown menu */}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex flex-shrink-0 items-center space-x-2">
          {isLoading ? (
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          ) : isAuthenticated ? (
            <>
              {/* Navigation Menu Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                    <List className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/browse" className="flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      Browse
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-bookings" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/inbox" className="flex items-center">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Inbox
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/list-item" className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      List Item
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/scrape" className="flex items-center">
                      <Search className="h-4 w-4 mr-2" />
                      Import Listing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shop" className="flex items-center">
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Shop
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* User Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
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
                    <Link href="/profile">My Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my-bookings">My Bookings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wishlist">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/inbox">Inbox</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/list-item">List Item</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/scrape">Import Listing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shop">Shop</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Button variant="outline" asChild size="sm" className="text-sm px-3">
                <Link href="/auth/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="text-sm px-3">
                <Link href="/auth/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button - Positioned on the right */}
        <div className="lg:hidden">
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Mobile Navigation Overlay */}
        {mobileNavOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm z-40" 
              onClick={() => setMobileNavOpen(false)}
            />
            
            {/* Mobile Menu */}
            <div className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Menu</h2>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                
                {/* Navigation Links */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-1">
                    <Link 
                      href="/browse" 
                      className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                      onClick={() => setMobileNavOpen(false)}
                    >
                      <Search className="h-5 w-5 mr-3 text-gray-500" />
                      Browse
                    </Link>
                    
                    {isAuthenticated && (
                      <>
                        <Link 
                          href="/my-bookings" 
                          className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                          onClick={() => setMobileNavOpen(false)}
                        >
                          <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                          My Bookings
                        </Link>
                        <Link 
                          href="/inbox" 
                          className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                          onClick={() => setMobileNavOpen(false)}
                        >
                          <MessageCircle className="h-5 w-5 mr-3 text-gray-500" />
                          Inbox
                        </Link>
                        <Link 
                          href="/wishlist" 
                          className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                          onClick={() => setMobileNavOpen(false)}
                        >
                          <Heart className="h-5 w-5 mr-3 text-gray-500" />
                          Wishlist
                        </Link>
                        <Link 
                          href="/list-item" 
                          className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                          onClick={() => setMobileNavOpen(false)}
                        >
                          <Plus className="h-5 w-5 mr-3 text-gray-500" />
                          List Item
                        </Link>
                        <Link 
                          href="/scrape" 
                          className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                          onClick={() => setMobileNavOpen(false)}
                        >
                          <Search className="h-5 w-5 mr-3 text-gray-500" />
                          Import Listing
                        </Link>
                        <Link 
                          href="/shop" 
                          className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                          onClick={() => setMobileNavOpen(false)}
                        >
                          <ShoppingBag className="h-5 w-5 mr-3 text-gray-500" />
                          Shop
                        </Link>
                        <Link 
                          href="/profile" 
                          className="flex items-center px-3 py-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" 
                          onClick={() => setMobileNavOpen(false)}
                        >
                          <User className="h-5 w-5 mr-3 text-gray-500" />
                          My Profile
                        </Link>
                      </>
                    )}
                  </div>
                </div>
                
                {/* Auth Section */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  {isLoading ? (
                    <div className="h-12 w-full bg-gray-200 rounded-lg animate-pulse" />
                  ) : isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Signed in as: {session.user?.email}
                      </div>
                      <Button 
                        variant="destructive" 
                        className="w-full justify-start" 
                        onClick={() => {
                          signOut()
                          setMobileNavOpen(false)
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Button 
                        asChild 
                        variant="outline" 
                        className="w-full" 
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <Link href="/auth/login">Login</Link>
                      </Button>
                      <Button 
                        asChild 
                        className="w-full" 
                        onClick={() => setMobileNavOpen(false)}
                      >
                        <Link href="/auth/register">Sign Up</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  )
}