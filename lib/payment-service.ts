import { prisma } from '@/lib/prisma'
import { emailTriggers } from './email-triggers'
import { logger } from '@/lib/logger'

export interface Transaction {
  id: string
  xenditInvoiceId: string
  amount: number
  currency: string
  status: "pending" | "completed" | "failed" | "refunded"
  paymentMethod: "xendit"
  bookingId: string
  userId: string
  created: string
  updated: string
}

class PaymentService {

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
  }) {
    try {
      const transaction = await prisma.transaction.create({
        data: {
          bookingId: data.bookingId,
          amount: data.amount,
          currency: data.currency,
          paymentMethod: data.paymentMethod,
          status: 'pending',
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

      if (transaction.xenditInvoiceId) {
        // Check Xendit payment status
        const response = await fetch(`https://api.xendit.co/v2/invoices/${transaction.xenditInvoiceId}`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(process.env.XENDIT_SECRET_KEY!).toString('base64')}`
          }
        });
        
        if (response.ok) {
          const invoice = await response.json();
          if (invoice.status === 'PAID') {
            await prisma.transaction.update({
              where: { id: transactionId },
              data: { status: 'completed' }
            });
            
            await prisma.booking.update({
              where: { id: transaction.bookingId },
              data: { status: 'confirmed' }
            });

            return { success: true, transaction };
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

      if (transaction.xenditInvoiceId) {
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
      logger.error('Webhook error', error as Error, { context: 'payment-service' });
      throw new Error('Webhook processing failed')
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
