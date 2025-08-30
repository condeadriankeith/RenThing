"use client"

import { CreditCard, DollarSign, Clock, AlertCircle, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

const paymentTopics = [
  {
    title: "Accepted Payment Methods",
    icon: CreditCard,
    content: [
      "Credit/Debit Cards (Visa, Mastercard, American Express)",
      "Digital Wallets (GCash, GrabPay)",
      "Bank Transfers (via secure payment partners)",
      "All payments are processed securely through our platform"
    ]
  },
  {
    title: "Payment Process for Renters",
    icon: DollarSign,
    content: [
      "Payment is required at the time of booking confirmation",
      "Funds are held securely until the rental period ends",
      "Full refund available for cancellations made 24+ hours in advance",
      "Partial refund for cancellations within 24 hours",
      "No refund for same-day cancellations"
    ]
  },
  {
    title: "Receiving Payments as Owner",
    icon: Clock,
    content: [
      "Payments are released 24-48 hours after rental completion",
      "Funds are transferred to your linked bank account or digital wallet",
      "Minimum withdrawal amount: ₱500",
      "Processing time: 1-3 business days for bank transfers",
      "Instant transfer available for digital wallets"
    ]
  },
  {
    title: "Fees and Charges",
    icon: AlertCircle,
    content: [
      "Platform service fee: 5-10% of transaction value",
      "Payment processing fee: 2-3% (included in service fee)",
      "No hidden charges - all fees displayed upfront",
      "Late return fees: Additional day charges apply",
      "Damage fees: Based on actual repair/replacement costs"
    ]
  },
  {
    title: "Refund Policy",
    icon: CheckCircle,
    content: [
      "Full refund for owner cancellations",
      "Full refund for cancellations 24+ hours before rental",
      "50% refund for cancellations within 24 hours",
      "Pro-rated refund for early returns (owner approval required)",
      "Refunds processed within 3-5 business days"
    ]
  }
]

const commonIssues = [
  {
    question: "Why hasn't my payment been processed?",
    answer: "Check if your payment method has sufficient funds and is valid. Contact your bank if the issue persists."
  },
  {
    question: "How do I update my payment method?",
    answer: "Go to your account settings > Payment Methods to add or update your payment information."
  },
  {
    question: "What happens if a renter doesn't pay?",
    answer: "All bookings require upfront payment. Unpaid bookings are automatically cancelled within 30 minutes."
  },
  {
    question: "Can I get paid in cash?",
    answer: "No, all transactions must go through our platform for security and insurance purposes."
  }
]

export default function PaymentHelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <CreditCard className="w-16 h-16 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Payment Help</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Everything you need to know about payments, refunds, and managing your transactions
          </p>
        </div>
      </section>

      {/* Payment Topics */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-8">
            {paymentTopics.map((topic, index) => (
              <div key={topic.title} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <topic.icon className="w-8 h-8 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">{topic.title}</h2>
                </div>
                <ul className="space-y-2">
                  {topic.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-purple-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Common Issues */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Common Payment Issues</h2>
            <div className="space-y-4">
              {commonIssues.map((issue, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{issue.question}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{issue.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Need More Help?</h3>
            <p className="text-blue-700 dark:text-blue-300 mb-4">
              If you have payment-related questions not covered here, our support team is ready to help.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Back to Help Center */}
          <div className="mt-8 text-center">
            <Link 
              href="/help" 
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Back to Help Center
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}