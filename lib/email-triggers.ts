import { PrismaClient } from '@prisma/client'
import { EmailService } from './email-service'
import { emailTemplates, generateEmailHTML } from './email-templates'

const prisma = new PrismaClient()
const emailService = new EmailService()

export class EmailTriggers {
  static async onBookingCreated(bookingId: string) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          user: true,
          listing: {
            include: {
              user: true,
            },
          },
        },
      })

      if (!booking) return

      const duration = Math.ceil(
        (new Date(booking.endDate).getTime() - new Date(booking.startDate).getTime()) /
        (1000 * 60 * 60 * 24)
      )

      const variables = {
        renterName: booking.user.name,
        listingTitle: booking.listing.title,
        listingLocation: booking.listing.location,
        startDate: booking.startDate.toLocaleDateString(),
        endDate: booking.endDate.toLocaleDateString(),
        totalPrice: `$${booking.totalPrice}`,
        duration: `${duration} day${duration > 1 ? 's' : ''}`,
        ownerName: booking.listing.user.name,
        ownerEmail: booking.listing.user.email,
      }

      // Send confirmation to renter
      await emailService.sendEmail({
        to: booking.user.email,
        subject: emailTemplates.booking.confirmation.subject(booking.listing.title),
        html: generateEmailHTML(this.getBookingConfirmationHTML(), variables),
        text: this.getBookingConfirmationText(variables),
      })

      // Send notification to owner
      await emailService.sendEmail({
        to: booking.listing.user.email,
        subject: emailTemplates.listing.newBooking.subject(booking.listing.title),
        html: generateEmailHTML(this.getNewBookingHTML(), {
          ...variables,
          totalAmount: `$${booking.totalPrice}`,
        }),
        text: this.getNewBookingText({
          ...variables,
          totalAmount: `$${booking.totalPrice}`,
        }),
      })
    } catch (error) {
      console.error('Error sending booking confirmation emails:', error)
    }
  }

  static async onBookingCancelled(bookingId: string, reason?: string) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          user: true,
          listing: {
            include: {
              user: true,
            },
          },
        },
      })

      if (!booking) return

      const variables = {
        listingTitle: booking.listing.title,
        startDate: booking.startDate.toLocaleDateString(),
        endDate: booking.endDate.toLocaleDateString(),
        reason: reason || 'No reason provided',
        refundAmount: `$${booking.totalPrice}`,
      }

      // Send cancellation to renter
      await emailService.sendEmail({
        to: booking.user.email,
        subject: emailTemplates.booking.cancellation.subject(booking.listing.title),
        html: generateEmailHTML(this.getCancellationHTML(), variables),
        text: this.getCancellationText(variables),
      })

      // Send cancellation to owner
      await emailService.sendEmail({
        to: booking.listing.user.email,
        subject: emailTemplates.listing.bookingCancelled.subject(booking.listing.title),
        html: generateEmailHTML(this.getOwnerCancellationHTML(), variables),
        text: this.getOwnerCancellationText(variables),
      })
    } catch (error) {
      console.error('Error sending booking cancellation emails:', error)
    }
  }

  static async onPaymentConfirmed(paymentId: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          booking: {
            include: {
              user: true,
              listing: true,
            },
          },
        },
      })

      if (!payment) return

      const variables = {
        amount: `$${payment.amount}`,
        currency: payment.currency,
        transactionId: payment.id,
        paymentMethod: payment.paymentMethod,
        listingTitle: payment.booking.listing.title,
        bookingId: payment.bookingId,
      }

      await emailService.sendEmail({
        to: payment.booking.user.email,
        subject: emailTemplates.payment.confirmation.subject(`$${payment.amount}`),
        html: generateEmailHTML(this.getPaymentConfirmationHTML(), variables),
        text: this.getPaymentConfirmationText(variables),
      })
    } catch (error) {
      console.error('Error sending payment confirmation email:', error)
    }
  }

  static async onPaymentFailed(paymentId: string, errorMessage: string) {
    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: {
          booking: {
            include: {
              user: true,
              listing: true,
            },
          },
        },
      })

      if (!payment) return

      const variables = {
        amount: `$${payment.amount}`,
        currency: payment.currency,
        listingTitle: payment.booking.listing.title,
        error: errorMessage,
      }

      await emailService.sendEmail({
        to: payment.booking.user.email,
        subject: emailTemplates.payment.failed.subject,
        html: generateEmailHTML(this.getPaymentFailedHTML(), variables),
        text: this.getPaymentFailedText(variables),
      })
    } catch (error) {
      console.error('Error sending payment failed email:', error)
    }
  }

  static async onUserWelcome(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (!user) return

      const variables = {
        userName: user.name || user.email,
        verificationUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${user.emailVerificationToken}`,
      }

      await emailService.sendEmail({
        to: user.email,
        subject: emailTemplates.user.welcome.subject,
        html: generateEmailHTML(this.getWelcomeHTML(), variables),
        text: this.getWelcomeText(variables),
      })
    } catch (error) {
      console.error('Error sending welcome email:', error)
    }
  }

  static async onBookingReminder(bookingId: string) {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId },
        include: {
          user: true,
          listing: true,
        },
      })

      if (!booking) return

      const daysUntil = Math.ceil(
        (new Date(booking.startDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
      )

      if (daysUntil <= 0) return

      const variables = {
        renterName: booking.user.name,
        listingTitle: booking.listing.title,
        listingLocation: booking.listing.location,
        startDate: booking.startDate.toLocaleDateString(),
        endDate: booking.endDate.toLocaleDateString(),
        daysUntil: daysUntil.toString(),
      }

      await emailService.sendEmail({
        to: booking.user.email,
        subject: emailTemplates.booking.reminder.subject(booking.listing.title),
        html: generateEmailHTML(this.getBookingReminderHTML(), variables),
        text: this.getBookingReminderText(variables),
      })
    } catch (error) {
      console.error('Error sending booking reminder email:', error)
    }
  }

  // HTML Templates
  private static getBookingConfirmationHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Booking Confirmed!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your reservation is all set</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello {{renterName}},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Great news! Your booking for <strong>{{listingTitle}}</strong> has been confirmed. 
            Here are the details:
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
            <p><strong>Location:</strong> {{listingLocation}}</p>
            <p><strong>Start Date:</strong> {{startDate}}</p>
            <p><strong>End Date:</strong> {{endDate}}</p>
            <p><strong>Duration:</strong> {{duration}}</p>
            <p><strong>Total Price:</strong> {{totalPrice}}</p>
          </div>
          
          <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
            <p style="margin: 0; color: #333;">
              <strong>Contact Owner:</strong> {{ownerName}} - {{ownerEmail}}
            </p>
          </div>
        </div>
      </div>
    `
  }

  private static getNewBookingHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">New Booking!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Someone wants to rent your item</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello {{ownerName}},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            You have a new booking request for <strong>{{listingTitle}}</strong> from {{renterName}}.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #333;">Booking Details</h3>
            <p><strong>Renter:</strong> {{renterName}}</p>
            <p><strong>Duration:</strong> {{duration}}</p>
            <p><strong>Total Amount:</strong> {{totalAmount}}</p>
          </div>
        </div>
      </div>
    `
  }

  private static getCancellationHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Booking Cancelled</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your booking has been cancelled</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello,</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Your booking for <strong>{{listingTitle}}</strong> has been cancelled.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Original Dates:</strong> {{startDate}} - {{endDate}}</p>
            <p><strong>Reason:</strong> {{reason}}</p>
            <p><strong>Refund Amount:</strong> {{refundAmount}}</p>
          </div>
        </div>
      </div>
    `
  }

  private static getPaymentConfirmationHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Payment Confirmed</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your payment has been processed successfully</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello,</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Your payment has been confirmed for <strong>{{listingTitle}}</strong>.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount:</strong> {{amount}} {{currency}}</p>
            <p><strong>Transaction ID:</strong> {{transactionId}}</p>
            <p><strong>Payment Method:</strong> {{paymentMethod}}</p>
            <p><strong>Booking ID:</strong> {{bookingId}}</p>
          </div>
        </div>
      </div>
    `
  }

  // Text-only templates for email clients that don't support HTML
  private static getBookingConfirmationText(variables: Record<string, string>): string {
    return `
Booking Confirmed!

Hello ${variables.renterName},

Your booking for ${variables.listingTitle} has been confirmed.

Details:
- Location: ${variables.listingLocation}
- Start Date: ${variables.startDate}
- End Date: ${variables.endDate}
- Duration: ${variables.duration}
- Total Price: ${variables.totalPrice}

Contact Owner: ${variables.ownerName} - ${variables.ownerEmail}

Best regards,
RenThing Team
    `.trim()
  }

  private static getNewBookingText(variables: Record<string, string>): string {
    return `
New Booking!

Hello ${variables.ownerName},

You have a new booking for ${variables.listingTitle} from ${variables.renterName}.

Details:
- Duration: ${variables.duration}
- Total Amount: ${variables.totalAmount}

Best regards,
RenThing Team
    `.trim()
  }

  private static getCancellationText(variables: Record<string, string>): string {
    return `
Booking Cancelled

Hello,

Your booking for ${variables.listingTitle} has been cancelled.

Details:
- Original Dates: ${variables.startDate} - ${variables.endDate}
- Reason: ${variables.reason}
- Refund Amount: ${variables.refundAmount}

Best regards,
RenThing Team
    `.trim()
  }

  private static getPaymentConfirmationText(variables: Record<string, string>): string {
    return `
Payment Confirmed

Hello,

Your payment has been confirmed for ${variables.listingTitle}.

Details:
- Amount: ${variables.amount} ${variables.currency}
- Transaction ID: ${variables.transactionId}
- Payment Method: ${variables.paymentMethod}
- Booking ID: ${variables.bookingId}

Best regards,
RenThing Team
    `.trim()
  }

  // Additional templates...
  private static getPaymentFailedHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Payment Failed</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">There was an issue processing your payment</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello,</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Your payment for <strong>{{listingTitle}}</strong> could not be processed.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Amount:</strong> {{amount}} {{currency}}</p>
            <p><strong>Error:</strong> {{error}}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/bookings" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Try Again
            </a>
          </div>
        </div>
      </div>
    `
  }

  private static getWelcomeHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to RenThing!</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Start renting today</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello {{userName}},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Welcome to RenThing! We're excited to have you join our community of renters and owners.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="{{verificationUrl}}" 
               style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verify Your Email
            </a>
          </div>
        </div>
      </div>
    `
  }

  private static getBookingReminderHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Upcoming Booking</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Your booking is approaching</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello {{renterName}},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            Just a friendly reminder that your booking for <strong>{{listingTitle}}</strong> starts in {{daysUntil}} days.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Location:</strong> {{listingLocation}}</p>
            <p><strong>Start Date:</strong> {{startDate}}</p>
            <p><strong>End Date:</strong> {{endDate}}</p>
          </div>
        </div>
      </div>
    `
  }

  private static getPaymentFailedText(variables: Record<string, string>): string {
    return `
Payment Failed

Hello,

Your payment for ${variables.listingTitle} could not be processed.

Details:
- Amount: ${variables.amount} ${variables.currency}
- Error: ${variables.error}

Please try again or contact support.

Best regards,
RenThing Team
    `.trim()
  }

  private static getWelcomeText(variables: Record<string, string>): string {
    return `
Welcome to RenThing!

Hello ${variables.userName},

Welcome to RenThing! We're excited to have you join our community.

Please verify your email: ${variables.verificationUrl}

Best regards,
RenThing Team
    `.trim()
  }

  private static getBookingReminderText(variables: Record<string, string>): string {
    return `
Upcoming Booking Reminder

Hello ${variables.renterName},

Your booking for ${variables.listingTitle} starts in ${variables.daysUntil} days.

Details:
- Location: ${variables.listingLocation}
- Start Date: ${variables.startDate}
- End Date: ${variables.endDate}

Best regards,
RenThing Team
    `.trim()
  }

  private static getOwnerCancellationHTML(): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); padding: 40px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px;">Booking Cancelled</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">A booking has been cancelled</p>
        </div>
        
        <div style="padding: 30px; background: white;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello {{ownerName}},</h2>
          <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
            The booking for <strong>{{listingTitle}}</strong> by {{renterName}} has been cancelled.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Original Dates:</strong> {{startDate}} - {{endDate}}</p>
            <p><strong>Reason:</strong> {{reason}}</p>
          </div>
        </div>
      </div>
    `
  }

  private static getOwnerCancellationText(variables: Record<string, string>): string {
    return `
Booking Cancelled

Hello ${variables.ownerName},

The booking for ${variables.listingTitle} by ${variables.renterName} has been cancelled.

Details:
- Original Dates: ${variables.startDate} - ${variables.endDate}
- Reason: ${variables.reason}

Best regards,
RenThing Team
    `.trim()
  }
}

// Export individual trigger functions for easier usage
export const emailTriggers = {
  onBookingCreated: EmailTriggers.onBookingCreated,
  onBookingCancelled: EmailTriggers.onBookingCancelled,
  onPaymentConfirmed: EmailTriggers.onPaymentConfirmed,
  onPaymentFailed: EmailTriggers.onPaymentFailed,
  onUserWelcome: EmailTriggers.onUserWelcome,
  onBookingReminder: EmailTriggers.onBookingReminder,
}