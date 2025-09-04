import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  Book, 
  CreditCard, 
  Shield, 
  Users, 
  HelpCircle,
  ChevronRight
} from "lucide-react"

export default function HelpCenterPage() {
  const categories = [
    {
      title: "Getting Started",
      icon: Book,
      description: "Learn the basics of using RenThing",
      articles: [
        { title: "How to create an account", href: "/help/create-account" },
        { title: "Setting up your profile", href: "/help/setup-profile" },
        { title: "Browsing and searching items", href: "/help/browsing-items" },
        { title: "Item Guidelines & Policies", href: "/help/item-guidelines" }
      ]
    },
    {
      title: "Booking & Payments",
      icon: CreditCard,
      description: "Everything about bookings and payments",
      articles: [
        { title: "How to book an item", href: "/help/booking-guide" },
        { title: "Payment Help & Support", href: "/help/payment-help" },
        { title: "Cancellation and refund policy", href: "/help/cancellation-policy" },
        { title: "Understanding service fees", href: "/help/service-fees" }
      ]
    },
    {
      title: "Safety & Trust",
      icon: Shield,
      description: "Stay safe and build trust",
      articles: [
        { title: "Safety Guidelines", href: "/help/safety-guide" },
        { title: "Identity verification", href: "/help/identity-verification" },
        { title: "Insurance and protection", href: "/help/insurance-protection" },
        { title: "Reporting issues", href: "/help/reporting-issues" }
      ]
    },
    {
      title: "For Owners",
      icon: Users,
      description: "Tips for successful rentals",
      articles: [
        { title: "Creating great listings", href: "/help/creating-listings" },
        { title: "Pricing your items", href: "/help/pricing-guide" },
        { title: "Managing bookings", href: "/help/managing-bookings" },
        { title: "Maximizing earnings", href: "/help/maximizing-earnings" }
      ]
    }
  ]

  const faqs = [
    {
      question: "How do I create an account on RenThing?",
      answer: "You can create an account by clicking the 'Sign Up' button in the top right corner. Fill in your email, create a secure password, and verify your email address. You'll also need to add some basic profile information to get started."
    },
    {
      question: "Is it safe to rent items through RenThing?",
      answer: "Yes! We take safety seriously. All users go through identity verification, we provide insurance coverage for most items, and our review system helps build trust in the community. We also have 24/7 customer support to help resolve any issues."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards, as well as popular digital wallets like GCash and GrabPay. All payments are processed securely through our trusted payment system."
    },
    {
      question: "Can I cancel a booking?",
      answer: "Yes, you can cancel a booking depending on the cancellation policy set by the owner. Most items have flexible cancellation policies. You'll see the specific policy before you book, and any applicable refunds will be processed automatically."
    },
    {
      question: "What if an item is damaged during my rental?",
      answer: "If an item is accidentally damaged during your rental, please report it immediately through the app. We have insurance coverage that may apply, and we'll work with both you and the owner to resolve the situation fairly."
    },
    {
      question: "How do I contact the owner of an item?",
      answer: "Once you've made a booking, you can message the owner directly through our in-app chat system. This allows you to coordinate pickup/delivery times and ask any questions about the item."
    },
    {
      question: "What are the service fees?",
      answer: "RenThing charges a small service fee to maintain the platform and provide customer support. The exact fee varies but is typically around 5% of the rental cost. You'll see the exact fee breakdown before confirming your booking."
    },
    {
      question: "How do I list my items for rent?",
      answer: "Click 'List Your Item' from the main menu, then fill out the listing form with photos, description, pricing, and availability. Your listing will be reviewed and typically goes live within 24 hours."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Help Center
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto opacity-90">
            Find answers to your questions and get help when you need it
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative mt-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 h-5 w-5" />
            <Input 
              placeholder="Search for help articles, FAQs, and guides..."
              className="pl-10 py-3 text-lg"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Live Chat</CardTitle>
              <CardDescription>
                Get instant help from our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href="/contact">Start Chat</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Mail className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Email Support</CardTitle>
              <CardDescription>
                Send us a detailed message and we'll respond within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/contact">Send Email</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Phone Support</CardTitle>
              <CardDescription>
                Call us for urgent issues (available 9 AM - 9 PM)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                +1 (555) 123-RENT
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Featured Help Articles */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Popular Help Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Book className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">Item Guidelines</CardTitle>
                    <CardDescription>Learn how to list items properly</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Comprehensive guide on listing items, pricing strategies, and community guidelines.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/help/item-guidelines">
                    Read Guidelines
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CreditCard className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle className="text-lg">Payment Help</CardTitle>
                    <CardDescription>Understand payments and fees</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Everything about payment methods, security, and troubleshooting payment issues.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/help/payment-help">
                    Get Payment Help
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-purple-600" />
                  <div>
                    <CardTitle className="text-lg">Safety Guide</CardTitle>
                    <CardDescription>Stay safe while renting</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Important safety tips and best practices for secure rental transactions.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/help/safety-guide">
                    Read Safety Guide
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Browse Help Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-8 w-8 text-blue-600" />
                      <div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <div key={articleIndex}>
                          {article.href ? (
                            <Link href={article.href} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer transition-colors">
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{article.title}</span>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </Link>
                          ) : (
                            <div className="flex items-center justify-between p-2 opacity-60">
                              <span className="text-sm text-gray-500 dark:text-gray-400">{article.title}</span>
                              <span className="text-xs text-gray-400">Coming Soon</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button variant="link" className="p-0 mt-4">
                      See all articles in {category.title}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <Card>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="text-center mt-12 p-8 bg-white dark:bg-gray-800 rounded-lg">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Still need help?</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/community">Join Community Forum</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}