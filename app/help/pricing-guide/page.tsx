import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calculator,
  TrendingUp,
  DollarSign,
  Target,
  ArrowLeft,
  CheckCircle,
  BarChart,
  Clock,
  Calendar
} from "lucide-react"

export default function PricingGuidePage() {
  const pricingFactors = [
    {
      factor: "Item Value",
      icon: DollarSign,
      weight: "High",
      description: "Original purchase price and current market value",
      guidelines: [
        "Research current retail prices",
        "Consider depreciation and age",
        "Factor in condition and wear",
        "Check resale values online",
        "Account for replacement cost"
      ]
    },
    {
      factor: "Local Demand",
      icon: TrendingUp,
      weight: "High",
      description: "How much demand exists in your area",
      guidelines: [
        "Check similar listings in your city",
        "Consider seasonal demand patterns",
        "Look at event calendars (weddings, festivals)",
        "Monitor competitor pricing",
        "Assess local population needs"
      ]
    },
    {
      factor: "Rental Duration",
      icon: Clock,
      weight: "Medium",
      description: "Length of rental period affects daily rates",
      guidelines: [
        "Offer discounts for longer rentals",
        "Daily rate decreases with duration",
        "Weekly rates: 10-20% discount",
        "Monthly rates: 30-50% discount",
        "Consider minimum rental periods"
      ]
    },
    {
      factor: "Seasonality",
      icon: Calendar,
      weight: "Medium",
      description: "Time of year affects demand and pricing",
      guidelines: [
        "Summer: outdoor equipment premium",
        "Wedding season: photography gear",
        "Holidays: party supplies, decorations",
        "School year: educational materials",
        "Adjust prices based on seasonal trends"
      ]
    }
  ]

  const pricingFormulas = [
    {
      category: "Electronics",
      formula: "2-5% of retail value per day",
      examples: [
        { item: "₱50,000 Camera", daily: "₱1,000-2,500", weekly: "₱6,000-15,000" },
        { item: "₱30,000 Laptop", daily: "₱600-1,500", weekly: "₱3,600-9,000" },
        { item: "₱15,000 Drone", daily: "₱300-750", weekly: "₱1,800-4,500" }
      ]
    },
    {
      category: "Tools & Equipment",
      formula: "3-7% of retail value per day",
      examples: [
        { item: "₱25,000 Power Tools", daily: "₱750-1,750", weekly: "₱4,500-10,500" },
        { item: "₱10,000 Lawn Mower", daily: "₱300-700", weekly: "₱1,800-4,200" },
        { item: "₱5,000 Generator", daily: "₱150-350", weekly: "₱900-2,100" }
      ]
    },
    {
      category: "Vehicles",
      formula: "1-3% of value per day + fuel",
      examples: [
        { item: "₱500,000 Car", daily: "₱5,000-15,000", weekly: "₱30,000-90,000" },
        { item: "₱80,000 Motorcycle", daily: "₱800-2,400", weekly: "₱4,800-14,400" },
        { item: "₱30,000 Bicycle", daily: "₱300-900", weekly: "₱1,800-5,400" }
      ]
    }
  ]

  const pricingStrategies = [
    {
      strategy: "Penetration Pricing",
      description: "Start low to gain market share",
      when: "New to platform, common items",
      pros: ["Quick bookings", "Build reviews", "Learn market"],
      cons: ["Lower profits", "Harder to raise later"],
      example: "Price 20% below market rate initially"
    },
    {
      strategy: "Competitive Pricing",
      description: "Match market rates",
      when: "Established owners, standard items",
      pros: ["Steady bookings", "Market acceptance", "Predictable income"],
      cons: ["No differentiation", "Price wars possible"],
      example: "Research 5 similar items, price in middle range"
    },
    {
      strategy: "Premium Pricing",
      description: "Price above market for quality",
      when: "Unique items, excellent condition",
      pros: ["Higher profits", "Quality renters", "Brand positioning"],
      cons: ["Fewer bookings", "Slower growth"],
      example: "Price 30-50% above market for exceptional items"
    },
    {
      strategy: "Dynamic Pricing",
      description: "Adjust based on demand",
      when: "Seasonal items, experienced owners",
      pros: ["Maximize revenue", "Market responsive", "Optimize occupancy"],
      cons: ["Complex management", "Renter confusion"],
      example: "Raise prices 50% during peak seasons"
    }
  ]

  const pricingMistakes = [
    {
      mistake: "Pricing Too High Initially",
      impact: "No bookings, poor visibility",
      solution: "Research market rates, start competitive"
    },
    {
      mistake: "Not Considering Total Costs",
      impact: "Losing money on rentals",
      solution: "Factor in wear, insurance, time costs"
    },
    {
      mistake: "Ignoring Seasonal Patterns",
      impact: "Missing peak earning opportunities",
      solution: "Track demand patterns, adjust accordingly"
    },
    {
      mistake: "Never Updating Prices",
      impact: "Leaving money on table",
      solution: "Review and adjust monthly"
    },
    {
      mistake: "Copying Competitors Blindly",
      impact: "Race to bottom pricing",
      solution: "Understand your unique value proposition"
    }
  ]

  const optimizationTips = [
    {
      tip: "Test Different Price Points",
      description: "Try various prices to find optimal rate",
      action: "A/B test pricing every few weeks"
    },
    {
      tip: "Bundle Related Items",
      description: "Offer package deals for higher value",
      action: "Create camera + lens + tripod bundles"
    },
    {
      tip: "Implement Length Discounts",
      description: "Encourage longer rentals with lower daily rates",
      action: "10% off weekly, 25% off monthly"
    },
    {
      tip: "Seasonal Adjustments",
      description: "Raise prices during peak demand periods",
      action: "Wedding season, holiday premiums"
    },
    {
      tip: "Monitor Performance Metrics",
      description: "Track views, inquiries, and conversion rates",
      action: "Adjust if conversion rate below 20%"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Calculator className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Pricing Your Items</h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Master the art of pricing to maximize your earnings while staying competitive
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Back Navigation */}
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/help" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Help Center
              </Link>
            </Button>
          </div>

          {/* Pricing Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 text-blue-600 mr-2" />
                Pricing Overview
              </CardTitle>
              <CardDescription>
                Smart pricing is the key to maximizing your rental income
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">40%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Increase in bookings with optimal pricing</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">25%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Higher earnings vs random pricing</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">60%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Of success depends on pricing strategy</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Factors */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Key Pricing Factors
            </h2>
            <div className="space-y-6">
              {pricingFactors.map((factor, index) => {
                const IconComponent = factor.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{factor.factor}</CardTitle>
                            <CardDescription>{factor.description}</CardDescription>
                          </div>
                        </div>
                        <Badge variant={factor.weight === 'High' ? 'destructive' : 'secondary'}>
                          {factor.weight} Impact
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-16">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Guidelines:</h4>
                        <ul className="space-y-2">
                          {factor.guidelines.map((guideline, guidelineIndex) => (
                            <li key={guidelineIndex} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{guideline}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Pricing Formulas */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Pricing Formulas by Category
            </h2>
            <div className="space-y-6">
              {pricingFormulas.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart className="w-6 h-6 text-blue-600 mr-2" />
                      {category.category}
                    </CardTitle>
                    <CardDescription>
                      Formula: {category.formula}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {category.examples.map((example, exampleIndex) => (
                        <div key={exampleIndex} className="flex justify-between items-center p-3 border rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-white">{example.item}</span>
                          <div className="text-right text-sm">
                            <div>Daily: {example.daily}</div>
                            <div className="text-gray-600 dark:text-gray-400">Weekly: {example.weekly}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Pricing Strategies */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Pricing Strategies
            </h2>
            <div className="grid gap-6">
              {pricingStrategies.map((strategy, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{strategy.strategy}</CardTitle>
                    <CardDescription>{strategy.description}</CardDescription>
                    <Badge variant="outline" className="w-fit mt-2">
                      Best for: {strategy.when}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-green-600 mb-2">Pros:</h5>
                        <ul className="text-sm space-y-1">
                          {strategy.pros.map((pro, proIndex) => (
                            <li key={proIndex} className="text-gray-600 dark:text-gray-400">• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-600 mb-2">Cons:</h5>
                        <ul className="text-sm space-y-1">
                          {strategy.cons.map((con, conIndex) => (
                            <li key={conIndex} className="text-gray-600 dark:text-gray-400">• {con}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-blue-600 mb-2">Example:</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{strategy.example}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 text-red-600 mr-2" />
                Common Pricing Mistakes
              </CardTitle>
              <CardDescription>
                Avoid these pitfalls to maximize your success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pricingMistakes.map((mistake, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{mistake.mistake}</h4>
                    <p className="text-sm text-red-600 mb-2">Impact: {mistake.impact}</p>
                    <p className="text-sm text-green-600">Solution: {mistake.solution}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optimization Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                Price Optimization Tips
              </CardTitle>
              <CardDescription>
                Advanced strategies to maximize your earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {optimizationTips.map((tip, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{tip.tip}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tip.description}</p>
                    <p className="text-sm text-blue-600 font-medium">Action: {tip.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Tools */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Ready to Optimize Your Pricing?</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Use our tools and guides to set competitive prices that maximize your earnings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/help/creating-listings">
                  Create Optimized Listing
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help/maximizing-earnings">
                  Maximize Earnings Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}