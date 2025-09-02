import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar,
  Clock,
  CreditCard,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Shield
} from "lucide-react"

export default function CancellationPolicyPage() {
  const cancellationTypes = [
    {
      title: "Free Cancellation",
      icon: CheckCircle,
      timeframe: "24+ hours before rental",
      refund: "100% refund",
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      description: "Cancel without any penalties",
      details: [
        "Full refund of rental cost",
        "Service fees refunded",
        "No questions asked",
        "Automatic processing within 3-5 business days",
        "Applies to most bookings"
      ]
    },
    {
      title: "Moderate Cancellation",
      icon: Clock,
      timeframe: "Less than 24 hours",
      refund: "50% refund",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      description: "Partial refund for short notice",
      details: [
        "50% of rental cost refunded",
        "Service fees non-refundable",
        "Compensates owner for lost booking opportunity",
        "Processed within 3-5 business days",
        "Exceptions may apply for emergencies"
      ]
    },
    {
      title: "No Refund",
      icon: AlertCircle,
      timeframe: "After rental starts",
      refund: "No refund",
      color: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      description: "No refund once rental begins",
      details: [
        "No refund for early returns",
        "Owner may offer goodwill refund",
        "Insurance claims may apply",
        "Contact support for exceptional circumstances",
        "Reviews your specific situation"
      ]
    }
  ]

  const ownerCancellations = [
    {
      scenario: "Owner cancels with 24+ hours notice",
      consequence: "Full refund + ₱500 credit for inconvenience"
    },
    {
      scenario: "Owner cancels within 24 hours",
      consequence: "Full refund + ₱1000 credit + owner penalty"
    },
    {
      scenario: "Item unavailable at pickup",
      consequence: "Full refund + ₱1000 credit + help finding alternative"
    },
    {
      scenario: "Owner repeatedly cancels",
      consequence: "Account review and potential suspension"
    }
  ]

  const specialCircumstances = [
    {
      title: "Medical Emergencies",
      icon: Shield,
      description: "Documented medical emergencies may qualify for full refund regardless of timing"
    },
    {
      title: "Natural Disasters",
      icon: AlertCircle,
      description: "Weather-related or natural disaster cancellations receive full refunds"
    },
    {
      title: "Travel Restrictions",
      icon: Calendar,
      description: "Government-imposed travel restrictions may qualify for full refunds"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <RefreshCw className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Cancellation Policy</h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Understanding our cancellation terms, refund policies, and what happens when plans change
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

          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                Cancellation Overview
              </CardTitle>
              <CardDescription>
                Our cancellation policy is designed to be fair to both renters and owners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">Key Points:</h3>
                <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                  <li>• Free cancellation 24+ hours before rental start</li>
                  <li>• Partial refunds for shorter notice cancellations</li>
                  <li>• Owner cancellations include compensation</li>
                  <li>• Special circumstances considered case-by-case</li>
                  <li>• All refunds processed within 3-5 business days</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Cancellation Types */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Renter Cancellation Policies
            </h2>
            <div className="space-y-6">
              {cancellationTypes.map((type, index) => {
                const IconComponent = type.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{type.title}</CardTitle>
                            <CardDescription>{type.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={type.color}>
                            {type.refund}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{type.timeframe}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-16">
                        <ul className="space-y-2">
                          {type.details.map((detail, detailIndex) => (
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

          {/* Owner Cancellations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-2" />
                When Owners Cancel
              </CardTitle>
              <CardDescription>
                What happens if an owner needs to cancel your booking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ownerCancellations.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{item.scenario}</h4>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.consequence}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Special Circumstances */}
          <Card>
            <CardHeader>
              <CardTitle>Special Circumstances</CardTitle>
              <CardDescription>
                Exceptional situations that may qualify for different treatment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {specialCircumstances.map((circumstance, index) => {
                  const IconComponent = circumstance.icon
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <IconComponent className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{circumstance.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{circumstance.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* How to Cancel */}
          <Card>
            <CardHeader>
              <CardTitle>How to Cancel Your Booking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <span className="text-sm font-medium text-blue-600">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Go to Your Bookings</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Navigate to "My Bookings" in your account</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <span className="text-sm font-medium text-blue-600">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Find Your Booking</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Locate the booking you want to cancel</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <span className="text-sm font-medium text-blue-600">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Click Cancel</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Select "Cancel Booking" and confirm</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                    <span className="text-sm font-medium text-blue-600">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Receive Refund</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Your refund will be processed automatically</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Need Help with Cancellation?</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              If you have questions about cancelling or need assistance with special circumstances, our support team is here to help.
            </p>
            <Button asChild>
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