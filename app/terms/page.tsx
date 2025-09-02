import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Shield, 
  CreditCard, 
  Users, 
  AlertTriangle,
  ArrowLeft
} from "lucide-react"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-blue-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Terms of Service
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6 max-w-3xl mx-auto">
              Please read these terms carefully before using RenThing. By using our service, you agree to be bound by these terms.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: January 1, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Quick Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Navigation</CardTitle>
              <CardDescription>Jump to any section of our Terms of Service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="#acceptance" className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="font-medium">Acceptance of Terms</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Agreement to our terms</div>
                </a>
                <a href="#services" className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="font-medium">Description of Services</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">What RenThing provides</div>
                </a>
                <a href="#user-responsibilities" className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="font-medium">User Responsibilities</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Your obligations</div>
                </a>
                <a href="#payments" className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <div className="font-medium">Payments & Fees</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Billing and payment terms</div>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Terms Content */}
          <div className="space-y-8">
            
            {/* Section 1 */}
            <section id="acceptance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="w-6 h-6 mr-2 text-blue-600" />
                    1. Acceptance of Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    By accessing and using RenThing ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    RenThing reserves the right to modify these terms at any time. Users will be notified of significant changes, 
                    and continued use of the service constitutes acceptance of modified terms.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Section 2 */}
            <section id="services">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-green-600" />
                    2. Description of Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    RenThing is a peer-to-peer rental marketplace that connects people who want to rent items with people who have items to rent. 
                    Our platform facilitates:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Item listing and discovery</li>
                    <li>Secure booking and payment processing</li>
                    <li>Communication between renters and owners</li>
                    <li>Dispute resolution support</li>
                    <li>Insurance coverage for qualifying rentals</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300">
                    RenThing does not own, control, offer, or provide any of the items listed on the platform. 
                    We act solely as a marketplace facilitator.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Section 3 */}
            <section id="user-responsibilities">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-6 h-6 mr-2 text-purple-600" />
                    3. User Responsibilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For All Users:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                      <li>Provide accurate and up-to-date information</li>
                      <li>Maintain the security of your account</li>
                      <li>Comply with all applicable laws and regulations</li>
                      <li>Treat other users with respect and courtesy</li>
                      <li>Report any violations or safety concerns</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Item Owners:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                      <li>Ensure items are safe, clean, and as described</li>
                      <li>Respond promptly to rental requests</li>
                      <li>Honor confirmed bookings</li>
                      <li>Maintain appropriate insurance coverage</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">For Renters:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                      <li>Use items responsibly and as intended</li>
                      <li>Return items in the same condition</li>
                      <li>Pay all fees on time</li>
                      <li>Report any damages immediately</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Section 4 */}
            <section id="payments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="w-6 h-6 mr-2 text-orange-600" />
                    4. Payments and Fees
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Service Fees:</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                      RenThing charges a service fee to maintain the platform and provide customer support. 
                      The current fee structure is:
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4 mt-2">
                      <li>Renters: 5% of the rental cost</li>
                      <li>Owners: 3% of the rental earnings</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Processing:</h4>
                    <ul className="list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300 ml-4">
                      <li>All payments are processed securely through our payment partners</li>
                      <li>Payment is collected when a booking is confirmed</li>
                      <li>Owners receive payment after successful completion of rental</li>
                      <li>Refunds are processed according to our cancellation policy</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Additional Sections */}
            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="w-6 h-6 mr-2 text-red-600" />
                    5. Prohibited Activities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    The following activities are strictly prohibited on RenThing:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 ml-4">
                    <li>Listing illegal items or engaging in illegal activities</li>
                    <li>Providing false or misleading information</li>
                    <li>Attempting to circumvent our payment system</li>
                    <li>Harassing, threatening, or discriminating against other users</li>
                    <li>Using the platform for commercial purposes without authorization</li>
                    <li>Attempting to manipulate reviews or ratings</li>
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader>
                  <CardTitle>6. Limitation of Liability</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    RenThing acts as a marketplace facilitator and is not responsible for the actions of users, 
                    the condition of items, or disputes between users. Our liability is limited to the maximum extent permitted by law.
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    Users participate in rentals at their own risk and are encouraged to obtain appropriate insurance coverage.
                  </p>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader>
                  <CardTitle>7. Termination</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 dark:text-gray-300">
                    RenThing reserves the right to terminate or suspend user accounts for violations of these terms. 
                    Users may also terminate their accounts at any time through their account settings.
                  </p>
                </CardContent>
              </Card>
            </section>

          </div>

          {/* Contact Section */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Questions About These Terms?</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              If you have any questions about our Terms of Service, please don't hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/help">Visit Help Center</Link>
              </Button>
            </div>
          </div>

          {/* Back Navigation */}
          <div className="text-center">
            <Button variant="outline" asChild>
              <Link href="/" className="inline-flex items-center">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}