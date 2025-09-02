import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  Mail, 
  Lock, 
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Smartphone
} from "lucide-react"

export default function CreateAccountPage() {
  const steps = [
    {
      step: 1,
      title: "Visit the Sign Up Page",
      description: "Navigate to RenThing and click the 'Sign Up' button in the top right corner.",
      icon: User,
      details: [
        "Look for the 'Sign Up' button in the header navigation",
        "Or visit the sign up page directly from the login page",
        "The sign up form will appear on screen"
      ]
    },
    {
      step: 2,
      title: "Enter Your Information",
      description: "Fill in your basic details to create your account.",
      icon: Mail,
      details: [
        "Enter your full name (first and last name)",
        "Provide a valid email address",
        "Create a strong password (at least 8 characters)",
        "Confirm your password"
      ]
    },
    {
      step: 3,
      title: "Verify Your Email",
      description: "Check your email and click the verification link.",
      icon: CheckCircle,
      details: [
        "Check your inbox for a verification email",
        "Look in spam/junk folder if not received within 5 minutes",
        "Click the verification link in the email",
        "You'll be redirected back to RenThing"
      ]
    },
    {
      step: 4,
      title: "Complete Your Profile",
      description: "Add additional information to your profile.",
      icon: User,
      details: [
        "Add a profile photo (optional but recommended)",
        "Provide your phone number for verification",
        "Add your location/address",
        "Write a brief bio about yourself"
      ]
    }
  ]

  const requirements = [
    { 
      requirement: "Valid Email Address", 
      description: "You'll need access to this email for verification and important notifications",
      icon: Mail 
    },
    { 
      requirement: "Strong Password", 
      description: "Minimum 8 characters with a mix of letters, numbers, and symbols",
      icon: Lock 
    },
    { 
      requirement: "Phone Number", 
      description: "For account verification and security (added during profile setup)",
      icon: Smartphone 
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
                How to Create an Account
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
                Get started with RenThing by creating your free account in just a few simple steps.
              </p>
              <Badge variant="secondary" className="text-sm">
                Estimated time: 3-5 minutes
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Quick Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                What You'll Need
              </CardTitle>
              <CardDescription>
                Before you start, make sure you have these items ready
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {requirements.map((req, index) => {
                  const IconComponent = req.icon
                  return (
                    <div key={index} className="flex items-start space-x-3 p-4 border rounded-lg">
                      <IconComponent className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{req.requirement}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{req.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Step-by-step Guide */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Step-by-Step Guide
            </h2>
            <div className="space-y-6">
              {steps.map((step, index) => {
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

          {/* Tips & Best Practices */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="w-6 h-6 text-orange-600 mr-2" />
                Tips for Account Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Password Tips</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Use at least 8 characters</li>
                    <li>• Include upper and lowercase letters</li>
                    <li>• Add numbers and special characters</li>
                    <li>• Avoid personal information</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Email Tips</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Use an email you check regularly</li>
                    <li>• Make sure it's accessible long-term</li>
                    <li>• Check spam folder for verification</li>
                    <li>• Keep your email secure</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Troubleshooting */}
          <Card>
            <CardHeader>
              <CardTitle>Common Issues & Solutions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    ❌ "Email already exists" error
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    This means you already have an account with this email address.
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    → Try signing in instead, or use the forgot password option if needed.
                  </p>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    ❌ Didn't receive verification email
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Check your spam/junk folder and wait up to 10 minutes.
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    → Contact support if still not received after 10 minutes.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">
                🎉 Account Created Successfully!
              </CardTitle>
              <CardDescription className="text-blue-700 dark:text-blue-300">
                Here's what you can do next to get the most out of RenThing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button className="justify-start h-auto p-4" variant="outline" asChild>
                  <Link href="/help/setup-profile">
                    <div className="text-left">
                      <div className="font-medium">Complete Your Profile</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Add photos and personal details</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
                <Button className="justify-start h-auto p-4" variant="outline" asChild>
                  <Link href="/help/browsing-items">
                    <div className="text-left">
                      <div className="font-medium">Start Browsing Items</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Find your first rental</div>
                    </div>
                    <ArrowRight className="w-4 h-4 ml-auto" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Need More Help */}
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Still having trouble creating your account?
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