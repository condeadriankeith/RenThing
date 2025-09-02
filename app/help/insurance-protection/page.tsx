import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield,
  Umbrella,
  FileText,
  DollarSign,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Clock,
  Phone
} from "lucide-react"

export default function InsuranceProtectionPage() {
  const coverageOptions = [
    {
      name: "Basic Protection",
      price: "Free",
      coverage: "Up to ₱5,000",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      description: "Automatic coverage for all rentals",
      features: [
        "Accidental damage coverage",
        "Theft protection",
        "Basic liability coverage",
        "24/7 claims support",
        "No additional cost"
      ],
      limitations: [
        "₱500 deductible applies",
        "Excludes intentional damage",
        "Coverage limited to item value"
      ]
    },
    {
      name: "Premium Protection",
      price: "₱50-200",
      coverage: "Up to ₱50,000",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      description: "Enhanced coverage for high-value items",
      features: [
        "Extended damage coverage",
        "Zero deductible",
        "Replacement value coverage",
        "Priority claims processing",
        "Personal liability protection"
      ],
      limitations: [
        "Additional cost based on item value",
        "Pre-existing damage not covered",
        "Some exclusions apply"
      ]
    }
  ]

  const claimsProcess = [
    {
      step: 1,
      title: "Report Incident",
      description: "Report damage or theft immediately",
      icon: Phone,
      timeframe: "Within 24 hours",
      details: [
        "Contact us through the app or website",
        "Provide detailed description of incident",
        "Take photos of any damage",
        "Fill out incident report form",
        "Notify local authorities if theft occurred"
      ]
    },
    {
      step: 2,
      title: "Documentation",
      description: "Gather and submit required documents",
      icon: FileText,
      timeframe: "Within 48 hours",
      details: [
        "Submit photos of damage or incident scene",
        "Provide police report (for theft cases)",
        "Include original rental agreement",
        "Submit receipts or proof of value",
        "Complete claim forms"
      ]
    },
    {
      step: 3,
      title: "Assessment",
      description: "Our team reviews your claim",
      icon: Shield,
      timeframe: "3-5 business days",
      details: [
        "Claims team reviews documentation",
        "May request additional information",
        "Expert assessment if needed",
        "Coverage determination made",
        "You'll receive update notifications"
      ]
    },
    {
      step: 4,
      title: "Resolution",
      description: "Claim approved and payment processed",
      icon: DollarSign,
      timeframe: "1-2 weeks",
      details: [
        "Approved claims processed for payment",
        "Funds transferred to your account",
        "Repair arrangements coordinated",
        "Replacement items sourced if needed",
        "Case closed notification sent"
      ]
    }
  ]

  const coveredIncidents = [
    {
      type: "Accidental Damage",
      description: "Unintentional damage during normal use",
      examples: ["Dropped camera", "Spilled liquid on laptop", "Scratched furniture during move"]
    },
    {
      type: "Theft",
      description: "Item stolen during rental period",
      examples: ["Bike stolen while parked", "Tools taken from job site", "Equipment stolen from car"]
    },
    {
      type: "Fire/Natural Disasters",
      description: "Damage from uncontrollable events",
      examples: ["Fire damage", "Flood damage", "Earthquake damage"]
    }
  ]

  const notCovered = [
    {
      type: "Intentional Damage",
      description: "Deliberate destruction or misuse"
    },
    {
      type: "Normal Wear and Tear",
      description: "Expected deterioration from regular use"
    },
    {
      type: "Pre-existing Damage",
      description: "Damage that existed before rental"
    },
    {
      type: "Improper Use",
      description: "Using item outside intended purpose"
    }
  ]

  const preventionTips = [
    {
      title: "For Renters",
      tips: [
        "Inspect items thoroughly before accepting",
        "Use items only as intended",
        "Keep items secure when not in use",
        "Return items in original condition",
        "Report issues immediately"
      ]
    },
    {
      title: "For Owners",
      tips: [
        "Provide detailed item descriptions",
        "Include clear usage instructions",
        "Document item condition with photos",
        "Set appropriate rental terms",
        "Respond quickly to renter questions"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Umbrella className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Insurance & Protection</h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Comprehensive protection for renters and owners with our insurance coverage options
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
                <Shield className="w-6 h-6 text-blue-600 mr-2" />
                Protection Overview
              </CardTitle>
              <CardDescription>
                Every rental on RenThing includes protection for both renters and owners
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="font-medium">Auto-Protected</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Every rental covered</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="font-medium">Fast Claims</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">24/7 support available</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <DollarSign className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="font-medium">Fair Resolution</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Transparent process</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Coverage Options */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Coverage Options
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {coverageOptions.map((option, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{option.name}</CardTitle>
                        <CardDescription>{option.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={option.color}>
                          {option.price}
                        </Badge>
                        <p className="text-sm text-gray-500 mt-1">{option.coverage}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Features:</h4>
                        <ul className="space-y-1">
                          {option.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Limitations:</h4>
                        <ul className="space-y-1">
                          {option.limitations.map((limitation, limitationIndex) => (
                            <li key={limitationIndex} className="flex items-start space-x-2">
                              <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{limitation}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Claims Process */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              How to File a Claim
            </h2>
            <div className="space-y-6">
              {claimsProcess.map((step, index) => {
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
                            <Badge variant="secondary">{step.timeframe}</Badge>
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

          {/* What's Covered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-green-600">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  What's Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {coveredIncidents.map((incident, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{incident.type}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{incident.description}</p>
                      <div className="text-xs text-gray-500">
                        Examples: {incident.examples.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-600">
                  <AlertTriangle className="w-6 h-6 mr-2" />
                  Not Covered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {notCovered.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">{item.type}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Prevention Tips */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Prevention Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {preventionTips.map((category, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle>{category.title}</CardTitle>
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

          {/* Emergency Contact */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-2" />
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Emergency Claims</h3>
            </div>
            <p className="text-red-700 dark:text-red-300 mb-4">
              For urgent claims (theft, major damage, safety concerns), contact us immediately at:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button className="bg-red-600 hover:bg-red-700" asChild>
                <Link href="/contact">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Hotline
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help/reporting-issues">
                  Report Issue Online
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}