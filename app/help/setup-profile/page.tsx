import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Camera, 
  MapPin, 
  Phone,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Star,
  Shield,
  Edit
} from "lucide-react"

export default function SetupProfilePage() {
  const profileSections = [
    {
      title: "Profile Photo",
      icon: Camera,
      importance: "Highly Recommended",
      color: "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
      description: "A good profile photo increases trust and booking success by 70%",
      tips: [
        "Use a clear, recent photo of yourself",
        "Smile and look friendly and approachable",
        "Ensure good lighting and high image quality",
        "Avoid group photos or photos with sunglasses",
        "Keep it professional but friendly"
      ]
    },
    {
      title: "Personal Information",
      icon: User,
      importance: "Required",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      description: "Basic information that helps others connect with you",
      tips: [
        "Use your real name for trust and verification",
        "Add a brief bio describing your interests",
        "Mention what you're looking to rent or offer",
        "Keep it friendly and personable",
        "Update your information regularly"
      ]
    },
    {
      title: "Contact Details",
      icon: Phone,
      importance: "Required for Verification",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      description: "Secure contact information for bookings and verification",
      tips: [
        "Verify your phone number for account security",
        "Keep your email address up to date",
        "Enable notifications for booking updates",
        "Set communication preferences",
        "Ensure contact details are accessible"
      ]
    },
    {
      title: "Location & Address",
      icon: MapPin,
      importance: "Recommended",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
      description: "Help others find items near you and arrange pickups",
      tips: [
        "Add your general location (city/area)",
        "You can hide specific address until booking",
        "Update location if you move",
        "Consider multiple locations if applicable",
        "Enable location services for better matches"
      ]
    }
  ]

  const verificationSteps = [
    {
      step: "Email Verification",
      status: "Required",
      description: "Verify your email address to secure your account",
      icon: CheckCircle
    },
    {
      step: "Phone Verification",
      status: "Recommended",
      description: "Add and verify your phone number for better security",
      icon: Shield
    },
    {
      step: "Identity Verification",
      status: "Optional",
      description: "Upload ID for higher trust score and access to premium items",
      icon: Star
    }
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
                Setting Up Your Profile
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                Create a compelling profile that builds trust and helps you connect with the RenThing community.
              </p>
              <Badge variant="secondary" className="text-sm">
                Estimated time: 10-15 minutes
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Profile Importance */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                Why Your Profile Matters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">70%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Higher booking success with complete profile</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">85%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">More trust with verified information</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">60%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Faster responses from owners</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Sections */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Complete Your Profile
            </h2>
            <div className="space-y-6">
              {profileSections.map((section, index) => {
                const IconComponent = section.icon
                return (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <IconComponent className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{section.title}</CardTitle>
                            <CardDescription>{section.description}</CardDescription>
                          </div>
                        </div>
                        <Badge className={section.color}>
                          {section.importance}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="ml-16">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Best Practices:</h4>
                        <ul className="space-y-2">
                          {section.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-start space-x-2">
                              <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">{tip}</span>
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

          {/* Verification Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-6 h-6 text-blue-600 mr-2" />
                Account Verification
              </CardTitle>
              <CardDescription>
                Increase your trust score and access more features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {verificationSteps.map((step, index) => {
                  const IconComponent = step.icon
                  return (
                    <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <IconComponent className="w-6 h-6 text-green-600" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 dark:text-white">{step.step}</h4>
                          <Badge variant={step.status === 'Required' ? 'destructive' : step.status === 'Recommended' ? 'default' : 'secondary'}>
                            {step.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Profile Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-600 dark:text-green-400">
                  ✅ Do This
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Use recent, clear photos</li>
                  <li>• Write an engaging bio</li>
                  <li>• Verify your contact information</li>
                  <li>• Keep information up to date</li>
                  <li>• Respond to messages promptly</li>
                  <li>• Be honest and transparent</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-600 dark:text-red-400">
                  ❌ Avoid This
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Using fake or outdated photos</li>
                  <li>• Leaving sections blank</li>
                  <li>• Using inappropriate content</li>
                  <li>• Sharing too much personal info</li>
                  <li>• Forgetting to verify email/phone</li>
                  <li>• Using poor quality images</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Quick Access */}
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="text-purple-800 dark:text-purple-200">
                Ready to Update Your Profile?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" asChild>
                  <Link href="/profile">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit My Profile
                  </Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/help/browsing-items">
                    Continue to Browse Items
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Need help setting up your profile?
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