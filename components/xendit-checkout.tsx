"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Smartphone, Building2, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface XenditCheckoutProps {
  amount: number
  currency: string
  onSuccess: (paymentData: any) => void
  disabled?: boolean
}

export function XenditCheckout({ amount, currency = "PHP", onSuccess, disabled }: XenditCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("gcash")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Mock Xendit payment processing
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful payment
      const paymentData = {
        transactionId: `xendit_${Date.now()}`,
        amount,
        currency: "php",
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
        <div className="text-lg font-semibold">Amount: <span className="text-blue-600">₱{amount.toLocaleString()}</span></div>
        <Label>Payment Method</Label>
        <div className="grid grid-cols-1 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod("gcash")}
            className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
              paymentMethod === "gcash"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <span>GCash</span>
            </div>
            <img src="/gcash-logo.png" alt="GCash" className="h-6 w-auto" />
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("grabpay")}
            className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
              paymentMethod === "grabpay"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Smartphone className="h-5 w-5 text-green-600" />
              <span>GrabPay</span>
            </div>
            <img src="/grabpay-logo.png" alt="GrabPay" className="h-6 w-auto" />
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod("bank_transfer")}
            className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
              paymentMethod === "bank_transfer"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            <div className="flex items-center space-x-3">
              <Building2 className="h-5 w-5 text-gray-600" />
              <span>Bank Transfer</span>
            </div>
          </button>
        </div>
      </div>

      <Separator />

      {/* Payment Details */}
      {paymentMethod === "gcash" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="gcashNumber">GCash Mobile Number</Label>
            <Input id="gcashNumber" placeholder="+63 9XX XXX XXXX" required disabled={disabled} />
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              You will receive an SMS notification to complete the payment on your GCash app.
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "grabpay" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="grabNumber">GrabPay Mobile Number</Label>
            <Input id="grabNumber" placeholder="+63 9XX XXX XXXX" required disabled={disabled} />
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              You will be redirected to the Grab app to complete your payment.
            </p>
          </div>
        </div>
      )}

      {paymentMethod === "bank_transfer" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankCode">Bank</Label>
            <Select required disabled={disabled}>
              <SelectTrigger>
                <SelectValue placeholder="Select your bank" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bpi">Bank of the Philippine Islands (BPI)</SelectItem>
                <SelectItem value="bdo">Banco de Oro (BDO)</SelectItem>
                <SelectItem value="metrobank">Metrobank</SelectItem>
                <SelectItem value="unionbank">UnionBank</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              You will receive bank transfer instructions after confirming your payment.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Lock className="h-4 w-4" />
        <span>Secured by Xendit - Your payment information is encrypted</span>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={disabled || isProcessing}>
        {isProcessing ? "Processing..." : `Pay $${amount}`}
      </Button>
    </form>
  )
}
