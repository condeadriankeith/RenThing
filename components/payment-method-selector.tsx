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
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm sm:text-base">Global Payment Methods</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Credit/Debit Cards, Apple Pay, Google Pay</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center space-x-2 mt-2 sm:mt-0">
              <Badge variant="secondary" className="mb-1 sm:mb-0">Recommended</Badge>
              <div className="flex space-x-1">
                <img src="/visa-logo.png" alt="Visa" className="h-5 w-auto sm:h-6" />
                <img src="/mastercard-logo.png" alt="Mastercard" className="h-5 w-auto sm:h-6" />
                <img src="/amex-logo.png" alt="American Express" className="h-5 w-auto sm:h-6" />
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
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <Smartphone className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm sm:text-base">Southeast Asia Methods</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">GCash, GrabPay, Bank Transfers</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center space-x-2 mt-2 sm:mt-0">
              <Badge variant="outline" className="mb-1 sm:mb-0">Regional</Badge>
              <div className="flex space-x-1">
                <img src="/gcash-logo.png" alt="GCash" className="h-5 w-auto sm:h-6" />
                <img src="/grabpay-logo.png" alt="GrabPay" className="h-5 w-auto sm:h-6" />
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
