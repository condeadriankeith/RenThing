"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, CheckCircle, Calendar, MapPin, CreditCard, Download, MessageCircle } from "lucide-react"

export default function BookingConfirmationPage() {
  const params = useParams()
  const transactionId = params.transactionId as string

  // Mock booking data - in production, fetch from API
  const bookingData = {
    id: "booking_123",
    transactionId,
    status: "confirmed",
    listing: {
      id: "1",
      title: "Professional DSLR Camera Kit",
      image: "/professional-camera-kit.png",
      location: "San Francisco, CA",
      category: "electronics",
    },
    dates: {
      start: "2024-03-15",
      end: "2024-03-17",
      duration: 2,
    },
    pricing: {
      basePrice: 150,
      days: 2,
      subtotal: 300,
      serviceFee: 15,
      total: 315,
    },
    payment: {
      method: "Stripe",
      last4: "4242",
      status: "succeeded",
    },
    owner: {
      name: "Sarah Chen",
      avatar: "/photographer-woman.png",
      phone: "+1 (555) 123-4567",
    },
    confirmationCode: "RC-" + transactionId.slice(-8).toUpperCase(),
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8 max-w-lg sm:max-w-2xl">
      <p className="mb-6 text-center text-base sm:text-lg text-gray-700 dark:text-gray-200">
        Your rental has been successfully booked. Check your email for detailed instructions.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Booking Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
              <CardDescription>Confirmation Code: {bookingData.confirmationCode}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-4">
                <img
                  src={bookingData.listing.image || "/placeholder.svg"}
                  alt={bookingData.listing.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{bookingData.listing.title}</h3>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {bookingData.listing.location}
                  </div>
                  <Badge className="mt-2">{bookingData.listing.category}</Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                  <span className="font-medium">Rental Period:</span>
                </div>
                <div className="ml-6 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    {new Date(bookingData.dates.start).toLocaleDateString()} - {new Date(bookingData.dates.end).toLocaleDateString()}
                  </p>
                  <p>{bookingData.dates.duration} days</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Next Steps:</h4>
                <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                  <li>• Contact the owner to arrange pickup/delivery</li>
                  <li>• Bring a valid ID for verification</li>
                  <li>• Review the item condition before use</li>
                  <li>• Return the item in the same condition</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          {/* Owner Contact */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Owner</CardTitle>
              <CardDescription>Get in touch to arrange pickup and delivery</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={bookingData.owner.avatar || "/placeholder.svg"}
                  alt={bookingData.owner.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold">{bookingData.owner.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{bookingData.owner.phone}</p>
                </div>
              </div>
              <Button className="w-full" asChild>
                <Link href={`/chat/${bookingData.owner.name}`}>
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        {/* Payment Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
              <CardDescription>Transaction ID: {transactionId}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>
                  ${bookingData.pricing.basePrice} × {bookingData.pricing.days} days
                </span>
                <span>${bookingData.pricing.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                <span>Service fee</span>
                <span>${bookingData.pricing.serviceFee}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Paid</span>
                <span>${bookingData.pricing.total}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                  <span>Paid with {bookingData.payment.method}</span>
                </div>
                <span>****{bookingData.payment.last4}</span>
              </div>
              <Badge variant="secondary" className="w-full justify-center bg-green-100 text-green-800">
                Payment Successful
              </Badge>
            </CardContent>
          </Card>
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Manage Booking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full bg-transparent">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/my-bookings">View All Bookings</Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Cancel Booking
              </Button>
            </CardContent>
          </Card>
          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Our support team is available 24/7 to help with any questions or issues.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
          
