"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ShoppingBag, Calendar, MessageCircle, Menu } from "lucide-react"

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">


      {/* Hero Section */}
      <main className="container mx-auto px-2 sm:px-4 py-10 sm:py-16">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">Rent Anything, Book Everything</h2>
          <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Your one-stop marketplace for rentals and services. From equipment to experiences, find what you need or offer what you have.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4" asChild>
              <Link href="/browse">Start Browsing</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-transparent" asChild>
              <Link href="/list-item">List Your Item</Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <Card className="text-center">
            <CardHeader>
              <Search className="h-10 w-10 sm:h-12 sm:w-12 text-blue-600 mx-auto mb-3 sm:mb-4" />
              <CardTitle className="text-base sm:text-lg">Smart Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs sm:text-sm">
                Find exactly what you need with our intelligent search and filtering system.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 mx-auto mb-3 sm:mb-4" />
              <CardTitle className="text-base sm:text-lg">Easy Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-xs sm:text-sm">Schedule rentals and services with our intuitive booking calendar.</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Real-time Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Connect instantly with providers through our built-in messaging system.</CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <ShoppingBag className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Secure Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Multiple payment options with secure processing and buyer protection.</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to get started?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join thousands of users already renting and booking through RenThing.
          </p>
          <Button size="lg" className="text-lg px-8" asChild>
            <Link href="/auth/register">Create Your Account</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Image 
                  src="/RenThing_LOGO.svg" 
                  alt="RenThing" 
                  width={32} 
                  height={32} 
                  className="h-8 w-auto"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
                <span className="text-xl font-bold text-white">RenThing</span>
              </div>
              <p className="text-gray-400">The marketplace for everything you need, when you need it.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/browse" className="hover:text-white">
                    Browse Items
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="hover:text-white">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/list-item" className="hover:text-white">
                    List Item
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white">
                    Safety
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 RenThing. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
