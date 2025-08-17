"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, Apple, Smartphone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StripeCheckoutProps {
  amount: number
  currency: string
  onSuccess: (paymentData: any) => void
  disabled?: boolean
}

export function StripeCheckout({ amount, currency, onSuccess, disabled }: StripeCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Mock Stripe payment processing
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful payment
      const paymentData = {
        transactionId: `stripe_${Date.now()}`,
        amount,
        currency,
        method: paymentMethod,
        status: "succeeded",
        created: new Date().toISOString(),
      }

      onSuccess(paymentData)
    } catch (error) {
      toast({
        title: "Payment failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div className="space-y-3">
        <Label>Payment Method</Label>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
              paymentMethod === "card"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5" />
              <span>Credit or Debit Card</span>
            </div>
            <div className="flex space-x-1">
              <img src="/visa-logo.png" alt="Visa" className="h-5 w-auto" />
              <img src="/mastercard-logo.png" alt="Mastercard" className="h-5 w-auto" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("apple_pay")}
            className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
              paymentMethod === "apple_pay"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Apple className="h-5 w-5" />
              <span>Apple Pay</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("google_pay")}
            className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
              paymentMethod === "google_pay"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5" />
              <span>Google Pay</span>
            </div>
          </button>
        </div>
      </div>

      {paymentMethod === "card" && (
        <>
          <Separator />

          {/* Card Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input id="cardNumber" placeholder="1234 5678 9012 3456" required disabled={disabled} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input id="expiry" placeholder="MM/YY" required disabled={disabled} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" required disabled={disabled} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input id="cardName" placeholder="John Doe" required disabled={disabled} />
            </div>
          </div>

          <Separator />

          {/* Billing Address */}
          <div className="space-y-4">
            <h3 className="font-medium">Billing Address</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select required disabled={disabled}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="GB">United Kingdom</SelectItem>
                    <SelectItem value="AU">Australia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input id="postalCode" placeholder="12345" required disabled={disabled} />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Lock className="h-4 w-4" />
        <span>Your payment information is encrypted and secure</span>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={disabled || isProcessing}>
        {isProcessing ? "Processing..." : `Pay $${amount}`}
      </Button>
    </form>
  )
}
