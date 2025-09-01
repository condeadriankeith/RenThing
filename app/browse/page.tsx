"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingBag, Search, Filter, MapPin, Star, Heart, X, TrendingUp } from "lucide-react"
import { SearchSuggestions } from "@/components/search-suggestions"
import { SpinningLogo } from "@/components/ui/spinning-logo"
import { WishlistButton } from "@/components/wishlist-button"
import { ShareButton } from "@/components/share-button"

import { useDebounce } from "@/hooks/use-debounce"

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

  useEffect(() => {
    const fetchListings = async () => {
      setIsLoading(true)
      try {
        // Fetch more listings with pagination
        const response = await fetch("/api/listings?limit=50")
        if (!response.ok) {
          throw new Error("Failed to fetch listings")
        }
        const data = await response.json()
        const enrichedListings: Listing[] = data.listings.map((listing: any) => {
          // Determine category based on title and features
          let category = "tools" // default
          const titleLower = listing.title.toLowerCase()
          const featuresLower = listing.features.map((f: string) => f.toLowerCase()).join(" ")
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
            category = "events"
          }
          
          return {
            id: listing.id,
            title: listing.title,
            description: listing.description,
            price: listing.price,
            location: listing.location,
            images: listing.images,
            features: listing.features,
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
    { value: "events", label: "Events" },
    { value: "sports", label: "Sports & Recreation" },
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
    setSelectedCategory("all")
    setPriceRange([0, 1000])
    setSelectedFeatures([])
    setAvailableOnly(false)
    setSortBy("newest")
    setLocationFilter("")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center space-y-4">
          <SpinningLogo size="xl" className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading listings...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-lg">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Header */}


      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Search */}
            <div className="flex-1">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search for items, services, or experiences..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onFocus={() => setShowSuggestions(searchQuery.length > 0)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  className="pl-10 h-12 text-lg"
                />
                {showSuggestions && (
                  <SearchSuggestions
                    query={searchQuery}
                    listings={allListings}
                    onSelect={(suggestion) => {
                      setSearchQuery(suggestion)
                      setShowSuggestions(false)
                    }}
                  />
                )}
              </div>
              
              {/* Location Filter */}
              <div className="relative mb-4">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Filter by location..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
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
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="bg-transparent">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Trending & Popular */}
            {!searchQuery && (
              <div className="lg:w-80 space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-orange-500" />
                      Trending Now
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {trendingItems.map((item) => (
                      <Link
                        key={item.id}
                        href={`/listing/${item.id}`}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <img
                          src={item.images[0] || "/placeholder.svg"}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{item.title}</p>
                          <p className="text-blue-600 font-semibold">
                            ₱{item.price.toLocaleString()}/{item.priceUnit}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </CardContent>
                </Card>

                <Card>
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
                          className="text-xs bg-transparent"
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
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Advanced Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}

          {/* Active Filters */}
          {(selectedCategory !== "all" ||
            selectedFeatures.length > 0 ||
            availableOnly ||
            locationFilter ||
            priceRange[0] > 0 ||
            priceRange[1] < 1000) && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">Active filters:</span>
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {categories.find((c) => c.value === selectedCategory)?.label}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory("all")} />
                </Badge>
              )}
              {locationFilter && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Location: {locationFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setLocationFilter("")} />
                </Badge>
              )}
              {selectedFeatures.map((feature) => (
                <Badge key={feature} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))}
                  />
                </Badge>
              ))}
              {availableOnly && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Available Now
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setAvailableOnly(false)} />
                </Badge>
              )}
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ₱{priceRange[0].toLocaleString()} - ₱{priceRange[1].toLocaleString()}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange([0, 1000])} />
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-400">
              {filteredListings.length} items found
              {debouncedSearchQuery && <span className="ml-2 text-blue-600">for "{debouncedSearchQuery}"</span>}
            </p>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
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
                  <Badge className="absolute bottom-2 left-2 bg-blue-600">{listing.category}</Badge>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg line-clamp-1">{listing.title}</CardTitle>
                  <CardDescription className="line-clamp-2">{listing.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{listing.rating}</span>
                      <span className="text-sm text-gray-500">({listing.reviewCount})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {listing.location}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">₱{listing.price.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">/{listing.priceUnit}</span>
                    </div>
                    {listing.available && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Available
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button onClick={clearFilters} variant="outline" className="mr-3 bg-transparent">
              Clear Filters
            </Button>
            <Button asChild>
              <Link href="/list-item">List Your Item</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
