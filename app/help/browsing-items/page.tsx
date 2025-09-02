import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar,
  Star,
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  DollarSign,
  Clock,
  User
} from "lucide-react"

export default function BrowsingItemsPage() {
  const searchFeatures = [
    {
      title: "Smart Search",
      icon: Search,
      description: "Find exactly what you need",
      features: [
        "Search by item name or description",
        "Auto-complete suggestions",
        "Search within categories",
        "Voice search (mobile)",
        "Barcode scanner for specific items"
      ]
    },
    {
      title: "Advanced Filters",
      icon: Filter,
      description: "Narrow down your results",
      features: [
        "Price range filtering",
        "Date availability",
        "Distance from your location",
        "Item condition",
        "Delivery options available"
      ]
    },
    {
      title: "Location-Based",
      icon: MapPin,
      description: "Find items near you",
      features: [
        "Search by city or neighborhood",
        "View items on map",
        "Sort by distance",
        "Set pickup radius",
        "Save favorite locations"
      ]
    },
    {
      title: "Availability",
      icon: Calendar,
      description: "Check when items are free",
      features: [
        "Real-time availability",
        "Calendar view of bookings",
        "Flexible date ranges",
        "Last-minute availability",
        "Recurring rental options"
      ]
    }
  ]

  const browsingTips = [
    {
      category: "Finding the Best Items",
      icon: Star,
      color: "text-yellow-600",
      tips: [
        "Check item ratings and reviews",
        "Look for verified owners",
        "Read item descriptions carefully",
        "Check recent activity and response time",
        "Compare similar items and prices"
      ]
    },
    {
      category: "Saving Time",
      icon: Clock,
      color: "text-blue-600",
      tips: [
        "Use specific search terms",
        "Save items to your wishlist",
        "Set up search alerts",
        "Filter by instant booking",
        "Sort by 'Available Now'"
      ]
    },
    {
      category: "Getting Better Deals",
      icon: DollarSign,
      color: "text-green-600",
      tips: [
        "Check for weekly/monthly discounts",
        "Look for new owner promotions",
        "Consider slightly older items",
        "Book for longer periods",
        "Compare pickup vs delivery costs"
      ]
    }
  ]

  const categories = [
    { name: "Electronics", items: "Cameras, Laptops, Gaming", popular: true },
    { name: "Tools & Equipment", items: "Power Tools, Garden, Construction", popular: true },
    { name: "Sports & Recreation", items: "Bikes, Camping, Water Sports", popular: true },
    { name: "Vehicles", items: "Cars, Motorcycles, Boats", popular: false },
    { name: "Party & Events", items: "Tables, Speakers, Decorations", popular: true },
    { name: "Home & Garden", items: "Furniture, Appliances, Outdoor", popular: false },
    { name: "Fashion & Accessories", items: "Designer Items, Jewelry, Bags", popular: false },
    { name: "Books & Media", items: "Textbooks, DVDs, Games", popular: false }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Help Center
                </Link>
              </Button>
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Browsing and Searching Items
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                Master the art of finding exactly what you need on RenThing with our powerful search and browsing tools.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Quick Start */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                🚀 Quick Start Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Search className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium">1. Search</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Enter what you need</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <Filter className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium">2. Filter</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Refine your results</div>
                </div>
                <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium">3. Book</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Reserve your item</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Features */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Powerful Search Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {searchFeatures.map((feature, index) => {
                const IconComponent = feature.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-8 h-8 text-blue-600" />
                        <div>
                          <CardTitle className="text-lg">{feature.title}</CardTitle>
                          <CardDescription>{feature.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.features.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Popular Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
              <CardDescription>
                Browse by category to discover what's available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <div>
                      <div className="flex items-center space-x-2">
                        <div className="font-medium text-gray-900 dark:text-white">{category.name}</div>
                        {category.popular && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{category.items}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Browsing Tips */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Pro Browsing Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {browsingTips.map((tip, index) => {
                const IconComponent = tip.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <IconComponent className={`w-6 h-6 ${tip.color}`} />
                        <span className="text-lg">{tip.category}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {tip.tips.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Search Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">
                  🎯 Search Like a Pro
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-sm">Use specific terms</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">\"Canon DSLR camera\" vs \"camera\"</div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Include brand names</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">\"iPhone 14\" vs \"smartphone\"</div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Add model numbers</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">\"MacBook Pro M1\" vs \"laptop\"</div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Use quotation marks</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">\"party tent\" for exact phrase</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-blue-600 dark:text-blue-400">
                  ⚡ Speed Up Your Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="font-medium text-sm">Save favorites</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Heart items for later viewing</div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Set location first</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Filter by distance early</div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Use recent searches</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Quick access to past searches</div>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Enable notifications</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Get alerts for new items</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">
                Ready to Start Browsing?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-auto p-4" asChild>
                  <Link href="/browse">
                    <div className="text-left">
                      <div className="font-medium">Browse All Items</div>
                      <div className="text-sm opacity-90">Explore everything available</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href="/help/booking-guide">
                    <div className="text-left">
                      <div className="font-medium">Learn How to Book</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Master the booking process</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Can't find what you're looking for?
            </p>
            <Button variant="outline" asChild>
              <Link href="/contact">
                Contact Support
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}