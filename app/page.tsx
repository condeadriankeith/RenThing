"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, ShoppingBag, Calendar, MessageCircle, Menu, MapPin } from "lucide-react"

export default function HomePage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">


      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white mb-6 hero-text">
            Rent <span className="aurora-text-mask">Anything</span>, Anytime
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Your one-stop marketplace for rentals and services. From equipment to experiences, find what you need or offer what you have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/browse">Start Browsing</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-white dark:bg-gray-800" asChild>
              <Link href="/list-item">List Your Item</Link>
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto mt-12 mb-16 bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex-1 relative">
              <input type="text" placeholder="What are you looking for?" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700" />
              <i className="fas fa-search absolute right-4 top-4 text-gray-400"></i>
            </div>
            <div className="relative">
              <input type="text" placeholder="Location" className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700" />
              <i className="fas fa-map-marker-alt absolute right-4 top-4 text-gray-400"></i>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
              Search
            </button>
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

        {/* How It Works */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl my-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Simple steps to rent or list items on our platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="feature-card bg-white dark:bg-gray-700 rounded-xl p-8 text-center transition-all hover:shadow-lg">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Find or List</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Browse our marketplace or easily list your own items for rent with our simple form.
                </p>
              </div>

              {/* Step 2 */}
              <div className="feature-card bg-white dark:bg-gray-700 rounded-xl p-8 text-center transition-all hover:shadow-lg">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-green-600 dark:text-green-400 font-bold text-2xl">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Connect & Book</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Message the owner, agree on terms, and book your rental with our secure system.
                </p>
              </div>

              {/* Step 3 */}
              <div className="feature-card bg-white dark:bg-gray-700 rounded-xl p-8 text-center transition-all hover:shadow-lg">
                <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-purple-600 dark:text-purple-400 font-bold text-2xl">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Enjoy & Return</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Use the item as agreed, then return it and leave a review for future users.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">What Our Users Say</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Trusted by thousands of renters and owners worldwide
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="testimonial-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                    <img src="https://randomuser.me/api/portraits/women/43.jpg" alt="Sarah J." className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Sarah J.</h4>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "I've rented camera equipment multiple times for my photography projects. The process is so easy and the owners are always professional. Saved me thousands in equipment costs!"
                </p>
              </div>

              {/* Testimonial 2 */}
              <div className="testimonial-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael T." className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Michael T.</h4>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "As a small business owner, renting tools and equipment through RenThing has been a game-changer. I can get what I need when I need it without the upfront investment."
                </p>
              </div>

              {/* Testimonial 3 */}
              <div className="testimonial-card bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-4">
                    <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Lisa M." className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">Lisa M.</h4>
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "I list my designer dresses on RenThing and it's been amazing! I've made back the cost of several dresses and met wonderful people in the process. The platform is so user-friendly."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white rounded-2xl">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Rental Revolution?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Whether you're looking to rent or list items, we've got you covered.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link href="/auth/register">Sign Up to Rent</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-2 border-white text-white hover:bg-blue-700 hover:text-white" asChild>
                <Link href="/list-item">List Your Items</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
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
                <p className="text-gray-400">The best place to rent items from your community.</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Browse</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/browse" className="hover:text-white">Browse Items</Link></li>
                  <li><Link href="/list-item" className="hover:text-white">List Item</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                  <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/about" className="hover:text-white">About</Link></li>
                  <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2025 RenThing. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
