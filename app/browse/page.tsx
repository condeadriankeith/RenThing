"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingBag, Search, Filter, MapPin, Star, Heart, X, TrendingUp } from "lucide-react"
import { mockListings } from "@/lib/mock-data"
import { SearchSuggestions } from "@/components/search-suggestions"
import { useDebounce } from "@/hooks/use-debounce"

export default function BrowsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [availableOnly, setAvailableOnly] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  const debouncedSearchQuery = useDebounce(searchQuery, 300)

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
    return mockListings
      .filter((listing) => {
        const matchesSearch =
          listing.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
          listing.features.some((feature) => feature.toLowerCase().includes(debouncedSearchQuery.toLowerCase()))

        const matchesCategory = selectedCategory === "all" || listing.category === selectedCategory
        const matchesPrice = listing.price >= priceRange[0] && listing.price <= priceRange[1]
        const matchesAvailability = !availableOnly || listing.available
        const matchesFeatures =
          selectedFeatures.length === 0 ||
          selectedFeatures.some((feature) =>
            listing.features.some((listingFeature) => listingFeature.toLowerCase().includes(feature.toLowerCase())),
          )

        return matchesSearch && matchesCategory && matchesPrice && matchesAvailability && matchesFeatures
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
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
      })
  }, [debouncedSearchQuery, selectedCategory, sortBy, priceRange, availableOnly, selectedFeatures])

  const popularSearches = ["Camera", "Tesla", "Tools", "Wedding", "Mountain Bike"]
  const trendingItems = mockListings.slice(0, 3)

  const allFeatures = Array.from(new Set(mockListings.flatMap((listing) => listing.features))).slice(0, 8) // Show top 8 features

  const clearFilters = () => {
    setSelectedCategory("all")
    setPriceRange([0, 1000])
    setSelectedFeatures([])
    setAvailableOnly(false)
    setSortBy("newest")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800 sticky top-0 z-10">
        <div className="container mx-auto px-2 sm:px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">RenThing</h1>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/browse" className="text-blue-600 font-medium text-base">Browse</Link>
            <Link href="/list-item" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 text-base">List Item</Link>
            <Link href="/my-bookings" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 text-base">My Bookings</Link>
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="outline" asChild size="sm" className="min-w-[80px]">
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button asChild size="sm" className="min-w-[80px]">
              <Link href="/list-item">List Item</Link>
            </Button>
          </div>
        </div>
      </header>

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
                    listings={mockListings}
                    onSelect={(suggestion) => {
                      setSearchQuery(suggestion)
                      setShowSuggestions(false)
                    }}
                  />
                )}
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
                      <Checkbox id="available" checked={availableOnly} onCheckedChange={checked => setAvailableOnly(checked === true)} />
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
                            onCheckedChange={(checked) => {
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
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={(e) => {
                      e.preventDefault()
                      // TODO: Implement wishlist functionality
                    }}
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
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
