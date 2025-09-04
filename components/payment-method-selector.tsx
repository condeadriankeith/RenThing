"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Smartphone } from "lucide-react"

interface PaymentMethodSelectorProps {
  selectedMethod: "mock"
  onMethodChange: (method: "mock") => void
}

export function PaymentMethodSelector({ selectedMethod, onMethodChange }: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      {/* Mock Payment Method */}
      <Card
        className={`cursor-pointer transition-all ${
          selectedMethod === "mock"
            ? "ring-2 ring-blue-600 bg-blue-50 dark:bg-blue-900/20"
            : "hover:bg-gray-50 dark:hover:bg-gray-800"
        }`}
        onClick={() => onMethodChange("mock")}
      >
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm sm:text-base">Mock Payment</h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">For testing purposes only</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center space-x-2 mt-2 sm:mt-0">
              <Badge variant="outline" className="mb-1 sm:mb-0">Test</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}