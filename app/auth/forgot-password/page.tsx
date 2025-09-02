import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { 
  Mail, 
  ArrowLeft, 
  CheckCircle, 
  Clock,
  Shield
} from "lucide-react"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reset Your Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        {/* Reset Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Password Reset
            </CardTitle>
            <CardDescription>
              We'll send a secure reset link to your email address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="form-input-mobile"
                  required
                />
              </div>
              
              <Button type="submit" className="w-full form-button-mobile">
                Send Reset Link
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What happens next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Check your email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We'll send a password reset link to your email address
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Click the link</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    The reset link will be valid for 1 hour
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Create new password</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose a strong, secure password for your account
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-start">
            <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-800 dark:text-blue-200">Security Notice</h4>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                For your security, password reset links expire after 1 hour. 
                If you don't receive an email, check your spam folder or try again.
              </p>
            </div>
          </div>
        </div>

        {/* Troubleshooting */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Having trouble?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• Check your spam or junk mail folder</p>
              <p>• Make sure you entered the correct email address</p>
              <p>• Wait a few minutes for the email to arrive</p>
              <p>• Make sure your email account is accessible</p>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Still having problems? Our support team can help.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Back to Login */}
        <div className="text-center space-y-4">
          <Separator />
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Remember your password?
            </p>
            <Button variant="outline" asChild>
              <Link href="/auth/login" className="inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </Button>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              Don't have an account?
            </p>
            <Button asChild>
              <Link href="/auth/register">
                Create Account
              </Link>
            </Button>
          </div>
        </div>

        {/* Help Links */}
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <Link href="/help" className="hover:text-blue-600 dark:hover:text-blue-400">
            Help Center
          </Link>
          <span className="mx-2">•</span>
          <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
            Privacy Policy
          </Link>
          <span className="mx-2">•</span>
          <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  )
}