import { prisma } from '@/lib/prisma'
import { emailTriggers } from './email-triggers'
import { logger } from '@/lib/logger'

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
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: string
  bookingId: string
  userId: string
  created: string
  updated: string
}

class PaymentService {
  // Transaction Management
  async createTransaction(data: {
    bookingId: string
    amount: number
    currency: string
    paymentMethod: string
    userId: string
  }) {
    try {
      const transaction = await prisma!.transaction.create({
        data: {
          bookingId: data.bookingId,
          amount: data.amount,
          currency: data.currency,
          paymentMethod: data.paymentMethod,
          status: 'pending',
          userId: data.userId,
        },
        include: {
          booking: {
            include: {
              listing: {
                select: {
                  title: true,
                  price: true,
                }
              }
            }
          }
        }
      })

      return transaction
    } catch (error) {
      console.error('Create transaction error:', error)
      throw new Error('Failed to create transaction')
    }
  }

  async getTransaction(bookingId: string) {
    try {
      const transaction = await prisma!.transaction.findUnique({
        where: { bookingId },
        include: {
          booking: {
            include: {
              listing: {
                select: {
                  title: true,
                  price: true,
                }
              }
            }
          }
        }
      })

      return transaction
    } catch (error) {
      console.error('Get transaction error:', error)
      throw new Error('Failed to get transaction')
    }
  }

  async confirmPayment(transactionId: string, paymentMethodId: string) {
    try {
      const transaction = await prisma!.transaction.findUnique({
        where: { id: transactionId },
        include: {
          booking: {
            include: {
              listing: true,
              user: true,
            }
          }
        }
      })

      if (!transaction) {
        throw new Error('Transaction not found')
      }

      // For mock payments, we'll just update the status
      await prisma!.transaction.update({
        where: { id: transactionId },
        data: { status: 'completed' }
      })
      
      await prisma!.booking.update({
        where: { id: transaction.bookingId },
        data: { status: 'confirmed' }
      })

      return { success: true, transaction }
    } catch (error) {
      console.error('Payment confirmation error:', error)
      throw new Error('Failed to confirm payment')
    }
  }

  async refundTransaction(bookingId: string, amount?: number) {
    try {
      const transaction = await prisma!.transaction.findUnique({
        where: { bookingId }
      })

      if (!transaction) {
        throw new Error('Transaction not found')
      }

      const updatedTransaction = await prisma!.transaction.update({
        where: { bookingId },
        data: {
          status: 'refunded',
        },
      })

      return updatedTransaction
    } catch (error) {
      console.error('Refund error:', error)
      throw new Error('Failed to process refund')
    }
  }

  async handleWebhook(event: any) {
    try {
      console.log(`Unhandled event type ${event.event}`)
      return { received: true }
    } catch (error) {
      logger.error('Webhook error', error as Error)
      throw new Error('Webhook processing failed')
    }
  }

  async healthCheck() {
    try {
      return { status: 'ok', message: 'Payment service is healthy' }
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Payment service connection failed'
      }
    }
  }
}

// Export singleton instance
export const paymentService = new PaymentService()

// Utility functions
export function formatCurrency(amount: number, currency = "PHP"): string {
  return new Intl.NumberFormat("en-PH", {
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
  return icons[method.toLowerCase()] || "/credit-card-icon.svg"
}