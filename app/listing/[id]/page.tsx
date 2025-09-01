"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, Star, MapPin, Share, Heart, ArrowLeft } from "lucide-react"
import { BookingCalendar } from "@/components/booking-calendar"
import { ContactOwnerChat } from "@/components/contact-owner-chat-fixed"
import { SpinningLogo } from "@/components/ui/spinning-logo"
import { WishlistButton } from "@/components/wishlist-button"
import { ShareButton } from "@/components/share-button"

interface Listing {
  id: string
  title: string
  description: string
  price: number
  location: string
  images: string[]
  features: string[]
  averageRating: number
  reviewCount: number
  owner: {
    id: string
    name: string
    email: string
  }
  reviews: Array<{
    id: string
    rating: number
    comment: string
    user: {
      id: string
      name: string
    }
    createdAt: string
  }>
  createdAt: string
}

export default function ListingDetailPage() {
  const params = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch listing')
        }
        const data = await response.json()
        setListing(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchListing()
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <SpinningLogo size="xl" className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading listing...</p>
        </div>
      </div>
    )
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The listing you\'re looking for doesn\'t exist.'}</p>
          <Button asChild>
            <Link href="/browse">Back to Browse</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">


  <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/browse">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img
                src={listing.images[selectedImageIndex] || "/placeholder.svg"}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {listing.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index ? "border-blue-600" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${listing.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Listing Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge className="mb-2">listing</Badge>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{listing.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{listing.averageRating.toFixed(1)}</span>
                      <span>({listing.reviewCount} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{listing.location}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <WishlistButton listingId={listing.id} variant="outline" size="sm" />
                  <ShareButton 
                    listingId={listing.id}
                    listingTitle={listing.title}
                    listingPrice={listing.price}
                    listingImage={listing.images[0]}
                    variant="outline" 
                    size="sm" 
                  />
                </div>
              </div>

              <div className="flex items-baseline space-x-2 mb-6">
                <span className="text-4xl font-bold text-blue-600">₱{listing.price}</span>
                <span className="text-lg text-gray-600 dark:text-gray-400">per day</span>
              </div>

              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{listing.description}</p>

              <BookingCalendar listing={listing} />

              <div className="flex items-center space-x-2 text-green-600 mt-4">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span className="font-medium">Available for booking</span>
              </div>
            </div>

            <Separator />

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Meet your host</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{listing.owner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold">{listing.owner.name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{listing.averageRating.toFixed(1)}</span>
                      </div>
                      <span>{listing.reviewCount} reviews</span>
                      <span>Verified Owner</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/profile/${listing.owner.id}`}>View Profile</Link>
                    </Button>
                    <ContactOwnerChat 
                      ownerId={listing.owner.id} 
                      ownerName={listing.owner.name}
                      listingId={listing.id}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What's included</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {listing.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews ({listing.reviewCount})</h2>
          {listing.reviews && listing.reviews.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {listing.reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{review.user.name}</h4>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{review.comment}</p>
                        <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No reviews yet. Be the first to leave a review!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
