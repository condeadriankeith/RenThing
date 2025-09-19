"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Filter, MapPin, Star, Heart, X, TrendingUp } from "lucide-react"
import { SearchSuggestions } from "@/components/search-suggestions"
import { SpinnerLoader } from "@/components/ui/spinner-loader"
import { WishlistButton } from "@/components/wishlist-button"
import { ShareButton } from "@/components/share-button"

import { useDebounce } from "@/hooks/use-debounce"
import { AnimatedWrapper } from "@/components/ui/animations";

interface Listing {
  id: string
  title: string
  description: string
  category: string
  price: number
  priceUnit: string
  location: string
  images: string[]
  rating: number
  reviewCount: number
  available: boolean
  features: string[]
  createdAt: string
}

export default function BrowsePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [allListings, setAllListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [availableOnly, setAvailableOnly] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [locationFilter, setLocationFilter] = useState(searchParams.get('location') || "")

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The search is already handled by the useEffect hook through debouncedSearchQuery
    // But we can add query parameters to the URL for better UX
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (locationFilter) params.set('location', locationFilter)
    router.push(`/browse?${params.toString()}`)
  }

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true)
      try {
        // Try to fetch listings from the database API first
        let databaseListings: any[] = []
        try {
          const response = await fetch("/api/listings?limit=50")
          if (response.ok) {
            const data = await response.json()
            databaseListings = data.listings
          }
        } catch (dbError) {
          console.log("Database fetch failed", dbError)
        }

        const enrichedListings: Listing[] = databaseListings.map((listing: any) => {
          // Determine category based on title and features
          let category = "tools" // default
          const titleLower = listing.title.toLowerCase()
          const featuresLower = Array.isArray(listing.features) 
            ? listing.features.map((f: string) => f.toLowerCase()).join(" ")
            : typeof listing.features === 'string' 
              ? listing.features.toLowerCase()
              : ""
          const searchText = titleLower + " " + featuresLower
          
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
          
          // Parse images and features if they're strings
          let images = []
          if (Array.isArray(listing.images)) {
            images = listing.images
          } else if (typeof listing.images === 'string') {
            try {
              images = JSON.parse(listing.images)
            } catch (e) {
              images = [listing.images]
            }
          }
          
          let features = []
          if (Array.isArray(listing.features)) {
            features = listing.features
          } else if (typeof listing.features === 'string') {
            try {
              features = JSON.parse(listing.features)
            } catch (e) {
              features = [listing.features]
            }
          }
          
          return {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            location: listing.location,
            images: images,
            features: features,
            createdAt: listing.createdAt,
            category: category,
            available: true,
            rating: listing.averageRating || 0,
            reviewCount: listing.reviewCount || 0,
            priceUnit: "day",
          }
        })
        setAllListings(enrichedListings)

      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchListings()
  }, [])


  const categories = [
    { value: "all", label: "All Categories" },
    { value: "electronics", label: "Electronics" },
    { value: "tools", label: "Tools & Equipment" },
    { value: "vehicles", label: "Vehicles" },
    { value: "services", label: "Services" },
    { value: "venues", label: "Venues" },
    { value: "sports", label: "Sports & Recreation" },
    { value: "hobbies", label: "Hobbies & Leisure" },
  ]

  const filteredListings = useMemo(() => {
    return allListings
      .filter((listing) => {

        const matchesSearch =
          listing.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          listing.features.some((feature: string) => feature.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

        const matchesLocation = !locationFilter || 
          listing.location.toLowerCase().includes(locationFilter.toLowerCase())

        const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory
        const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1]
        const matchesAvailability = !availableOnly || listing.available
        const matchesFeatures =
          selectedFeatures.length === 0 ||
          selectedFeatures.some((feature: string) =>
            listing.features.some((listingFeature: string) => listingFeature.toLowerCase().includes(feature.toLowerCase())),
          )


        return matchesSearch && matchesLocation && matchesCategory && matchesPrice && matchesAvailability && matchesFeatures
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price
          case "price-high":
            return b.price - a.price
          case "rating":
            return b.rating - a.rating
          case "newest":
          default:
            const dateA = new Date(a.createdAt)
            const dateB = new Date(b.createdAt)
            if (isNaN(dateA.getTime())) return 1
            if (isNaN(dateB.getTime())) return -1
            return dateB.getTime() - dateA.getTime()

        }
      })
  }, [allListings, debouncedSearchQuery, locationFilter, selectedCategory, sortBy, priceRange, availableOnly, selectedFeatures])

  const popularSearches = ["Camera", "Tesla", "Tools", "Wedding", "Mountain Bike"]
  const trendingItems = allListings.slice(0, 3)

  const allFeatures = Array.from(new Set(allListings.flatMap((listing) => listing.features))).slice(0, 8) // Show top 8 features


  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSortBy("newest")
    setPriceRange([0, 1000])
    setSelectedFeatures([])
    setAvailableOnly(false)
    setLocationFilter("")
  }

  return (
    <AnimatedWrapper variant="page">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
            <div className="mb-4 sm:mb-6 lg:mb-8">
              <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
                {/* Main Search */}
                <div className="flex-1">
                  <div className="relative mb-3 sm:mb-4">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search for items, services..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value)
                        setShowSuggestions(e.target.value.length > 0)
                      }}
                      onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="pl-10 h-10 sm:h-12 text-sm sm:text-lg rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                    {showSuggestions && (
                      <SearchSuggestions
                        query={searchQuery}
                        listings={allListings as any}
                        onSelect={(suggestion) => {
                          setSearchQuery(suggestion)
                          setShowSuggestions(false)
                        }}
                      />
                    )}
                  </div>
                  
                  {/* Location Filter */}
                  <div className="relative mb-3 sm:mb-4">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Filter by location..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="pl-10 h-10 sm:h-12 text-sm sm:text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  {/* Quick Filters - Mobile Optimized */}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-2 mb-3 sm:mb-4">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full sm:w-48 h-10 text-sm rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-full sm:w-48 h-10 text-sm rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="rating">Highest Rated</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="bg-transparent h-10 text-sm rounded-xl">
                      <Filter className="h-4 w-4 mr-2" />
                      More Filters
                    </Button>
                  </div>
                </div>

                {/* Trending & Popular - Hide on smaller screens */}
                {!searchQuery && (
                  <div className="hidden xl:block xl:w-80 space-y-4">
                    <Card className="rounded-2xl shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                          <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                          Trending Now
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {trendingItems.map((item, index) => (
                          <AnimatedWrapper key={item.id} variant="card" delay={index * 0.1}>
                            <Link
                              href={`/listing/${item.id}`}
                              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <img
                                src={item.images[0] || "/placeholder.svg"}
                                alt={item.title}
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.title}</p>
                                <p className="text-blue-600 font-semibold">
                                  ₱{item.price.toLocaleString()}/{item.priceUnit}
                                </p>
                              </div>
                            </Link>
                          </AnimatedWrapper>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-lg">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Popular Searches</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {popularSearches.map((search) => (
                            <Button
                              key={search}
                              variant="outline"
                              size="sm"
                              onClick={() => setSearchQuery(search)}
                              className="text-xs bg-transparent rounded-full"
                            >
                              {search}
                            </Button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {showFilters && (
                <AnimatedWrapper variant="card">
                  <Card className="mb-4 sm:mb-6 rounded-2xl shadow-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base sm:text-lg">Advanced Filters</CardTitle>
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-sm rounded-lg">
                          Clear All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {/* Price Range */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Price Range</label>
                          <div className="px-2">
                            <Slider
                              value={priceRange}
                              onValueChange={setPriceRange}
                              max={1000}
                              min={0}
                              step={10}
                              className="w-full"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-1">
                              <span>₱{priceRange[0].toLocaleString()}</span>
                              <span>₱{priceRange[1].toLocaleString()}+</span>
                            </div>
                          </div>
                        </div>

                        {/* Availability */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Availability</label>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="available" checked={availableOnly} onCheckedChange={(checked: boolean | 'indeterminate') => setAvailableOnly(checked === true)} />

                            <label htmlFor="available" className="text-sm">
                              Available now
                            </label>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3">
                          <label className="text-sm font-medium">Features</label>
                          <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                            {allFeatures.map((feature) => (
                              <div key={feature} className="flex items-center space-x-2">
                                <Checkbox
                                  id={feature}
                                  checked={selectedFeatures.includes(feature)}
                                  onCheckedChange={(checked: boolean | 'indeterminate') => {
                                    if (checked) {
                                      setSelectedFeatures([...selectedFeatures, feature])
                                    } else {
                                      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))
                                    }
                                  }}

                                />
                                <label htmlFor={feature} className="text-xs truncate">
                                  {feature}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedWrapper>
              )}

              {/* Active Filters */}
              {(selectedCategory !== "all" ||
                selectedFeatures.length > 0 ||
                availableOnly ||
                locationFilter ||
                priceRange[0] > 0 ||
                priceRange[1] < 1000) && (
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-4">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mr-2">Active filters:</span>
                  {selectedCategory !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
                      {categories.find((c) => c.value === selectedCategory)?.label}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                    </Badge>
                  )}
                  {locationFilter && (
                    <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
                      Location: {locationFilter}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setLocationFilter("")} />
                    </Badge>
                  )}
                  {selectedFeatures.map((feature) => (
                    <Badge key={feature} variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
                      {feature}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))}
                      />
                    </Badge>
                  ))}
                  {availableOnly && (
                    <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
                      Available Now
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setAvailableOnly(false)} />
                    </Badge>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <Badge variant="secondary" className="flex items-center gap-1 rounded-full px-3 py-1">
                      ₱{priceRange[0].toLocaleString()} - ₱{priceRange[1].toLocaleString()}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 1000])} />
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {filteredListings.length} items found
                  {debouncedSearchQuery && <span className="ml-2 text-blue-600">for "{debouncedSearchQuery}"</span>}
                </p>
              </div>
            </div>

            {/* Listings Grid - Enhanced with curved edges and better layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 sm:gap-6">
              {filteredListings.map((listing, index) => (
                <AnimatedWrapper key={listing.id} variant="card" delay={index * 0.05}>
                  <div className="listing-card group">
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
                            {listing.category}
                          </Badge>
                        </div>
                        
                        {/* Availability indicator - Smaller on mobile */}
                        {listing.available && (
                          <div className="absolute top-3 left-3">
                            <div className="bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-lg">
                              Available
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="listing-content">
                        {/* Title and description */}
                        <div className="space-y-2">
                          <h3 className="listing-title">
                            {listing.title}
                          </h3>
                          <p className="listing-description">
                            {listing.description}
                          </p>
                        </div>
                        
                        {/* Rating and location - Simplified on mobile */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{listing.rating}</span>
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
                              <span className="text-sm text-gray-500">/{listing.priceUnit}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-gray-500">Total reviews</div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{listing.reviewCount}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </AnimatedWrapper>
              ))}
            </div>

            {filteredListings.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <Button onClick={clearFilters} variant="outline" className="mr-3 bg-transparent rounded-xl">
                  Clear Filters
                </Button>
                <Button asChild className="rounded-xl">
                  <Link href="/list-item">List Your Item</Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="relative h-8 w-auto">
                      <img 
                        src="/RenThing_Logo.png" 
                        alt="RenThing" 
                        className="h-8 w-auto"
                        style={{ filter: 'brightness(0) invert(1)' }}
                      />
                    </div>
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
    </AnimatedWrapper>
  )
}