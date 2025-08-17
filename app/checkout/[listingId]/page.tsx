"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, CreditCard, Shield, ArrowLeft, Calendar, MapPin } from "lucide-react"
import { mockListings } from "@/lib/mock-data"
import { PaymentMethodSelector } from "@/components/payment-method-selector"
import { StripeCheckout } from "@/components/stripe-checkout"
import { XenditCheckout } from "@/components/xendit-checkout"
import { useToast } from "@/hooks/use-toast"

export default function CheckoutPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"stripe" | "xendit">("stripe")
  const [bookingDetails, setBookingDetails] = useState({
    startDate: "",
    endDate: "",
    duration: 1,
    totalPrice: 0,
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const listing = mockListings.find((l) => l.id === params.listingId)

  useEffect(() => {
    if (listing && bookingDetails.startDate && bookingDetails.endDate) {
      const start = new Date(bookingDetails.startDate)
      const end = new Date(bookingDetails.endDate)
      const diffTime = Math.abs(end.getTime() - start.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      setBookingDetails((prev) => ({
        ...prev,
        duration: diffDays || 1,
        totalPrice: (diffDays || 1) * listing.price,
      }))
    }
  }, [bookingDetails.startDate, bookingDetails.endDate, listing])

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Listing not found</h1>
          <Button asChild>
            <Link href="/browse">Back to Browse</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsProcessing(true)

    // TODO: Send payment data to backend for processing
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Payment successful!",
        description: "Your booking has been confirmed. Check your email for details.",
      })
      router.push(`/booking-confirmation/${paymentData.transactionId}`)
    }, 2000)
  }

  const serviceFee = Math.round(bookingDetails.totalPrice * 0.05) // 5% service fee
  const totalAmount = bookingDetails.totalPrice + serviceFee

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">RenThing</h1>
            </Link>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-6">
          <Link href={`/listing/${listing.id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Listing
          </Link>
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Details</CardTitle>
                <CardDescription>Confirm your rental dates and details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <img
                    src={listing.images[0] || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{listing.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {listing.location}
                    </div>
                    <Badge className="mt-2">{listing.category}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={bookingDetails.startDate}
                      onChange={(e) => setBookingDetails((prev) => ({ ...prev, startDate: e.target.value }))}
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={bookingDetails.endDate}
                      onChange={(e) => setBookingDetails((prev) => ({ ...prev, endDate: e.target.value }))}
                      min={bookingDetails.startDate || new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>

                {bookingDetails.startDate && bookingDetails.endDate && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <div className="flex items-center text-blue-600 dark:text-blue-400 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="font-medium">Booking Summary</span>
                    </div>
                    <p className="text-sm">
                      {bookingDetails.duration} {bookingDetails.duration === 1 ? "day" : "days"} rental
                    </p>
                    <p className="text-sm">
                      {new Date(bookingDetails.startDate).toLocaleDateString()} -{" "}
                      {new Date(bookingDetails.endDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose your preferred payment option</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentMethodSelector
                  selectedMethod={selectedPaymentMethod}
                  onMethodChange={setSelectedPaymentMethod}
                />
              </CardContent>
            </Card>

            {/* Payment Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedPaymentMethod === "stripe" ? (
                  <StripeCheckout
                    amount={totalAmount}
                    currency="USD"
                    onSuccess={handlePaymentSuccess}
                    disabled={!bookingDetails.startDate || !bookingDetails.endDate || isProcessing}
                  />
                ) : (
                  <XenditCheckout
                    amount={totalAmount}
                    currency="USD"
                    onSuccess={handlePaymentSuccess}
                    disabled={!bookingDetails.startDate || !bookingDetails.endDate || isProcessing}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>
                    ${listing.price} × {bookingDetails.duration} {bookingDetails.duration === 1 ? "day" : "days"}
                  </span>
                  <span>${bookingDetails.totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Service fee</span>
                  <span>${serviceFee}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>${totalAmount}</span>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium">What's included:</h4>
                  <ul className="text-sm space-y-1">
                    {listing.features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Free cancellation up to 24 hours before start date</p>
                  <p>• Secure payment processing</p>
                  <p>• 24/7 customer support</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
