"use client"

import { Package, Camera, ListChecks, AlertCircle, CheckCircle, Shield, Clock, DollarSign } from "lucide-react"
import Link from "next/link"

const listingGuidelines = [
  {
    title: "Item Quality Standards",
    icon: CheckCircle,
    content: [
      "Items must be in good working condition",
      "Clean and well-maintained appearance",
      "All original parts and accessories included",
      "No safety hazards or recalls",
      "Age-appropriate and legal to rent"
    ]
  },
  {
    title: "Photo Requirements",
    icon: Camera,
    content: [
      "Minimum 3 high-quality photos per listing",
      "Clear, well-lit images showing all angles",
      "Include close-ups of any wear or damage",
      "Show item in actual condition (not stock photos)",
      "Include accessories and original packaging"
    ]
  },
  {
    title: "Description Guidelines",
    icon: ListChecks,
    content: [
      "Accurate and detailed item description",
      "Include brand, model, and specifications",
      "Mention any defects or wear honestly",
      "Specify what's included in the rental",
      "Clear usage instructions and limitations"
    ]
  },
  {
    title: "Prohibited Items",
    icon: AlertCircle,
    content: [
      "Illegal or stolen items",
      "Weapons, firearms, or dangerous materials",
      "Prescription medications or drugs",
      "Personal identification documents",
      "Items under active recall",
      "Perishable goods or food items"
    ]
  },
  {
    title: "Pricing Guidelines",
    icon: DollarSign,
    content: [
      "Research comparable items for fair pricing",
      "Consider item value and rental duration",
      "Factor in wear and depreciation",
      "Be competitive but realistic",
      "Adjust pricing based on demand and season"
    ]
  }
]

const rentalGuidelines = [
  {
    title: "Before Renting",
    icon: Shield,
    content: [
      "Thoroughly inspect the item with the owner",
      "Test all functions and features",
      "Document any existing damage with photos",
      "Confirm pickup/return time and location",
      "Understand usage restrictions and care instructions"
    ]
  },
  {
    title: "During Rental",
    icon: Clock,
    content: [
      "Use item only as intended by manufacturer",
      "Keep item clean and protected",
      "Report any issues immediately to owner",
      "Don't attempt repairs without owner consent",
      "Return item in same condition as received"
    ]
  },
  {
    title: "Return Process",
    icon: Package,
    content: [
      "Return item at agreed time and location",
      "Allow owner to inspect upon return",
      "Address any damage or issues immediately",
      "Complete return confirmation in app",
      "Leave honest review of the rental experience"
    ]
  }
]

const conditionCategories = [
  {
    condition: "Like New",
    description: "Minimal to no signs of wear, works perfectly"
  },
  {
    condition: "Good",
    description: "Minor cosmetic wear, fully functional"
  },
  {
    condition: "Fair",
    description: "Noticeable wear but works well"
  },
  {
    condition: "Acceptable",
    description: "Significant wear but functional"
  }
]

export default function ItemGuidelinesPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Package className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Item Guidelines</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Comprehensive guidelines for listing and renting items safely and successfully
          </p>
        </div>
      </section>

      {/* Listing Guidelines */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Listing Guidelines</h2>
          <div className="space-y-8">
            {listingGuidelines.map((guideline, index) => (
              <div key={guideline.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <guideline.icon className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{guideline.title}</h3>
                </div>
                <ul className="space-y-2">
                  {guideline.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Condition Categories */}
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Item Condition Categories</h3>
            <div className="grid gap-4">
              {conditionCategories.map((category, index) => (
                <div key={category.condition} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{category.condition}</h4>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rental Guidelines */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Rental Guidelines</h2>
            <div className="space-y-8">
              {rentalGuidelines.map((guideline, index) => (
                <div key={guideline.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <guideline.icon className="w-8 h-8 text-orange-600 mr-3" />
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">{guideline.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {guideline.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-orange-500 mt-1 mr-3 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Best Practices */}
          <div className="mt-12 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">Best Practices</h3>
            <ul className="space-y-2 text-orange-700 dark:text-orange-300">
              <li>• Always communicate clearly and promptly</li>
              <li>• Take photos/videos of items at pickup and return</li>
              <li>• Keep all agreements and terms in writing</li>
              <li>• Be honest about item condition and any issues</li>
              <li>• Leave detailed reviews to help the community</li>
            </ul>
          </div>

          {/* Back to Help Center */}
          <div className="mt-8 text-center">
            <Link 
              href="/help" 
              className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              Back to Help Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}