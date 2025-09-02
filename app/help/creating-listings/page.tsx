import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Plus,
  Camera,
  FileText,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  Star,
  Clock,
  MapPin,
  Eye,
  TrendingUp
} from "lucide-react"

export default function CreatingListingsPage() {
  const listingSteps = [
    {
      step: 1,
      title: "Item Information",
      description: "Provide detailed information about your item",
      icon: FileText,
      timeEstimate: "5 minutes",
      details: [
        "Choose the most appropriate category",
        "Write a clear, descriptive title",
        "Include brand, model, and year if applicable",
        "Specify item condition honestly",
        "Add detailed description with all features"
      ]
    },
    {
      step: 2,
      title: "Photos & Media",
      description: "Upload high-quality photos",
      icon: Camera,
      timeEstimate: "10 minutes",
      details: [
        "Take at least 5-8 clear photos",
        "Show different angles and close-ups",
        "Include all accessories and parts",
        "Use good lighting and clean backgrounds",
        "Add videos for complex items (optional)"
      ]
    },
    {
      step: 3,
      title: "Pricing & Availability",
      description: "Set competitive pricing and availability",
      icon: DollarSign,
      timeEstimate: "5 minutes",
      details: [
        "Research similar items for fair pricing",
        "Set daily, weekly, and monthly rates",
        "Configure your availability calendar",
        "Set minimum and maximum rental periods",
        "Choose delivery options and fees"
      ]
    },
    {
      step: 4,
      title: "Listing Settings",
      description: "Configure booking and rental terms",
      icon: Clock,
      timeEstimate: "5 minutes",
      details: [
        "Choose instant booking or request approval",
        "Set cancellation policy",
        "Add any special terms or requirements",
        "Configure security deposit if needed",
        "Set pickup/delivery locations"
      ]
    }
  ]

  const photoTips = [
    {
      category: "Lighting & Composition",
      tips: [
        "Use natural daylight when possible",
        "Avoid harsh shadows and glare",
        "Keep backgrounds clean and simple",
        "Take photos from multiple angles",
        "Include scale references when helpful"
      ]
    },
    {
      category: "What to Show",
      tips: [
        "Main item from different perspectives",
        "All included accessories and parts",
        "Close-ups of important features",
        "Any wear, damage, or imperfections",
        "Item in use (if safe and appropriate)"
      ]
    },
    {
      category: "Technical Quality",
      tips: [
        "Use high resolution (minimum 1024x768)",
        "Ensure photos are sharp and in focus",
        "Avoid over-editing or filters",
        "Keep file sizes reasonable",
        "Upload in supported formats (JPG, PNG)"
      ]
    }
  ]

  const descriptionGuide = [
    {
      section: "Opening Hook",
      description: "Start with the most compelling feature",
      example: "Professional DSLR camera perfect for weddings and events"
    },
    {
      section: "Key Features",
      description: "List the most important specifications",
      example: "24MP sensor, 4K video, image stabilization, weather-sealed"
    },
    {
      section: "Condition & History",
      description: "Be honest about condition and usage",
      example: "Excellent condition, used for 6 months, always stored in protective case"
    },
    {
      section: "What's Included",
      description: "List everything included in the rental",
      example: "Camera body, 2 lenses (24-70mm, 85mm), charger, 2 batteries, carrying case"
    },
    {
      section: "Usage Guidelines",
      description: "Specify any important usage requirements",
      example: "Please handle with care, avoid extreme weather, return fully charged"
    }
  ]

  const pricingStrategies = [
    {
      strategy: "Competitive Pricing",
      description: "Price similarly to comparable items",
      pros: ["Quick bookings", "Higher visibility"],
      cons: ["Lower profit margins"],
      bestFor: "New owners, common items"
    },
    {
      strategy: "Premium Pricing",
      description: "Price higher for unique or high-quality items",
      pros: ["Higher profits", "Attracts serious renters"],
      cons: ["Fewer bookings", "Longer listing times"],
      bestFor: "Unique items, professional equipment"
    },
    {
      strategy: "Dynamic Pricing",
      description: "Adjust prices based on demand and season",
      pros: ["Maximizes revenue", "Adapts to market"],
      cons: ["Requires monitoring", "Can confuse renters"],
      bestFor: "Seasonal items, experienced owners"
    }
  ]

  const optimizationTips = [
    {
      tip: "Use Keywords",
      description: "Include relevant search terms in your title and description"
    },
    {
      tip: "Update Regularly",
      description: "Keep your listing fresh with updated photos and information"
    },
    {
      tip: "Respond Quickly",
      description: "Fast responses to inquiries increase booking likelihood"
    },
    {
      tip: "Collect Reviews",
      description: "Encourage satisfied renters to leave positive reviews"
    },
    {
      tip: "Monitor Performance",
      description: "Track views, inquiries, and bookings to optimize"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Plus className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Creating Great Listings</h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Learn how to create compelling listings that attract renters and maximize your earnings
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

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-6 h-6 text-blue-600 mr-2" />
                Why Great Listings Matter
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">300%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">More views with quality photos</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">75%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Higher booking rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">50%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Better pricing power</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step-by-Step Guide */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Step-by-Step Listing Creation
            </h2>
            <div className="space-y-6">
              {listingSteps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge variant="outline" className="text-xs">
                                Step {step.step}
                              </Badge>
                              <CardTitle className="text-xl">{step.title}</CardTitle>
                            </div>
                            <Badge variant="secondary">{step.timeEstimate}</Badge>
                          </div>
                          <CardDescription className="mt-2">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-16">
                        <ul className="space-y-2">
                          {step.details.map((detail, detailIndex) => (
                            <li key={detailIndex} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{detail}</span>
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

          {/* Photo Guidelines */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Photo Guidelines
            </h2>
            <div className="grid gap-6">
              {photoTips.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Camera className="w-6 h-6 text-blue-600 mr-2" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.tips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Description Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-6 h-6 text-blue-600 mr-2" />
                Writing Effective Descriptions
              </CardTitle>
              <CardDescription>
                Structure your description to highlight key information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {descriptionGuide.map((section, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{section.section}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{section.description}</p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm font-mono">
                      "{section.example}"
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

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
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h5 className="font-medium text-green-600 mb-2">Pros:</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-400">
                          {strategy.pros.map((pro, proIndex) => (
                            <li key={proIndex}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-600 mb-2">Cons:</h5>
                        <ul className="text-sm text-gray-600 dark:text-gray-400">
                          {strategy.cons.map((con, conIndex) => (
                            <li key={conIndex}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-blue-600 mb-2">Best For:</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{strategy.bestFor}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Optimization Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-6 h-6 text-blue-600 mr-2" />
                Listing Optimization Tips
              </CardTitle>
              <CardDescription>
                Boost your listing's visibility and booking success
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {optimizationTips.map((tip, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{tip.tip}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{tip.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Ready to Create Your Listing?</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Start creating your first listing and begin earning from items you already own.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/list-item">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help/pricing-guide">
                  Pricing Guide
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}