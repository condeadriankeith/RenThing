"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Eye, Lock, UserCheck, Database, Globe } from "lucide-react"

export default function PrivacyPage() {
  const lastUpdated = "August 30, 2025"

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-blue-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Your privacy matters to us. Learn how we protect your personal information and respect your data rights
          </p>
          <p className="text-sm opacity-75 mt-4">Last Updated: {lastUpdated}</p>
        </div>
      </section>

      {/* Overview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="space-y-4">
                  <p>
                    At RenThing, we are committed to protecting your privacy and ensuring the security of your personal information. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our rental platform.
                  </p>
                  <p>
                    By using our services, you agree to the collection and use of information in accordance with this policy. 
                    We encourage you to read this policy carefully to understand our practices regarding your personal data.
                  </p>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Information We Collect</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <ul className="space-y-2">
                      <li>• Name and contact details</li>
                      <li>• Email address and phone number</li>
                      <li>• Government-issued ID for verification</li>
                      <li>• Payment information</li>
                      <li>• Profile photos and descriptions</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Usage Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <ul className="space-y-2">
                      <li>• Device and browser information</li>
                      <li>• IP address and location data</li>
                      <li>• Search and browsing history</li>
                      <li>• Communication with other users</li>
                      <li>• Transaction history</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How We Use Data */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How We Use Your Information</h2>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserCheck className="w-5 h-5 mr-2" />
                    Service Provision
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    To provide and maintain our rental services, including account creation, 
                    booking management, payment processing, and customer support.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Security & Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    To verify your identity, prevent fraud, ensure platform security, 
                    and comply with legal and regulatory requirements.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Platform Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    To analyze usage patterns, improve our services, develop new features, 
                    and personalize your experience on our platform.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sharing */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Data Sharing & Disclosure</h2>
            
            <Card>
              <CardHeader>
                <CardTitle>When We Share Information</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">With Your Consent</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We share information when you explicitly authorize us to do so, such as when you connect 
                      with other users for rental transactions.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Service Providers</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We share information with trusted third-party service providers who help us operate our 
                      platform, such as payment processors, verification services, and cloud hosting providers.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Legal Requirements</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      We may disclose information when required by law, court order, or government request, 
                      or to protect our rights, property, or safety.
                    </p>
                  </div>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Data Rights */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Your Data Rights</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Access & Control</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <ul className="space-y-2">
                      <li>• Access your personal data</li>
                      <li>• Correct inaccurate information</li>
                      <li>• Request data deletion</li>
                      <li>• Export your data</li>
                      <li>• Opt-out of marketing</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Data Retention</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    <ul className="space-y-2">
                      <li>• Account data: Until account deletion</li>
                      <li>• Transaction records: 7 years minimum</li>
                      <li>• Marketing preferences: Until opt-out</li>
                      <li>• Log data: 90 days maximum</li>
                      <li>• Backup data: 30 days maximum</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Security Measures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="space-y-4">
                  <p>
                    We implement appropriate technical and organizational measures to protect your personal 
                    information against unauthorized access, alteration, disclosure, or destruction.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Technical Measures</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Encryption in transit and at rest</li>
                        <li>• Secure socket layer (SSL) technology</li>
                        <li>• Regular security audits</li>
                        <li>• Access controls and authentication</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">Organizational Measures</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Employee training on data protection</li>
                        <li>• Confidentiality agreements</li>
                        <li>• Regular policy reviews</li>
                        <li>• Incident response procedures</li>
                      </ul>
                    </div>
                  </div>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact & Updates */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle>Policy Updates & Contact</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="space-y-4">
                  <p>
                    We may update this Privacy Policy from time to time. We will notify you of any changes 
                    by posting the new policy on this page and updating the "Last Updated" date.
                  </p>
                  
                  <p>
                    If you have questions about this Privacy Policy or your data rights, please contact us:
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="/contact" className="text-blue-600 hover:underline">
                      Contact Us
                    </a>
                    <a href="mailto:privacy@renthing.com" className="text-blue-600 hover:underline">
                      privacy@renthing.com
                    </a>
                  </div>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}