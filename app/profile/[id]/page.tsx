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
import { UserBadgesDisplay } from "@/components/user-badges-display"
import { AchievementsDisplay } from "@/components/achievements-display"
import { ThemeSelector } from "@/components/theme-selector"
import { BackgroundSelector } from "@/components/background-selector"
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
  Settings,
  Edit3,
  Link as LinkIcon,
  CheckCircle,
  Award,
  Zap,
  Trash2
} from "lucide-react"

interface UserProfile {
  id: string
  name: string
  email?: string
  avatar: string | null
  bio: string | null
  location: string | null
  socialLinks: any | null
  responseTime: number | null
  isVerified: boolean
  theme: string | null
  background: string | null
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
  achievements: Array<{
    id: string
    type: string
    title: string
    description: string
    icon: string | null
    earnedAt: string
    expiresAt?: string
  }>
  badges?: Array<{
    id: string
    badgeType: string
    createdAt: string
    expiresAt?: string
  }>
  purchases?: Array<{
    id: string
    itemType: string
    itemId?: string
    amount: number
    currency: string
    createdAt: string
    status: string
  }>
}

export default function UserProfilePage() {
  const params = useParams()
  const { data: session } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingListingId, setDeletingListingId] = useState<string | null>(null)

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

  const handleThemeChange = async (theme: string) => {
    if (!isOwnProfile) return
    
    try {
      const response = await fetch(`/api/users/${userId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ theme }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update theme')
      }
      
      const updatedProfile = await response.json()
      setProfile(prev => prev ? { ...prev, theme: updatedProfile.theme } : null)
    } catch (error) {
      console.error('Error updating theme:', error)
    }
  }

  const handleBackgroundChange = async (background: string | null) => {
    if (!isOwnProfile) return
    
    try {
      const response = await fetch(`/api/users/${userId}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ background }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update background')
      }
      
      const updatedProfile = await response.json()
      setProfile(prev => prev ? { ...prev, background: updatedProfile.background } : null)
    } catch (error) {
      console.error('Error updating background:', error)
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    if (!isOwnProfile) return
    
    if (!confirm("Are you sure you want to delete this listing? This action cannot be undone.")) {
      return
    }
    
    try {
      setDeletingListingId(listingId)
      
      const response = await fetch(`/api/listings/${listingId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete listing')
      }
      
      // Remove the listing from the UI
      setProfile(prev => {
        if (!prev) return null
        return {
          ...prev,
          listings: prev.listings.filter(listing => listing.id !== listingId),
          stats: {
            ...prev.stats,
            totalListings: prev.stats.totalListings - 1
          }
        }
      })
    } catch (error) {
      console.error('Error deleting listing:', error)
      alert('Failed to delete listing. Please try again.')
    } finally {
      setDeletingListingId(null)
    }
  }

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
    <div 
      className="min-h-screen bg-gray-50 dark:bg-gray-900"
      style={{ 
        background: profile.background || undefined,
        backgroundColor: profile.theme ? undefined : undefined
      }}
    >
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button - Hidden on mobile for better space usage */}
        <div className="hidden md:block">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/browse">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Browse
            </Link>
          </Button>
        </div>

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
              
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mr-2">
                        {profile.name}
                      </h1>
                      {profile.isVerified && (
                        <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                      )}
                    </div>
                    {profile.bio && (
                      <p className="text-gray-700 dark:text-gray-300 mb-3">
                        {profile.bio}
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                      {profile.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {new Date(profile.joinedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                      {profile.stats.averageRating > 0 && (
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{profile.stats.averageRating}</span>
                          <span>({profile.stats.totalReviews})</span>
                        </div>
                      )}
                      {profile.responseTime && (
                        <div className="flex items-center space-x-1">
                          <Zap className="h-4 w-4" />
                          <span>{profile.responseTime}h</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
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
                      <>
                        <ThemeSelector 
                          currentTheme={profile.theme} 
                          onThemeChange={handleThemeChange} 
                        />
                        <BackgroundSelector 
                          currentBackground={profile.background} 
                          onBackgroundChange={handleBackgroundChange} 
                        />
                        <Button asChild variant="outline" size="sm">
                          <Link href="/profile/settings">
                            <Settings className="h-4 w-4" />
                            <span className="sr-only sm:not-sr-only sm:ml-2">Settings</span>
                          </Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* Stats - Responsive grid */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600 dark:text-blue-400">{profile.stats.totalListings}</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {profile.stats.totalListings === 1 ? 'Listing' : 'Listings'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">{profile.stats.totalCompletedBookings}</div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {profile.stats.totalCompletedBookings === 1 ? 'Booking' : 'Bookings'}
                    </div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {profile.stats.averageRating > 0 ? profile.stats.averageRating : '—'}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Rating</div>
                  </div>
                </div>

                {/* Badges and Achievements - Collapsed on mobile */}
                {(profile.badges && profile.badges.length > 0) || (profile.achievements && profile.achievements.length > 0) ? (
                  <div className="mt-4 space-y-4">
                    {isOwnProfile && profile.badges && profile.badges.length > 0 && (
                      <UserBadgesDisplay badges={profile.badges} />
                    )}
                    {profile.achievements && profile.achievements.length > 0 && (
                      <AchievementsDisplay achievements={profile.achievements} />
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Content */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 sm:grid-cols-5">
            <TabsTrigger value="listings" className="text-xs sm:text-sm">
              Listings ({profile.stats.totalListings})
            </TabsTrigger>
            <TabsTrigger value="reviews" className="text-xs sm:text-sm">
              Reviews ({profile.stats.totalReviews})
            </TabsTrigger>
            {isOwnProfile && (
              <TabsTrigger value="purchases" className="text-xs sm:text-sm">
                Purchases ({profile.purchases?.length || 0})
              </TabsTrigger>
            )}
            <TabsTrigger value="activity" className="text-xs sm:text-sm">
              Activity
            </TabsTrigger>
            <TabsTrigger value="about" className="text-xs sm:text-sm">
              About
            </TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.listings.map((listing) => {
                  // Determine category based on title and features
                  let category = "tools" // default
                  const titleLower = listing.title.toLowerCase()
                  
                  // Extract features text properly
                  let featuresText = ""
                  if (Array.isArray(listing.features)) {
                    featuresText = listing.features.join(" ").toLowerCase()
                  }
                  
                  const searchText = titleLower + " " + featuresText
                  
                  if (searchText.includes("macbook") || searchText.includes("ipad") || searchText.includes("camera") || searchText.includes("drone") || searchText.includes("projector")) {
                    category = "electronics"
                  } else if (searchText.includes("tesla") || searchText.includes("bmw") || searchText.includes("bike") || searchText.includes("motorcycle") || searchText.includes("van") || searchText.includes("rv") || searchText.includes("atv") || searchText.includes("boat")) {
                    category = "vehicles"
                  } else if (searchText.includes("piano") || searchText.includes("guitar") || searchText.includes("drum") || searchText.includes("violin") || searchText.includes("keyboard")) {
                    category = "services" // Musical instruments as services
                  } else if (searchText.includes("golf") || searchText.includes("surf") || searchText.includes("ski") || searchText.includes("kayak") || searchText.includes("tennis") || searchText.includes("camping") || searchText.includes("paddleboard")) {
                    category = "sports"
                  } else if (searchText.includes("tent") || searchText.includes("wedding") || searchText.includes("party") || searchText.includes("bounce") || searchText.includes("dj") || searchText.includes("karaoke")) {
                    category = "venues"
                  } else if (searchText.includes("board game") || searchText.includes("puzzle") || searchText.includes("craft") || searchText.includes("hobby") || searchText.includes("leisure") || searchText.includes("music") || searchText.includes("art") || searchText.includes("photography")) {
                    category = "hobbies"
                  }

                  return (
                    <div key={listing.id} className="listing-card group">
                      <Link href={`/listing/${listing.id}`}>
                        <div className="relative overflow-hidden rounded-t-2xl">
                          <div className="aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-700">
                            <img
                              src={listing.images[0] || "/placeholder.svg"}
                              alt={listing.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-2xl"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl" />
                          </div>
                          
                          {/* Top overlay buttons - Hide on small screens */}
                          <div className="hidden sm:flex absolute top-3 right-3 space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0">
                            <WishlistButton 
                              listingId={listing.id} 
                              variant="ghost" 
                              size="sm"
                              className="bg-white/95 hover:bg-white shadow-lg h-9 w-9 backdrop-blur-sm border-0 rounded-full"
                            />
                            <ShareButton
                              listingId={listing.id}
                              listingTitle={listing.title}
                              listingPrice={listing.price}
                              listingImage={listing.images[0]}
                              variant="ghost"
                              size="sm"
                              className="bg-white/95 hover:bg-white shadow-lg h-9 w-9 backdrop-blur-sm border-0 rounded-full"
                            />
                          </div>
                          
                          {/* Category badge - Smaller on mobile */}
                          <div className="absolute bottom-3 left-3">
                            <Badge className="bg-white/95 text-gray-800 hover:bg-white shadow-lg font-medium px-3 py-1.5 rounded-full border-0 backdrop-blur-sm text-xs">
                              {category}
                            </Badge>
                          </div>
                          
                          {/* Availability indicator - Smaller on mobile */}
                          <div className="absolute top-3 left-3">
                            <div className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                              Available
                            </div>
                          </div>
                        </div>
                        
                        <div className="listing-content border border-gray-200 dark:border-gray-700 rounded-b-2xl p-4">
                          {/* Title and description */}
                          <div className="space-y-2">
                            <h3 className="listing-title font-semibold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                              {listing.title}
                            </h3>
                            <p className="listing-description text-gray-600 dark:text-gray-400 text-sm mb-2 line-clamp-2">
                              {listing.description}
                            </p>
                          </div>
                          
                          {/* Rating and location - Simplified on mobile */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {listing.averageRating > 0 ? listing.averageRating.toFixed(1) : '—'}
                              </span>
                              <span className="text-sm text-gray-500">({listing.reviewCount})</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                              <span className="truncate max-w-[80px]">{listing.location}</span>
                            </div>
                          </div>
                          
                          {/* Pricing section */}
                          <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <div className="flex items-baseline space-x-1">
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                  ₱{listing.price.toLocaleString()}
                                </span>
                                <span className="text-sm text-gray-500">/day</span>
                              </div>
                              <div className="text-right">
                                <div className="text-xs text-gray-500">Total reviews</div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{listing.reviewCount}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      {isOwnProfile && (
                        <div className="px-4 pb-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              handleDeleteListing(listing.id)
                            }}
                            disabled={deletingListingId === listing.id}
                            className="w-full rounded-xl"
                          >
                            {deletingListingId === listing.id ? (
                              <>
                                <SpinnerLoader className="h-4 w-4 mr-2" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            {profile.reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No reviews yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isOwnProfile ? "Your reviews will appear here." : "This user hasn't received any reviews yet."}
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

          {/* Purchases Tab - Only for own profile */}
          {isOwnProfile && (
            <TabsContent value="purchases" className="space-y-6">
              <Card>
                <CardContent className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Purchase History
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    View your purchase history and manage your items
                  </p>
                  <Button asChild>
                    <Link href={`/profile/${userId}/purchases`}>View Purchases</Link>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardContent className="text-center py-12">
                <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Activity Timeline
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your rental activity and milestones will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  About {profile.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {profile.bio && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Bio</h3>
                    <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
                  </div>
                )}
                
                {profile.location && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Location</h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                )}
                
                {profile.socialLinks && (
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-2">Social Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(profile.socialLinks).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        >
                          <LinkIcon className="h-3 w-3 mr-1" />
                          {platform}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white mb-2">Member Since</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(profile.joinedAt).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}</span>
                  </div>
                </div>
                
                {isOwnProfile && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Button asChild variant="outline" size="sm">
                      <Link href="/profile/settings">
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}