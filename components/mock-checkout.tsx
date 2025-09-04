"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MockCheckoutProps {
  amount: number
  currency: string
  onSuccess: (paymentData: any) => void
  disabled?: boolean
}

export function MockCheckout({ amount, currency = "PHP", onSuccess, disabled }: MockCheckoutProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Mock payment processing
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock successful payment
      const paymentData = {
        transactionId: `mock_${Date.now()}`,
        amount,
        currency: "php",
        method: "mock",
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
          <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-600">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-blue-600" />
              <span>Mock Payment</span>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Payment Details */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input 
            id="cardNumber" 
            placeholder="1234 5678 9012 3456" 
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required 
            disabled={disabled} 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input 
              id="expiry" 
              placeholder="MM/YY" 
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required 
              disabled={disabled} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cvv">CVV</Label>
            <Input 
              id="cvv" 
              placeholder="123" 
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              required 
              disabled={disabled} 
            />
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            This is a mock payment interface for testing purposes only. No real payments will be processed.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
        <Lock className="h-4 w-4" />
        <span>Secured by Mock Payment System - Your payment information is not stored</span>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={disabled || isProcessing}>
        {isProcessing ? "Processing..." : `Pay ₱${amount.toLocaleString()}`}
      </Button>
    </form>
  )
}