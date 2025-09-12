"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Users, Shield, Globe, Target, Lightbulb } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About RenThing</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Connecting people through the power of sharing, making quality items accessible to everyone
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                To create a sustainable, accessible marketplace where people can share resources and build meaningful connections
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Sustainability</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Reducing waste by maximizing the utility of every item through sharing
                </p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Community</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Building trust and connections between renters and owners
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Innovation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Making quality items accessible without the burden of ownership
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
                <div className="space-y-4 text-gray-600 dark:text-gray-300">
                  <p>
                    RenThing was founded in 2025 from a simple but powerful realization: so many of the things we buy end up sitting unused, while others around us are searching for exactly those items.
                  </p>
                  <p>
                    We often noticed it in everyday life—mothers rushing to boutiques in downtown Mayfair Plaza, searching every corner for the perfect outfit for their child's event or competition. Families planning a vacation would struggle to find a car or van, unless they had immediate connections. And in those moments, we would often hear people say: "If only I had this right now, things would have been so much easier."
                  </p>
                  <p>
                    That's when it clicked: what if there was a way to access the things you need, right when you need them, without the hassle of saving up for a purchase or committing to something you'll rarely use?
                  </p>
                  <p>
                    RenThing was built with that vision in mind—not just as a platform, but as a community. A place where the things lying unused in our homes could bring joy, convenience, and opportunity to others. After all, "the happiest memories we create with the things we own can bring the same happiness to someone else when they need them most."
                  </p>
                  <p>
                    Today, RenThing connects people across communities—renters and owners—fostering trust, reducing waste, and making quality accessible to everyone. It's more than just renting; it's about sharing, connecting, and creating a more sustainable way of living.
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">10,000+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Active Users</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">50,000+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Items Listed</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">95%</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Satisfaction Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">24/7</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Support Available</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                  <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Trust & Safety</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Every transaction is backed by our verification system and support team to ensure safe, reliable exchanges.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Quality First</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We maintain high standards for listings and provide tools to ensure every item meets expectations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Transparency</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Clear pricing, honest reviews, and open communication between all community members.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-orange-100 dark:bg-orange-900 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Community Focus</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    We're building more than a marketplace – we're creating a community of sharing and support.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Whether you're looking to rent quality items or share what you own, RenThing is here to help
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8 bg-white text-blue-600 hover:bg-gray-100" asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/list-item">List Your Items</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}