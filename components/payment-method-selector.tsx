"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone, Building2 } from "lucide-react"

interface PaymentMethodSelectorProps {
  selectedMethod: "stripe" | "xendit"
  onMethodChange: (method: "stripe" | "xendit") => void
}

export function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      {/* Stripe Payment Methods */}
      <Card
        className={`cursor-pointer transition-all ${
          selectedMethod === "stripe"
            ? "ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-900/20"
            : "hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => onMethodChange("stripe")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Global Payment Methods</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Credit/Debit Cards, Apple Pay, Google Pay</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Recommended</Badge>
              <div className="flex space-x-1">
                <img src="/visa-logo.png" alt="Visa" className="h-6 w-auto" />
                <img src="/mastercard-logo.png" alt="Mastercard" className="h-6 w-auto" />
                <img src="/amex-logo.png" alt="American Express" className="h-6 w-auto" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Xendit Payment Methods */}
      <Card
        className={`cursor-pointer transition-all ${
          selectedMethod === "xendit"
            ? "ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-900/20"
            : "hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => onMethodChange("xendit")}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Smartphone className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Southeast Asia Methods</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">GCash, GrabPay, Bank Transfers</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Regional</Badge>
              <div className="flex space-x-1">
                <img src="/gcash-logo.png" alt="GCash" className="h-6 w-auto" />
                <img src="/grabpay-logo.png" alt="GrabPay" className="h-6 w-auto" />
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
