"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setSubmitted(true)
    setFormData({ name: "", email: "", subject: "", message: "" })
    
    // Reset success message after 5 seconds
    setTimeout(() => setSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            We're here to help! Reach out to our support team for any questions or assistance
          </p>
        </div>
      </section>

      {/* Contact Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Email Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="space-y-2">
                  <p><strong>General:</strong> support@renthing.com</p>
                  <p><strong>Business:</strong> business@renthing.com</p>
                  <p><strong>Press:</strong> press@renthing.com</p>
                  <p className="text-sm text-gray-500">Response within 24 hours</p>
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Phone Support
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="space-y-2">
                  <p><strong>Philippines:</strong> +63 2 8-111-1234</p>
                  <p><strong>WhatsApp:</strong> +63 917 123 4567</p>
                  <p className="text-sm text-gray-500">Mon-Fri, 9AM-6PM PHT</p>
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Office Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="space-y-2">
                  <p>123 Bonifacio Global City</p>
                  <p>Taguig, Metro Manila</p>
                  <p className="text-sm text-gray-500">By appointment only</p>
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Send us a Message</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>

            {submitted && (
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg mb-6">
                <div className="flex items-center">
                  <Send className="w-5 h-5 mr-2" />
                  <span>Message sent successfully! We'll respond within 24 hours.</span>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>
                  Please provide as much detail as possible so we can assist you better
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a topic" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="account">Account Issues</SelectItem>
                        <SelectItem value="payment">Payment Problems</SelectItem>
                        <SelectItem value="listing">Listing Support</SelectItem>
                        <SelectItem value="booking">Booking Issues</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="business">Business Partnership</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      placeholder="Please describe your issue or question in detail..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Hours */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    Support Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="space-y-2">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM PHT</p>
                    <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM PHT</p>
                    <p><strong>Sunday:</strong> Closed</p>
                    <p className="text-sm text-gray-500">Email support available 24/7</p>
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Quick Support
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="space-y-3">
                    <p>For urgent issues, try these quick solutions:</p>
                    <ul className="space-y-1 text-sm">
                      <li>• Check our <Link href="/help" className="text-blue-600 hover:underline">Help Center</Link> for guides</li>
                      <li>• Review <Link href="/help" className="text-blue-600 hover:underline">FAQs</Link> for common questions</li>
                      <li>• Check your email for booking confirmations</li>
                      <li>• Try logging out and back in</li>
                    </ul>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}