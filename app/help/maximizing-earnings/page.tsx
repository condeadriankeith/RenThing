import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp,
  DollarSign,
  Star,
  Users,
  ArrowLeft,
  CheckCircle,
  Target,
  Calendar,
  Camera,
  MessageCircle,
  Award
} from "lucide-react"

export default function MaximizingEarningsPage() {
  const earningStrategies = [
    {
      strategy: "Optimize Your Listings",
      icon: Star,
      impact: "High",
      description: "Create irresistible listings that attract more renters",
      tactics: [
        "Use professional-quality photos",
        "Write detailed, keyword-rich descriptions",
        "Highlight unique features and benefits",
        "Keep information accurate and up-to-date",
        "Respond to inquiries within 2 hours"
      ],
      potentialIncrease: "40-60% more bookings"
    },
    {
      strategy: "Strategic Pricing",
      icon: DollarSign,
      impact: "High",
      description: "Price competitively while maximizing revenue",
      tactics: [
        "Research competitor pricing regularly",
        "Adjust prices based on demand seasons",
        "Offer discounts for longer rentals",
        "Bundle related items for higher value",
        "Test different price points"
      ],
      potentialIncrease: "25-35% higher revenue"
    },
    {
      strategy: "Expand Your Inventory",
      icon: TrendingUp,
      impact: "Medium",
      description: "Add complementary items to increase booking frequency",
      tactics: [
        "Analyze which items are most profitable",
        "Invest in high-demand categories",
        "Offer complete packages/bundles",
        "Consider purchasing based on seasonal trends",
        "Partner with other owners for cross-promotion"
      ],
      potentialIncrease: "50-100% more revenue streams"
    },
    {
      strategy: "Build Strong Relationships",
      icon: Users,
      impact: "Medium",
      description: "Create loyal customers who book repeatedly",
      tactics: [
        "Provide exceptional customer service",
        "Follow up after rentals",
        "Offer return customer discounts",
        "Maintain professional communication",
        "Ask for reviews and referrals"
      ],
      potentialIncrease: "30-40% repeat bookings"
    }
  ]

  const profitabilityFactors = [
    {
      factor: "Item Utilization Rate",
      description: "How often your items are rented",
      target: "60-80%",
      improvements: [
        "Competitive pricing strategy",
        "Better photos and descriptions",
        "Seasonal availability adjustments",
        "Strategic calendar management"
      ]
    },
    {
      factor: "Average Booking Value",
      description: "Revenue per booking session",
      target: "₱2,000-5,000",
      improvements: [
        "Bundle related items together",
        "Encourage longer rental periods",
        "Add premium accessories",
        "Offer delivery services"
      ]
    },
    {
      factor: "Customer Lifetime Value",
      description: "Total revenue per customer",
      target: "₱5,000-15,000",
      improvements: [
        "Exceptional service quality",
        "Multiple item offerings",
        "Loyalty programs",
        "Regular communication"
      ]
    },
    {
      factor: "Profit Margin",
      description: "Profit after all expenses",
      target: "70-85%",
      improvements: [
        "Minimize maintenance costs",
        "Optimize delivery efficiency",
        "Reduce damage through screening",
        "Smart tax planning"
      ]
    }
  ]

  const seasonalOpportunities = [
    {
      season: "Summer (March-May)",
      demand: "Outdoor & Recreation",
      items: ["Camping gear", "Sports equipment", "Beach accessories", "Outdoor cameras"],
      strategy: "Increase inventory 2 months before peak season"
    },
    {
      season: "Rainy Season (June-Nov)",
      demand: "Indoor & Professional",
      items: ["Indoor photography equipment", "Gaming consoles", "Professional tools", "Indoor fitness"],
      strategy: "Promote indoor alternatives and waterproof items"
    },
    {
      season: "Holidays (Dec-Jan)",
      demand: "Events & Celebrations",
      items: ["Party supplies", "Decorations", "Photography gear", "Audio equipment"],
      strategy: "Price premium and book early for events"
    },
    {
      season: "Wedding Season (Oct-Feb)",
      demand: "Wedding Essentials",
      items: ["Photography equipment", "Decorations", "Audio systems", "Transportation"],
      strategy: "Create wedding packages with premium pricing"
    }
  ]

  const advancedTactics = [
    {
      tactic: "Dynamic Pricing",
      difficulty: "Advanced",
      description: "Adjust prices based on demand patterns",
      implementation: [
        "Track booking patterns and demand cycles",
        "Increase prices during peak times (20-50%)",
        "Offer discounts during slow periods",
        "Use pricing tools or spreadsheets",
        "Monitor competitor pricing changes"
      ]
    },
    {
      tactic: "Inventory Optimization",
      difficulty: "Intermediate",
      description: "Focus on high-ROI items",
      implementation: [
        "Calculate ROI for each item monthly",
        "Retire low-performing items",
        "Invest profits in high-demand categories",
        "Track utilization rates by category",
        "Consider item lifecycle and depreciation"
      ]
    },
    {
      tactic: "Customer Segmentation",
      difficulty: "Advanced",
      description: "Tailor offerings to customer types",
      implementation: [
        "Identify customer personas (hobbyists, professionals, event planners)",
        "Create targeted bundles for each segment",
        "Adjust communication style per segment",
        "Develop loyalty programs for high-value customers",
        "Track customer behavior and preferences"
      ]
    }
  ]

  const performanceMetrics = [
    {
      metric: "Monthly Revenue",
      calculation: "Total bookings × Average booking value",
      target: "₱20,000-50,000+",
      tracking: "Monitor monthly trends and growth"
    },
    {
      metric: "Booking Conversion Rate",
      calculation: "Bookings ÷ Profile views × 100",
      target: "15-25%",
      tracking: "Optimize listings if below 15%"
    },
    {
      metric: "Average Response Time",
      calculation: "Time between inquiry and response",
      target: "Under 2 hours",
      tracking: "Fast responses increase bookings"
    },
    {
      metric: "Customer Rating",
      calculation: "Average of all review scores",
      target: "4.8+ stars",
      tracking: "Maintain through excellent service"
    }
  ]

  const commonMistakes = [
    {
      mistake: "Underpricing to Get Bookings",
      impact: "Low profits, unsustainable business",
      solution: "Research market rates, price for value"
    },
    {
      mistake: "Neglecting Item Maintenance",
      impact: "Poor reviews, damaged reputation",
      solution: "Regular cleaning and maintenance schedule"
    },
    {
      mistake: "Poor Communication",
      impact: "Lost bookings, bad reviews",
      solution: "Respond quickly and professionally"
    },
    {
      mistake: "Limited Availability",
      impact: "Missed earning opportunities",
      solution: "Optimize calendar, offer flexible scheduling"
    },
    {
      mistake: "Not Tracking Performance",
      impact: "Cannot optimize or improve",
      solution: "Monitor metrics monthly, adjust strategy"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <TrendingUp className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Maximizing Earnings</h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Advanced strategies to grow your rental income and build a profitable business
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

          {/* Earning Potential */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 text-blue-600 mr-2" />
                Earning Potential on RenThing
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">₱25,000</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average monthly earnings</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">₱75,000</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Top earners monthly</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">200%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">ROI on quality items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Core Strategies */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Core Earning Strategies
            </h2>
            <div className="space-y-6">
              {earningStrategies.map((strategy, index) => {
                const IconComponent = strategy.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{strategy.strategy}</CardTitle>
                            <CardDescription>{strategy.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={strategy.impact === 'High' ? 'destructive' : 'secondary'}>
                            {strategy.impact} Impact
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{strategy.potentialIncrease}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-16">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Tactics:</h4>
                        <ul className="space-y-2">
                          {strategy.tactics.map((tactic, tacticIndex) => (
                            <li key={tacticIndex} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{tactic}</span>
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

          {/* Profitability Factors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-6 h-6 text-blue-600 mr-2" />
                Key Profitability Factors
              </CardTitle>
              <CardDescription>
                Monitor and optimize these metrics for maximum earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profitabilityFactors.map((factor, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">{factor.factor}</h4>
                      <Badge variant="outline">Target: {factor.target}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{factor.description}</p>
                    <div>
                      <h5 className="text-sm font-medium text-blue-600 mb-2">Improvements:</h5>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        {factor.improvements.map((improvement, improvementIndex) => (
                          <li key={improvementIndex}>• {improvement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Opportunities */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Seasonal Earning Opportunities
            </h2>
            <div className="grid gap-6">
              {seasonalOpportunities.map((season, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                        {season.season}
                      </CardTitle>
                      <Badge variant="outline">{season.demand}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">High-Demand Items:</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                          {season.items.map((item, itemIndex) => (
                            <li key={itemIndex}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white mb-2">Strategy:</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{season.strategy}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Advanced Tactics */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Advanced Earning Tactics
            </h2>
            <div className="space-y-6">
              {advancedTactics.map((tactic, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{tactic.tactic}</CardTitle>
                      <Badge variant={tactic.difficulty === 'Advanced' ? 'destructive' : 'default'}>
                        {tactic.difficulty}
                      </Badge>
                    </div>
                    <CardDescription>{tactic.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3">Implementation Steps:</h5>
                    <ul className="space-y-2">
                      {tactic.implementation.map((step, stepIndex) => (
                        <li key={stepIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{step}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="w-6 h-6 text-blue-600 mr-2" />
                Track Your Performance
              </CardTitle>
              <CardDescription>
                Monitor these metrics to optimize your earnings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceMetrics.map((metric, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-gray-900 dark:text-white">{metric.metric}</h4>
                      <Badge variant="outline">{metric.target}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      <strong>How to calculate:</strong> {metric.calculation}
                    </p>
                    <p className="text-sm text-blue-600">
                      <strong>Tracking tip:</strong> {metric.tracking}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 text-red-600 mr-2" />
                Avoid These Common Mistakes
              </CardTitle>
              <CardDescription>
                Learn from others' mistakes to maximize your success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonMistakes.map((mistake, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{mistake.mistake}</h4>
                    <p className="text-sm text-red-600 mb-2">Impact: {mistake.impact}</p>
                    <p className="text-sm text-green-600">Solution: {mistake.solution}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Plan */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Start Maximizing Your Earnings Today</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Apply these strategies systematically to build a profitable rental business on RenThing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/help/creating-listings">
                  <Star className="w-4 h-4 mr-2" />
                  Optimize My Listings
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help/pricing-guide">
                  Improve My Pricing
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}