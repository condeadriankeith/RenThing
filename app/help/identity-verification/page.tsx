import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Shield,
  UserCheck,
  Camera,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  Star
} from "lucide-react"

export default function IdentityVerificationPage() {
  const verificationLevels = [
    {
      level: "Email Verification",
      status: "Required",
      icon: CheckCircle,
      color: "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400",
      description: "Basic account security",
      benefits: [
        "Account activation",
        "Password recovery",
        "Security notifications",
        "Basic platform access"
      ],
      timeToComplete: "2 minutes"
    },
    {
      level: "Phone Verification",
      status: "Recommended",
      icon: Shield,
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      description: "Enhanced security with 2FA",
      benefits: [
        "Two-factor authentication",
        "Booking confirmations via SMS",
        "Higher trust score",
        "Access to more listings"
      ],
      timeToComplete: "5 minutes"
    },
    {
      level: "Identity Document",
      status: "Optional",
      icon: FileText,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      description: "Government-issued ID verification",
      benefits: [
        "Maximum trust level",
        "Access to premium items",
        "Lower security deposits",
        "Priority customer support"
      ],
      timeToComplete: "10 minutes"
    }
  ]

  const verificationSteps = [
    {
      step: 1,
      title: "Choose Verification Type",
      description: "Select the level of verification you want to complete",
      icon: UserCheck,
      details: [
        "Start with email verification (required)",
        "Add phone verification for better security",
        "Complete ID verification for maximum benefits",
        "Each level builds on the previous one"
      ]
    },
    {
      step: 2,
      title: "Provide Information",
      description: "Submit the required information or documents",
      icon: FileText,
      details: [
        "Email: Click verification link sent to your inbox",
        "Phone: Enter code sent via SMS",
        "ID: Upload clear photos of government-issued ID",
        "All data is encrypted and securely stored"
      ]
    },
    {
      step: 3,
      title: "Verification Review",
      description: "Our team reviews your submission",
      icon: Clock,
      details: [
        "Email: Instant verification",
        "Phone: Instant verification",
        "ID: 1-3 business days review",
        "You'll receive confirmation via email"
      ]
    },
    {
      step: 4,
      title: "Verification Complete",
      description: "Enjoy enhanced platform access",
      icon: Star,
      details: [
        "Verification badges on your profile",
        "Increased trust score",
        "Access to exclusive features",
        "Better booking success rate"
      ]
    }
  ]

  const acceptedDocuments = [
    {
      type: "Philippine Passport",
      description: "Current, unexpired Philippine passport"
    },
    {
      type: "Driver's License",
      description: "Valid Philippine driver's license"
    },
    {
      type: "National ID",
      description: "Philippine National ID (PhilID)"
    },
    {
      type: "Voter's ID",
      description: "Current voter's identification card"
    },
    {
      type: "TIN ID",
      description: "Tax Identification Number card"
    },
    {
      type: "SSS ID",
      description: "Social Security System ID"
    }
  ]

  const privacyFeatures = [
    {
      title: "Data Encryption",
      description: "All personal information is encrypted using bank-level security"
    },
    {
      title: "Limited Access",
      description: "Only authorized verification team members can access your documents"
    },
    {
      title: "Secure Storage",
      description: "Documents stored in secure, compliant cloud infrastructure"
    },
    {
      title: "No Sharing",
      description: "Your verification data is never shared with other users or third parties"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <UserCheck className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Identity Verification</h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Build trust and unlock platform features through secure identity verification
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

          {/* Why Verify */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-2" />
                Why Verify Your Identity?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Higher booking success</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">70%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Faster approval times</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">90%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">More trust from owners</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Levels */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Verification Levels
            </h2>
            <div className="space-y-6">
              {verificationLevels.map((level, index) => {
                const IconComponent = level.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <IconComponent className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{level.level}</CardTitle>
                            <CardDescription>{level.description}</CardDescription>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={level.color}>
                            {level.status}
                          </Badge>
                          <p className="text-sm text-gray-500 mt-1">{level.timeToComplete}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-16">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Benefits:</h4>
                        <ul className="space-y-2">
                          {level.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
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

          {/* Verification Process */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Verification Process
            </h2>
            <div className="space-y-6">
              {verificationSteps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                          <IconComponent className="w-6 h-6 text-blue-600" />
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

          {/* Accepted Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-6 h-6 text-blue-600 mr-2" />
                Accepted Identity Documents
              </CardTitle>
              <CardDescription>
                Government-issued documents we accept for identity verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {acceptedDocuments.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 dark:text-white">{doc.type}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{doc.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Photo Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Camera className="w-6 h-6 text-blue-600 mr-2" />
                Photo Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-green-600 mb-3">✅ Good Photos</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Clear, high-resolution images</li>
                    <li>• All text is readable</li>
                    <li>• Good lighting, no shadows</li>
                    <li>• Entire document visible</li>
                    <li>• No glare or reflections</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-red-600 mb-3">❌ Avoid</h4>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>• Blurry or pixelated images</li>
                    <li>• Partially obscured documents</li>
                    <li>• Screenshots of photos</li>
                    <li>• Expired documents</li>
                    <li>• Damaged or torn IDs</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-2" />
                Privacy & Security
              </CardTitle>
              <CardDescription>
                How we protect your personal information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {privacyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Start Verification */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Ready to Get Verified?</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              Start with email verification and work your way up to full identity verification for maximum benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/profile/verification">
                  Start Verification
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact">
                  Have Questions?
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}