import Stripe from 'stripe'
import { prisma } from '@/lib/prisma'
import { emailTriggers } from './email-triggers'
import { logger } from '@/lib/logger'

// Initialize Stripe conditionally to avoid build errors when API key is missing
let stripe: Stripe | null = null
if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  })
}

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
  xenditInvoiceId?: string
  stripePaymentIntentId?: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: "xendit" | "stripe"
  bookingId: string
  userId: string
  created: string
  updated: string
}

class PaymentService {
  // Stripe Integration
  async createStripePaymentIntent(amount: number, currency = "PHP", bookingId: string) {
    if (!stripe) {
      throw new Error('Stripe not configured - missing STRIPE_SECRET_KEY')
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
        metadata: {
          bookingId,
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })

      return {
        id: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      }
    } catch (error) {
      console.error('Stripe payment intent creation error:', error)
      throw new Error('Failed to create payment intent')
    }
  }

  async confirmStripePayment(paymentIntentId: string) {
    if (!stripe) {
      throw new Error('Stripe not configured - missing STRIPE_SECRET_KEY')
    }

    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      if (paymentIntent.status === 'succeeded') {
        const transaction = await prisma.transaction.update({
          where: { stripePaymentIntentId: paymentIntentId },
          data: {
            status: 'completed',
          },
        })

        // Update booking status
        await prisma.booking.update({
          where: { id: paymentIntent.metadata?.bookingId },
          data: { status: 'confirmed' }
        })

        return { success: true, transaction }
      }

      return { success: false, error: 'Payment not completed' }
    } catch (error) {
      console.error('Stripe payment confirmation error:', error)
      throw new Error('Failed to confirm payment')
    }
  }

  // Xendit Integration
  async createXenditPayment(amount: number, currency = "PHP", bookingId: string, customerEmail: string) {
    try {
      const response = await fetch('https://api.xendit.co/v2/invoices', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY!).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          external_id: bookingId,
          amount,
          currency: currency.toUpperCase(),
          invoice_duration: 86400, // 24 hours
          customer: {
            email: customerEmail,
          },
          success_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/success`,
          failure_redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/bookings/failed`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create Xendit invoice')
      }

      const invoice = await response.json()
      
      return {
        id: invoice.id,
        invoiceUrl: invoice.invoice_url,
        amount: invoice.amount,
        currency: invoice.currency,
        status: 'pending',
      }
    } catch (error) {
      console.error('Xendit payment creation error:', error)
      throw new Error('Failed to create Xendit payment')
    }
  }

  // Transaction Management
  async createTransaction(data: {
    bookingId: string
    amount: number
    currency: string
    paymentMethod: string
    xenditInvoiceId?: string
    stripePaymentIntentId?: string
  }) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          bookingId: data.bookingId,
          amount: data.amount,
          currency: data.currency,
          paymentMethod: data.paymentMethod,
          status: 'pending',
          xenditInvoiceId: data.xenditInvoiceId,
          stripePaymentIntentId: data.stripePaymentIntentId,
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
      const transaction = await prisma.transaction.findUnique({
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
      const transaction = await prisma.transaction.findUnique({
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

      // For Stripe payments
      if (transaction.stripePaymentIntentId) {
        if (!stripe) {
          throw new Error('Stripe not configured - missing STRIPE_SECRET_KEY')
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(
          transaction.stripePaymentIntentId
        )

        if (paymentIntent.status === 'succeeded') {
          await prisma.transaction.update({
            where: { id: transactionId },
            data: { status: 'completed' }
          })

          await prisma.booking.update({
            where: { id: transaction.bookingId },
            data: { status: 'confirmed' }
          })

          return { success: true, transaction }
        }
      }

      // For Xendit payments
      if (transaction.xenditInvoiceId) {
        const response = await fetch(`https://api.xendit.co/v2/invoices/${transaction.xenditInvoiceId}`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY!).toString('base64')}`
          }
        })
        
        if (response.ok) {
          const invoice = await response.json()
          if (invoice.status === 'PAID') {
            await prisma.transaction.update({
              where: { id: transactionId },
              data: { status: 'completed' }
            })
            
            await prisma.booking.update({
              where: { id: transaction.bookingId },
              data: { status: 'confirmed' }
            })

            return { success: true, transaction }
          }
        }
      }

      return { success: false, error: 'Payment not completed' }
    } catch (error) {
      console.error('Payment confirmation error:', error)
      throw new Error('Failed to confirm payment')
    }
  }

  async refundTransaction(bookingId: string, amount?: number) {
    try {
      const transaction = await prisma.transaction.findUnique({
        where: { bookingId }
      })

      if (!transaction) {
        throw new Error('Transaction not found')
      }

      let refundSuccess = false

      if (transaction.stripePaymentIntentId) {
        if (!stripe) {
          throw new Error('Stripe not configured - missing STRIPE_SECRET_KEY')
        }

        const refund = await stripe.refunds.create({
          payment_intent: transaction.stripePaymentIntentId,
          amount: amount ? Math.round(amount * 100) : undefined,
        })
        refundSuccess = refund.status === 'succeeded'
      } else if (transaction.xenditInvoiceId) {
        // Xendit refund implementation
        const response = await fetch('https://api.xendit.co/refunds', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY!).toString('base64')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            invoice_id: transaction.xenditInvoiceId,
            amount: amount || transaction.amount,
          }),
        })
        refundSuccess = response.ok
      }

      if (refundSuccess) {
        const updatedTransaction = await prisma.transaction.update({
          where: { bookingId },
          data: {
            status: 'refunded',
          },
        })

        return updatedTransaction
      }

      throw new Error('Refund failed')
    } catch (error) {
      console.error('Refund error:', error)
      throw new Error('Failed to process refund')
    }
  }

  async handleWebhook(event: any) {
    try {
      if (event.event === 'invoice.paid') {
        const invoice = event.data
        const transaction = await prisma.transaction.update({
          where: { xenditInvoiceId: invoice.id },
          data: {
            status: 'completed',
          },
        })

        // Update booking status
        await prisma.booking.update({
          where: { id: invoice.external_id },
          data: { status: 'confirmed' }
        })
        await emailTriggers.onPaymentConfirmed(transaction.id)
      } else if (event.event === 'invoice.failed') {
        const invoice = event.data
        const failedTransaction = await prisma.transaction.update({
          where: { xenditInvoiceId: invoice.id },
          data: {
            status: 'failed',
          },
        })
        await emailTriggers.onPaymentFailed(failedTransaction.id, invoice.failure_reason || 'Unknown error')
      } else {
        console.log(`Unhandled event type ${event.event}`)
      }

      return { received: true }
    } catch (error) {
      logger.error('Webhook error', error as Error, { context: 'payment-service' })
      throw new Error('Webhook processing failed')
    }
  }

  async healthCheck() {
    if (!stripe) {
      return { status: 'error', message: 'Payment service not configured - missing STRIPE_SECRET_KEY environment variable' }
    }

    try {
      // Test Stripe connection by listing payment methods (this is a lightweight call)
      await stripe.paymentMethods.list({ limit: 1 })
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
  return icons[method.toLowerCase()] || "/credit-card-icon.png"
}