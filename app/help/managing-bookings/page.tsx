import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar,
  MessageCircle,
  CheckCircle,
  Clock,
  ArrowLeft,
  MapPin,
  Star,
  AlertTriangle,
  Users,
  RefreshCw
} from "lucide-react"

export default function ManagingBookingsPage() {
  const bookingStages = [
    {
      stage: "Request Received",
      icon: MessageCircle,
      timeframe: "Respond within 24 hours",
      description: "New booking request arrives",
      tasks: [
        "Review renter's profile and reviews",
        "Check item availability for requested dates",
        "Assess pickup/delivery logistics",
        "Respond with acceptance or questions",
        "Suggest alternative dates if needed"
      ]
    },
    {
      stage: "Booking Confirmed",
      icon: CheckCircle,
      timeframe: "1-3 days before pickup",
      description: "Booking is accepted and paid",
      tasks: [
        "Send confirmation message to renter",
        "Provide detailed pickup instructions",
        "Share your contact information",
        "Prepare and clean the item",
        "Confirm final pickup details"
      ]
    },
    {
      stage: "Item Handover",
      icon: MapPin,
      timeframe: "At pickup time",
      description: "Item is transferred to renter",
      tasks: [
        "Meet at agreed location on time",
        "Inspect item together with renter",
        "Document current condition with photos",
        "Explain proper usage and care",
        "Confirm return date and location"
      ]
    },
    {
      stage: "During Rental",
      icon: Clock,
      timeframe: "Throughout rental period",
      description: "Item is with the renter",
      tasks: [
        "Be available for questions or issues",
        "Monitor rental progress if needed",
        "Provide support for any problems",
        "Send friendly check-in messages",
        "Prepare for item return"
      ]
    },
    {
      stage: "Item Return",
      icon: RefreshCw,
      timeframe: "At return time",
      description: "Item is returned by renter",
      tasks: [
        "Inspect item for damage or issues",
        "Compare to pre-rental photos",
        "Address any concerns immediately",
        "Confirm successful return in app",
        "Leave review for the renter"
      ]
    }
  ]

  const communicationTips = [
    {
      tip: "Respond Quickly",
      description: "Fast responses increase booking likelihood",
      example: "Aim to respond within 2-4 hours during business hours"
    },
    {
      tip: "Be Professional but Friendly",
      description: "Balance professionalism with approachability",
      example: "Hi Sarah! Thanks for your interest in my camera. I'd be happy to help with your event."
    },
    {
      tip: "Provide Clear Instructions",
      description: "Detailed pickup/return instructions prevent confusion",
      example: "Meet at Starbucks lobby, I'll be wearing a blue jacket and carrying the camera case"
    },
    {
      tip: "Set Expectations",
      description: "Clarify terms and conditions upfront",
      example: "Please return with battery charged and memory card empty"
    },
    {
      tip: "Stay Available",
      description: "Be reachable during rental period",
      example: "Feel free to text me at [number] if you have any questions"
    }
  ]

  const handoverChecklist = [
    {
      category: "Before Handover",
      items: [
        "Clean and inspect the item thoroughly",
        "Test all functions and features",
        "Charge batteries and prepare accessories",
        "Take photos of current condition",
        "Prepare instruction manuals or guides"
      ]
    },
    {
      category: "During Handover",
      items: [
        "Arrive on time at meeting location",
        "Verify renter's identity",
        "Demonstrate item usage if needed",
        "Document handover with photos",
        "Exchange contact information"
      ]
    },
    {
      category: "After Handover",
      items: [
        "Update booking status in app",
        "Send follow-up message with tips",
        "Set calendar reminder for return",
        "Be available for questions",
        "Monitor rental progress"
      ]
    }
  ]

  const commonIssues = [
    {
      issue: "Late Pickup/Return",
      prevention: "Confirm timing 24 hours before",
      solution: "Contact renter immediately, adjust schedule if needed"
    },
    {
      issue: "No-Show Renter",
      prevention: "Require confirmation day before",
      solution: "Wait 30 minutes, then contact support for cancellation"
    },
    {
      issue: "Item Damage",
      prevention: "Document condition thoroughly",
      solution: "Take photos, discuss with renter, file insurance claim if needed"
    },
    {
      issue: "Payment Issues",
      prevention: "Verify payment before handover",
      solution: "Contact RenThing support immediately"
    },
    {
      issue: "Renter Questions",
      prevention: "Provide comprehensive usage guide",
      solution: "Respond promptly with helpful guidance"
    }
  ]

  const calendarManagement = [
    {
      tip: "Block Personal Use",
      description: "Reserve dates when you need the item",
      action: "Mark calendar unavailable in advance"
    },
    {
      tip: "Buffer Time",
      description: "Allow time between bookings for maintenance",
      action: "Add 1-day buffer between rentals"
    },
    {
      tip: "Seasonal Adjustments",
      description: "Update availability based on demand patterns",
      action: "Open more dates during peak seasons"
    },
    {
      tip: "Regular Updates",
      description: "Keep calendar current to avoid conflicts",
      action: "Review and update weekly"
    }
  ]

  const reviewManagement = [
    {
      aspect: "Leave Timely Reviews",
      description: "Review renters within 48 hours of return",
      impact: "Builds trust and encourages future bookings"
    },
    {
      aspect: "Be Fair and Honest",
      description: "Provide balanced feedback based on experience",
      impact: "Maintains credibility in the community"
    },
    {
      aspect: "Respond to Reviews",
      description: "Reply professionally to reviews you receive",
      impact: "Shows engagement and professionalism"
    },
    {
      aspect: "Learn from Feedback",
      description: "Use reviews to improve your service",
      impact: "Continuous improvement leads to better ratings"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Calendar className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Managing Bookings</h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Master the booking process from request to return for successful rentals
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

          {/* Booking Success Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-6 h-6 text-blue-600 mr-2" />
                Booking Management Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Higher rebooking rate with good management</div>
                </div>
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">4.8</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Average rating with proper handling</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">50%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">More bookings with excellent service</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Stages */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Booking Management Stages
            </h2>
            <div className="space-y-6">
              {bookingStages.map((stage, index) => {
                const IconComponent = stage.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <IconComponent className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">{stage.stage}</CardTitle>
                            <Badge variant="secondary">{stage.timeframe}</Badge>
                          </div>
                          <CardDescription className="mt-2">
                            {stage.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-16">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Key Tasks:</h4>
                        <ul className="space-y-2">
                          {stage.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{task}</span>
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

          {/* Communication Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-6 h-6 text-blue-600 mr-2" />
                Communication Best Practices
              </CardTitle>
              <CardDescription>
                Effective communication leads to successful rentals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {communicationTips.map((tip, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{tip.tip}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tip.description}</p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm">
                      <strong>Example:</strong> {tip.example}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Handover Checklist */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Handover Checklist
            </h2>
            <div className="grid gap-6">
              {handoverChecklist.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {category.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Common Issues */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-orange-600 mr-2" />
                Common Issues & Solutions
              </CardTitle>
              <CardDescription>
                How to handle typical booking challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">{issue.issue}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-green-600 mb-1">Prevention:</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{issue.prevention}</p>
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-blue-600 mb-1">Solution:</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{issue.solution}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                Calendar Management Tips
              </CardTitle>
              <CardDescription>
                Keep your availability accurate and optimized
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calendarManagement.map((tip, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{tip.tip}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{tip.description}</p>
                    <p className="text-sm text-blue-600 font-medium">Action: {tip.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Review Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-6 h-6 text-blue-600 mr-2" />
                Review Management
              </CardTitle>
              <CardDescription>
                Build your reputation through thoughtful reviews
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reviewManagement.map((aspect, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">{aspect.aspect}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{aspect.description}</p>
                    <p className="text-sm text-green-600 font-medium">Impact: {aspect.impact}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Master Your Booking Management</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Excellent booking management is key to building a successful rental business and earning great reviews.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/my-bookings">
                  <Calendar className="w-4 h-4 mr-2" />
                  View My Bookings
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