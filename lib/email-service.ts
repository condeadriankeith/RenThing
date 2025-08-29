import nodemailer from 'nodemailer'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface EmailConfig {
  host: string
  port: number
  secure: boolean
  auth: {
    user: string
    pass: string
  }
}

interface EmailTemplate {
  subject: string
  html: string
  text: string
}

interface BookingDetails {
  bookingId: string
  listingTitle: string
  renterName: string
  renterEmail: string
  ownerName: string
  ownerEmail: string
  startDate: Date
  endDate: Date
  totalPrice: number
  listingLocation: string
  listingImages: string[]
}

interface PaymentDetails {
  transactionId: string
  amount: number
  currency: string
  paymentMethod: string
  status: string
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null

  constructor() {
    this.initializeTransporter()
  }

  private initializeTransporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn('Email service not configured - missing SMTP environment variables')
      return
    }

    const config: EmailConfig = {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    }

    this.transporter = nodemailer.createTransport(config)
  }

  private async sendEmail(to: string, template: EmailTemplate) {
    if (!this.transporter) {
      console.warn('Email service not configured - skipping email')
      return { success: false, error: 'Email service not configured' }
    }

    try {
      const info = await this.transporter.sendMail({
        from: process.env.FROM_EMAIL || process.env.SMTP_USER,
        to,
        subject: template.subject,
        html: template.html,
        text: template.text,
      })

      console.log('Email sent:', info.messageId)
      return { success: true, messageId: info.messageId }
    } catch (error) {
      console.error('Email send error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Failed to send email' }
    }
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  private formatCurrency(amount: number, currency: string = 'PHP'): string {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency,
    }).format(amount)
  }

  async sendBookingConfirmation(booking: BookingDetails) {
    const duration = Math.ceil((booking.endDate.getTime() - booking.startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Email to renter
    const renterTemplate: EmailTemplate = {
      subject: `Booking Confirmed: ${booking.listingTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Booking Confirmed!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your reservation is all set</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${booking.renterName},</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Great news! Your booking has been confirmed. Here are the details:
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Item:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.listingTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Location:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.listingLocation}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Start Date:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${this.formatDate(booking.startDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>End Date:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${this.formatDate(booking.endDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Duration:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${duration} day${duration > 1 ? 's' : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Total Price:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-size: 18px; font-weight: bold; color: #667eea;">
                    ${this.formatCurrency(booking.totalPrice)}
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #333;">Contact Information</h3>
              <p style="color: #666; line-height: 1.6;">
                <strong>Owner:</strong> ${booking.ownerName}<br>
                <strong>Email:</strong> ${booking.ownerEmail}
              </p>
            </div>
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea;">
              <p style="margin: 0; color: #333;">
                <strong>Need help?</strong> Contact us anytime at support@renthing.com
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Booking Confirmed: ${booking.listingTitle}

        Hello ${booking.renterName},

        Your booking has been confirmed!

        Booking Details:
        - Item: ${booking.listingTitle}
        - Location: ${booking.listingLocation}
        - Start Date: ${this.formatDate(booking.startDate)}
        - End Date: ${this.formatDate(booking.endDate)}
        - Total Price: ${this.formatCurrency(booking.totalPrice)}

        Owner: ${booking.ownerName} (${booking.ownerEmail})

        Need help? Contact us at support@renthing.com
      `,
    }

    // Email to owner
    const ownerTemplate: EmailTemplate = {
      subject: `New Booking: ${booking.listingTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">New Booking!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Your item has been booked</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${booking.ownerName},</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              You have a new booking! Here are the details:
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Booking Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Item:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.listingTitle}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Renter:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${booking.renterName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Start Date:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${this.formatDate(booking.startDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>End Date:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${this.formatDate(booking.endDate)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Total Earnings:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-size: 18px; font-weight: bold; color: #28a745;">
                    ${this.formatCurrency(booking.totalPrice)}
                  </td>
                </tr>
              </table>
            </div>
            
            <div style="margin: 30px 0;">
              <h3 style="color: #333;">Renter Contact</h3>
              <p style="color: #666; line-height: 1.6;">
                <strong>Name:</strong> ${booking.renterName}<br>
                <strong>Email:</strong> ${booking.renterEmail}
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        New Booking: ${booking.listingTitle}

        Hello ${booking.ownerName},

        You have a new booking!

        Booking Details:
        - Item: ${booking.listingTitle}
        - Renter: ${booking.renterName}
        - Start Date: ${this.formatDate(booking.startDate)}
        - End Date: ${this.formatDate(booking.endDate)}
        - Total Earnings: ${this.formatCurrency(booking.totalPrice)}

        Renter Contact:
        - Name: ${booking.renterName}
        - Email: ${booking.renterEmail}
      `,
    }

    // Send emails
    await Promise.all([
      this.sendEmail(booking.renterEmail, renterTemplate),
      this.sendEmail(booking.ownerEmail, ownerTemplate),
    ])
  }

  async sendBookingCancellation(booking: BookingDetails, reason?: string) {
    const template: EmailTemplate = {
      subject: `Booking Cancelled: ${booking.listingTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Booking Cancelled</h1>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello,</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              We're sorry to inform you that the following booking has been cancelled:
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Cancelled Booking</h3>
              <p><strong>Item:</strong> ${booking.listingTitle}</p>
              <p><strong>Start Date:</strong> ${this.formatDate(booking.startDate)}</p>
              <p><strong>End Date:</strong> ${this.formatDate(booking.endDate)}</p>
              ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            </div>
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #dc3545;">
              <p style="margin: 0; color: #333;">
                <strong>Questions?</strong> Contact us at support@renthing.com
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
        Booking Cancelled: ${booking.listingTitle}

        The booking for ${booking.listingTitle} from ${this.formatDate(booking.startDate)} to ${this.formatDate(booking.endDate)} has been cancelled.
        ${reason ? `Reason: ${reason}` : ''}

        Contact us at support@renthing.com for any questions.
      `,
    }

    await Promise.all([
      this.sendEmail(booking.renterEmail, template),
      this.sendEmail(booking.ownerEmail, template),
    ])
  }

  async sendPaymentConfirmation(email: string, payment: PaymentDetails, booking: BookingDetails) {
    const template: EmailTemplate = {
      subject: `Payment Confirmed: ${this.formatCurrency(payment.amount)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Payment Confirmed!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">${this.formatCurrency(payment.amount)} processed successfully</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello,</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Your payment has been confirmed. Here are the details:
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Payment Details</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Amount:</strong></td>
                  <td style="padding: 8px 0; color: #333; font-size: 18px; font-weight: bold; color: #28a745;">
                    ${this.formatCurrency(payment.amount)}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Transaction ID:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${payment.transactionId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Payment Method:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${payment.paymentMethod}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;"><strong>Status:</strong></td>
                  <td style="padding: 8px 0; color: #333;">${payment.status}</td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      `,
      text: `
        Payment Confirmed: ${this.formatCurrency(payment.amount)}

        Payment has been confirmed:
        - Amount: ${this.formatCurrency(payment.amount)}
        - Transaction ID: ${payment.transactionId}
        - Payment Method: ${payment.paymentMethod}
        - Status: ${payment.status}
      `,
    }

    await this.sendEmail(email, template)
  }

  async sendWelcomeEmail(email: string, name: string) {
    const template: EmailTemplate = {
      subject: 'Welcome to RenThing!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to RenThing!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Start renting and earning today</p>
          </div>
          
          <div style="padding: 30px; background: white;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${name},</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              Welcome to RenThing! We're excited to have you join our community of renters and owners.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">Get Started</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Browse thousands of items available for rent</li>
                <li>List your own items and start earning</li>
                <li>Enjoy secure payments and 24/7 support</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
                 style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Start Exploring
              </a>
            </div>
          </div>
        </div>
      `,
      text: `
        Welcome to RenThing, ${name}!

        We're excited to have you join our community of renters and owners.

        Get started by:
        - Browsing items available for rent
        - Listing your own items to earn money
        - Enjoying secure payments and support

        Visit us at: ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
      `,
    }

    await this.sendEmail(email, template)
  }
}

export const emailService = new EmailService()

// Helper function to get booking details for emails
export async function getBookingEmailDetails(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: {
        include: {
          images: {
            take: 1,
            select: { url: true }
          },
          owner: {
            select: { name: true, email: true }
          }
        }
      },
      renter: {
        select: { name: true, email: true }
      }
    }
  })

  if (!booking) return null

  return {
    bookingId: booking.id,
    listingTitle: booking.listing.title,
    renterName: booking.renter.name,
    renterEmail: booking.renter.email,
    ownerName: booking.listing.owner.name,
    ownerEmail: booking.listing.owner.email,
    startDate: booking.startDate,
    endDate: booking.endDate,
    totalPrice: booking.totalPrice,
    listingLocation: booking.listing.location,
    listingImages: booking.listing.images.map(img => img.url),
  }
}
