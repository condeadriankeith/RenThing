"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Search, HelpCircle, Shield, CreditCard, Package, MessageCircle, ChevronDown, ChevronRight } from "lucide-react"

const faqCategories = [
  {
    title: "Getting Started",
    icon: HelpCircle,
    questions: [
      {
        question: "How do I create an account?",
        answer: "Click the 'Sign Up' button in the top right corner. You'll need to provide your email address, create a password, and verify your email. After verification, you can complete your profile with additional details."
      },
      {
        question: "How do I list an item for rent?",
        answer: "Once logged in, click 'List Item' in the navigation. Upload clear photos, write a detailed description, set your price, and specify availability. Your listing will be reviewed and typically goes live within 24 hours."
      },
      {
        question: "How do I search for items?",
        answer: "Use the search bar on the browse page. You can filter by category, location, price range, and availability. Use keywords to find specific items or browse categories to discover what's available."
      }
    ]
  },
  {
    title: "Safety & Security",
    icon: Shield,
    questions: [
      {
        question: "How does RenThing ensure safety?",
        answer: "We verify user identities, provide secure payment processing, offer insurance options, and have a review system. We also provide safety guidelines and 24/7 support for any concerns."
      },
      {
        question: "What if an item gets damaged?",
        answer: "We have a damage protection policy. Report any issues immediately through our platform. We'll mediate between parties and determine fair resolution based on our terms of service and insurance coverage."
      },
      {
        question: "How are payments handled?",
        answer: "All payments are processed securely through our platform. Renters pay when booking, and owners receive payment after the rental period ends. We hold funds in escrow to protect both parties."
      }
    ]
  },
  {
    title: "Payments & Pricing",
    icon: CreditCard,
    questions: [
      {
        question: "What fees does RenThing charge?",
        answer: "We charge a small service fee (typically 5-10%) on each transaction to cover platform costs, payment processing, and support. This fee is clearly displayed before you confirm any booking or listing."
      },
      {
        question: "When do I get paid as an owner?",
        answer: "Payments are released to your account 24-48 hours after the rental period ends, assuming no issues are reported. You can then withdraw to your bank account or digital wallet."
      },
      {
        question: "What payment methods are accepted?",
        answer: "We accept credit/debit cards, GCash, GrabPay, and bank transfers. All payments are processed securely through our integrated payment partners."
      }
    ]
  },
  {
    title: "Using the Platform",
    icon: Package,
    questions: [
      {
        question: "How do I communicate with other users?",
        answer: "Use our built-in messaging system. Click 'Contact Owner' on any listing to start a conversation. All communication stays on the platform for safety and record-keeping."
      },
      {
        question: "Can I extend my rental period?",
        answer: "Yes, if the item is available. Contact the owner through our messaging system to request an extension. They can approve it and adjust the booking accordingly."
      },
      {
        question: "What if I need to cancel?",
        answer: "You can cancel through your bookings page. Our cancellation policy varies based on timing: full refund if cancelled 24+ hours before, partial refund within 24 hours, and no refund for same-day cancellations."
      }
    ]
  }
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({})

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`
    setOpenQuestions(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Help Center</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Find answers to common questions and get the support you need
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/contact" className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <MessageCircle className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Contact Support</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Get personalized help</p>
            </Link>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <Shield className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Safety Guide</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Stay safe while renting</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <CreditCard className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Payment Help</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Manage payments & refunds</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <Package className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Item Guidelines</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">Listing & renting rules</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto space-y-8">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={category.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <category.icon className="w-6 h-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{category.title}</h3>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {category.questions.map((qa, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`
                    const isOpen = openQuestions[key]
                    
                    return (
                      <div key={qa.question} className="p-6">
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white pr-4">
                            {qa.question}
                          </h4>
                          {isOpen ? (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {isOpen && (
                          <div className="mt-4 text-gray-600 dark:text-gray-300">
                            {qa.answer}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No results found for "{searchQuery}". Try different keywords or contact our support team.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-100 dark:bg-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Can't find what you're looking for?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto">
            Our support team is here to help. Contact us for personalized assistance.
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}