"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpinnerLoader } from "@/components/ui/spinner-loader"
import { WishlistButton } from "@/components/wishlist-button"
import { ShareButton } from "@/components/share-button"
import { ContactOwnerChat } from "@/components/contact-owner-chat-fixed"
import { 
  Star, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  MessageCircle, 
  User,
  ArrowLeft,
  Heart,
  Clock,
  Settings
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email?: string
  avatar: string | null
  joinedAt: string
  stats: {
    totalListings: number
    totalCompletedBookings: number
    averageRating: number
    totalReviews: number
  }
  listings: Array<{
    id: string
    title: string
    description: string
    price: number
    location: string
    images: string[]
    features: string[]
    createdAt: string
    averageRating: number
    reviewCount: number
    reviews: Array<{
      rating: number
      comment: string
      user: {
        id: string
        name: string
        avatar: string | null
      }
      createdAt: string
    }>
  }>
  reviews: Array<{
    rating: number
    comment: string
    listing: {
      id: string
      title: string
    }
    createdAt: string
  }>
}

export default function UserProfilePage() {
  const params = useParams()
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const userId = params.id as string
  const isOwnProfile = session?.user?.id === userId

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch profile')
        }
        const data = await response.json()
        setProfile(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    if (userId) {
      fetchProfile()
    }
  }, [userId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <SpinnerLoader size="lg" className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'The profile you\'re looking for doesn\'t exist.'}</p>
          <Button asChild>
            <Link href="/browse">Back to Browse</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/browse">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Browse
          </Link>
        </Button>

        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">
                  {profile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {profile.name}
                    </h1>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(profile.joinedAt).toLocaleDateString('en-US', { 
                          month: 'long', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                      {profile.stats.averageRating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{profile.stats.averageRating}</span>
                          <span>({profile.stats.totalReviews} reviews)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!isOwnProfile && (
                      <ContactOwnerChat
                        ownerId={profile.id}
                        ownerName={profile.name}
                        listingId=""
                        variant="outline"
                        size="sm"
                      />
                    )}
                    {isOwnProfile && (
                      <Button asChild variant="outline" size="sm">
                        <Link href="/profile/settings">
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{profile.stats.totalListings}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {profile.stats.totalListings === 1 ? 'Listing' : 'Listings'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{profile.stats.totalCompletedBookings}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {profile.stats.totalCompletedBookings === 1 ? 'Booking' : 'Bookings'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {profile.stats.averageRating > 0 ? profile.stats.averageRating : '—'}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="listings">
              Listings ({profile.stats.totalListings})
            </TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({profile.stats.totalReviews})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-6">
            {profile.listings.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No listings yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isOwnProfile ? "Start by listing your first item!" : "This user hasn't listed any items yet."}
                  </p>
                  {isOwnProfile && (
                    <Button asChild className="mt-4">
                      <Link href="/list-item">List Your First Item</Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.listings.map((listing) => (
                  <Card key={listing.id} className="group hover:shadow-lg transition-shadow">
                    <Link href={`/listing/${listing.id}`}>
                      <div className="relative">
                        <img
                          src={listing.images[0] || "/placeholder.svg"}
                          alt={listing.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <WishlistButton 
                            listingId={listing.id} 
                            variant="ghost" 
                            size="sm" 
                          />
                          <ShareButton
                            listingId={listing.id}
                            listingTitle={listing.title}
                            listingPrice={listing.price}
                            listingImage={listing.images[0]}
                            variant="ghost"
                            size="sm"
                            className="bg-white/80 hover:bg-white h-8 w-8 p-0"
                          />
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{listing.averageRating.toFixed(1)}</span>
                            <span className="text-sm text-gray-500">({listing.reviewCount})</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {listing.location}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-blue-600">
                              ₱{listing.price.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">/day</span>
                          </div>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="space-y-6">
            {profile.reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isOwnProfile ? "Reviews from your bookings will appear here." : "This user hasn't left any reviews yet."}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {profile.reviews.map((review, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <Link 
                            href={`/listing/${review.listing.id}`}
                            className="text-lg font-semibold text-blue-600 hover:text-blue-700"
                          >
                            {review.listing.title}
                          </Link>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm text-gray-500 ml-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}