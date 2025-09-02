"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SpinnerLoader } from "@/components/ui/spinner-loader"
import { WishlistButton } from "@/components/wishlist-button"
import { useWishlist } from "@/hooks/use-wishlist"
import { useDebounce } from "@/hooks/use-debounce"
import { Search, MapPin, Star, Heart, ShoppingBag } from "lucide-react"

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const { wishlist, isLoading, wishlistCount } = useWishlist()
  const [searchQuery, setSearchQuery] = useState("")
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const filteredWishlist = wishlist.filter(item =>
    item.listing.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    item.listing.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
    item.listing.location.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  )

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <SpinnerLoader size="lg" className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading your wishlist...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">Sign in to view your wishlist and save your favorite items</p>
            <Button asChild>
              <Link href="/auth/login?from=/wishlist">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Heart className="h-8 w-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            {wishlistCount} {wishlistCount === 1 ? 'item' : 'items'} saved for later
          </p>
        </div>

        {/* Search */}
        {wishlistCount > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Wishlist Content */}
        {wishlistCount === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <Heart className="h-20 w-20 text-gray-300 mx-auto mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                Start exploring our marketplace and save items you love by clicking the heart icon
              </p>
              <Button asChild size="lg">
                <Link href="/browse">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Browse Items
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Results count */}
            {searchQuery && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {filteredWishlist.length} {filteredWishlist.length === 1 ? 'result' : 'results'} 
                  {searchQuery && <span> for "{searchQuery}"</span>}
                </p>
              </div>
            )}

            {/* Wishlist Grid */}
            {filteredWishlist.length === 0 && searchQuery ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try searching with different keywords
                  </p>
                  <Button 
                    variant="ghost" 
                    onClick={() => setSearchQuery("")}
                    className="mt-4"
                  >
                    Clear search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredWishlist.map((item) => (
                  <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                    <Link href={`/listing/${item.listing.id}`}>
                      <div className="relative">
                        <img
                          src={item.listing.images[0] || "/placeholder.svg"}
                          alt={item.listing.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <WishlistButton
                          listingId={item.listing.id}
                          variant="ghost"
                          size="sm"
                          className="absolute top-2 right-2"
                        />
                        <Badge className="absolute bottom-2 left-2 bg-blue-600">
                          Saved
                        </Badge>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-1">
                          {item.listing.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">4.8</span>
                            <span className="text-sm text-gray-500">(12)</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {item.listing.location}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-blue-600">
                              ₱{item.listing.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">/day</span>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Available
                          </Badge>
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          Saved on {new Date(item.addedAt).toLocaleDateString()}
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}