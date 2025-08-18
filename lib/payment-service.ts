// Payment processing utilities for Stripe and Xendit integration
// In production, these would connect to actual payment APIs

export interface PaymentIntent {
  id: string
  amount: number
  currency: string
  status: "requires_payment_method" | "requires_confirmation" | "succeeded" | "canceled"
  client_secret?: string
  payment_method?: string
  created: string
}

export interface Transaction {
  id: string
  paymentIntentId: string
  amount: number
  currency: string
  status: "pending" | "succeeded" | "failed" | "refunded"
  paymentMethod: "stripe" | "xendit"
  paymentDetails: {
    method: string
    last4?: string
    brand?: string
  }
  bookingId: string
  userId: string
  created: string
  updated: string
}

class PaymentService {
  // Stripe Integration
  async createStripePaymentIntent(amount: number, currency = "PHP"): Promise<PaymentIntent> {
    // Mock Stripe API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `pi_stripe_${Date.now()}`,
          amount: amount * 100, // Stripe uses cents
          currency: "php",
          status: "requires_payment_method",
          client_secret: `pi_stripe_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
          created: new Date().toISOString(),
        })
      }, 500)
    })
  }

  async confirmStripePayment(paymentIntentId: string, paymentMethodData: any): Promise<PaymentIntent> {
    // Mock Stripe confirmation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 95% success rate
        if (Math.random() > 0.05) {
          resolve({
            id: paymentIntentId,
            amount: 31500, // ₱315.00 in cents
            currency: "php",
            status: "succeeded",
            payment_method: "card_1234",
            created: new Date().toISOString(),
          })
        } else {
          reject(new Error("Your card was declined."))
        }
      }, 2000)
    })
  }

  // Xendit Integration
  async createXenditPayment(amount: number, currency = "USD", method: string): Promise<PaymentIntent> {
    // Mock Xendit API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: `xendit_${Date.now()}`,
          amount,
          currency: currency.toUpperCase(),
          status: "requires_confirmation",
          created: new Date().toISOString(),
        })
      }, 500)
    })
  }

  async confirmXenditPayment(paymentId: string, paymentData: any): Promise<PaymentIntent> {
    // Mock Xendit confirmation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate for regional methods
        if (Math.random() > 0.1) {
          resolve({
            id: paymentId,
            amount: 315,
            currency: "USD",
            status: "succeeded",
            payment_method: paymentData.method,
            created: new Date().toISOString(),
          })
        } else {
          reject(new Error("Payment failed. Please try again."))
        }
      }, 3000) // Longer processing time for regional methods
    })
  }

  // Transaction Management
  async createTransaction(paymentIntent: PaymentIntent, bookingData: any): Promise<Transaction> {
    const transaction: Transaction = {
      id: `txn_${Date.now()}`,
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status === "succeeded" ? "succeeded" : "pending",
      paymentMethod: paymentIntent.id.startsWith("pi_stripe") ? "stripe" : "xendit",
      paymentDetails: {
        method: paymentIntent.payment_method || "unknown",
        last4: "4242", // Mock last 4 digits
        brand: "visa", // Mock brand
      },
      bookingId: bookingData.bookingId,
      userId: bookingData.userId,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
    }

    // In production, save to database
    console.log("Transaction created:", transaction)
    return transaction
  }

  async getTransaction(transactionId: string): Promise<Transaction | null> {
    // Mock database lookup
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: transactionId,
          paymentIntentId: `pi_${transactionId}`,
          amount: 315,
          currency: "USD",
          status: "succeeded",
          paymentMethod: "stripe",
          paymentDetails: {
            method: "card",
            last4: "4242",
            brand: "visa",
          },
          bookingId: "booking_123",
          userId: "user_123",
          created: new Date().toISOString(),
          updated: new Date().toISOString(),
        })
      }, 300)
    })
  }

  async refundTransaction(transactionId: string, amount?: number): Promise<Transaction> {
    // Mock refund processing
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.05) {
          resolve({
            id: `refund_${Date.now()}`,
            paymentIntentId: `pi_${transactionId}`,
            amount: amount || 315,
            currency: "USD",
            status: "refunded",
            paymentMethod: "stripe",
            paymentDetails: {
              method: "refund",
            },
            bookingId: "booking_123",
            userId: "user_123",
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
          })
        } else {
          reject(new Error("Refund failed. Please contact support."))
        }
      }, 2000)
    })
  }
}

// Export singleton instance
export const paymentService = new PaymentService()

// Utility functions
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount)
}

export function getPaymentMethodIcon(method: string): string {
  const icons: Record<string, string> = {
    visa: "/visa-logo.png",
    mastercard: "/mastercard-logo.png",
    amex: "/amex-logo.png",
    gcash: "/gcash-logo.png",
    grabpay: "/grabpay-logo.png",
  }
  return icons[method.toLowerCase()] || "/credit-card-icon.png"
}
