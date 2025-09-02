import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  CreditCard, 
  MessageCircle, 
  CheckCircle,
  Clock,
  MapPin,
  User,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Shield,
  DollarSign
} from "lucide-react"

export default function BookingGuidePage() {
  const bookingSteps = [
    {
      step: 1,
      title: "Find Your Item",
      icon: Calendar,
      description: "Browse or search for the item you want to rent",
      details: [
        "Use the search bar or browse categories",
        "Check item availability on your desired dates",
        "Read the item description and reviews",
        "View photos and item condition details",
        "Check the owner's profile and ratings"
      ]
    },
    {
      step: 2,
      title: "Select Dates & Details",
      icon: Calendar,
      description: "Choose your rental period and options",
      details: [
        "Select your start and end dates",
        "Choose pickup or delivery option",
        "Add any special requests or notes",
        "Review the total cost breakdown",
        "Check cancellation policy"
      ]
    },
    {
      step: 3,
      title: "Contact the Owner",
      icon: MessageCircle,
      description: "Communicate with the owner before booking",
      details: [
        "Send a message introducing yourself",
        "Ask any questions about the item",
        "Confirm availability and details",
        "Discuss pickup/delivery arrangements",
        "Clarify any special requirements"
      ]
    },
    {
      step: 4,
      title: "Complete Your Booking",
      icon: CreditCard,
      description: "Secure your reservation with payment",
      details: [
        "Review all booking details carefully",
        "Enter your payment information",
        "Confirm pickup/delivery address",
        "Add emergency contact information",
        "Submit your booking request"
      ]
    },
    {
      step: 5,
      title: "Confirmation & Pickup",
      icon: CheckCircle,
      description: "Finalize details and collect your item",
      details: [
        "Receive booking confirmation email",
        "Get owner's contact information",
        "Coordinate pickup/delivery time",
        "Inspect item condition upon receipt",
        "Start enjoying your rental!"
      ]
    }
  ]

  const bookingTypes = [
    {
      type: "Instant Booking",
      icon: Clock,
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      description: "Book immediately without waiting for approval",
      features: [
        "Immediate confirmation",
        "No waiting for owner approval", 
        "Automated booking process",
        "Popular with verified owners",
        "Perfect for last-minute needs"
      ]
    },
    {
      type: "Request to Book",
      icon: User,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      description: "Send a request and wait for owner approval",
      features: [
        "Owner reviews your request",
        "Response within 24 hours",
        "Opportunity to ask questions",
        "More personalized service",
        "Better for special requirements"
      ]
    }
  ]

  const costBreakdown = [
    { item: "Base rental cost", description: "Daily/weekly rate set by owner" },
    { item: "Service fee", description: "RenThing platform fee (typically 5%)" },
    { item: "Delivery fee", description: "Optional delivery charge (if applicable)" },
    { item: "Security deposit", description: "Refundable deposit for high-value items" },
    { item: "Insurance", description: "Optional rental protection (recommended)" }
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
                How to Book an Item
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                Learn how to successfully book and rent items on RenThing with our comprehensive step-by-step guide.
              </p>
              <Badge variant="secondary" className="text-sm">
                Average booking time: 5-10 minutes
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Booking Types */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Types of Bookings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookingTypes.map((type, index) => {
                const IconComponent = type.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${type.color}`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{type.type}</CardTitle>
                          <CardDescription>{type.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {type.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Step-by-step Guide */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Booking Process
            </h2>
            <div className="space-y-6">
              {bookingSteps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <Card key={index} className="relative">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <IconComponent className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-xs">
                              Step {step.step}
                            </Badge>
                            <CardTitle className="text-xl">{step.title}</CardTitle>
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
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
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

          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-6 h-6 text-green-600 mr-2" />
                Understanding Booking Costs
              </CardTitle>
              <CardDescription>
                Transparent pricing with no hidden fees
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {costBreakdown.map((cost, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{cost.item}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{cost.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Important Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-green-600 dark:text-green-400">
                  ✅ Booking Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Read item descriptions thoroughly</li>
                  <li>• Check owner ratings and reviews</li>
                  <li>• Communicate clearly with owners</li>
                  <li>• Book in advance for popular items</li>
                  <li>• Take photos during pickup/return</li>
                  <li>• Follow pickup and return times</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-red-600 dark:text-red-400">
                  ⚠️ Common Booking Mistakes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Not reading cancellation policies</li>
                  <li>• Skipping item condition checks</li>
                  <li>• Poor communication with owners</li>
                  <li>• Booking without asking questions</li>
                  <li>• Not confirming pickup details</li>
                  <li>• Ignoring delivery restrictions</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Safety & Protection */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="flex items-center text-blue-800 dark:text-blue-200">
                <Shield className="w-6 h-6 mr-2" />
                Your Booking is Protected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium">Secure Payments</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Your payment is protected</div>
                </div>
                <div className="text-center">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium">Insurance Available</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Optional protection plans</div>
                </div>
                <div className="text-center">
                  <MessageCircle className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium">24/7 Support</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Help when you need it</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">
                Ready to Make Your First Booking?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="h-auto p-4" asChild>
                  <Link href="/browse">
                    <div className="text-left">
                      <div className="font-medium">Start Browsing</div>
                      <div className="text-sm opacity-90">Find items to rent</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
                <Button variant="outline" className="h-auto p-4" asChild>
                  <Link href="/help/payment-help">
                    <div className="text-left">
                      <div className="font-medium">Payment Help</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Learn about payments</div>
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
              Need help with your booking?
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