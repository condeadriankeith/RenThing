"use client"

import { Shield, UserCheck, Camera, MessageCircle, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

const safetyTopics = [
  {
    title: "User Verification",
    icon: UserCheck,
    content: [
      "Always verify user profiles before transactions",
      "Check profile photos, reviews, and verification badges",
      "Look for users with completed profiles and positive ratings",
      "Be cautious of new accounts with limited activity"
    ]
  },
  {
    title: "Meeting Safety",
    icon: Camera,
    content: [
      "Meet in public, well-lit locations during daytime",
      "Bring a friend or family member if possible",
      "Inform someone about your meeting plans and location",
      "Trust your instincts - if something feels wrong, leave",
      "Take photos of items before and after rental"
    ]
  },
  {
    title: "Communication Guidelines",
    icon: MessageCircle,
    content: [
      "Keep all communication within the RenThing platform",
      "Never share personal contact information initially",
      "Document all agreements and terms in messages",
      "Report suspicious behavior immediately",
      "Be clear about expectations and requirements"
    ]
  },
  {
    title: "Red Flags to Watch For",
    icon: AlertTriangle,
    content: [
      "Requests to communicate outside the platform",
      "Pressure to complete transactions quickly",
      "Unusually low prices or deals that seem too good",
      "Users refusing to provide additional photos or information",
      "Requests for advance payment outside the platform"
    ]
  },
  {
    title: "Item Safety Checks",
    icon: CheckCircle,
    content: [
      "Inspect items thoroughly before accepting",
      "Test electronic items to ensure they work",
      "Check for any damage or missing parts",
      "Verify serial numbers and authenticity",
      "Take photos of any existing damage"
    ]
  }
]

export default function SafetyGuidePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">Safety Guide</h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Stay safe while renting with these essential safety guidelines and best practices
          </p>
        </div>
      </section>

      {/* Safety Topics */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {safetyTopics.map((topic, index) => (
              <div key={topic.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <topic.icon className="w-8 h-8 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{topic.title}</h2>
                </div>
                <ul className="space-y-2">
                  {topic.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-blue-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Emergency Contact */}
          <div className="mt-12 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mr-2" />
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200">Emergency Situations</h3>
            </div>
            <p className="text-red-700 dark:text-red-300 mb-3">
              If you encounter any emergency or feel unsafe, contact local authorities immediately.
            </p>
            <p className="text-red-700 dark:text-red-300">
              For platform-related safety concerns, reach out to our support team through the 
              <Link href="/contact" className="text-red-600 dark:text-red-400 underline hover:no-underline">
                Contact Support
              </Link> page.
            </p>
          </div>

          {/* Back to Help Center */}
          <div className="mt-8 text-center">
            <Link 
              href="/help" 
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Help Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}