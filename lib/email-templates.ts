export const emailTemplates = {
  booking: {
    confirmation: {
      subject: (listingTitle: string) => `Booking Confirmed: ${listingTitle}`,
      variables: [
        'renterName',
        'listingTitle',
        'listingLocation',
        'startDate',
        'endDate',
        'totalPrice',
        'duration',
        'ownerName',
        'ownerEmail',
      ],
    },
    cancellation: {
      subject: (listingTitle: string) => `Booking Cancelled: ${listingTitle}`,
      variables: [
        'listingTitle',
        'startDate',
        'endDate',
        'reason',
        'refundAmount',
      ],
    },
    reminder: {
      subject: (listingTitle: string) => `Upcoming Booking: ${listingTitle}`,
      variables: [
        'renterName',
        'listingTitle',
        'listingLocation',
        'startDate',
        'endDate',
        'daysUntil',
      ],
    },
    review: {
      subject: (listingTitle: string) => `Leave a Review: ${listingTitle}`,
      variables: [
        'renterName',
        'listingTitle',
        'bookingId',
      ],
    },
  },
  payment: {
    confirmation: {
      subject: (amount: string) => `Payment Confirmed: ${amount}`,
      variables: [
        'amount',
        'currency',
        'transactionId',
        'paymentMethod',
        'listingTitle',
        'bookingId',
      ],
    },
    refund: {
      subject: (amount: string) => `Refund Processed: ${amount}`,
      variables: [
        'amount',
        'currency',
        'transactionId',
        'reason',
        'refundId',
      ],
    },
    failed: {
      subject: 'Payment Failed',
      variables: [
        'amount',
        'currency',
        'listingTitle',
        'error',
      ],
    },
  },
  user: {
    welcome: {
      subject: 'Welcome to RenThing!',
      variables: [
        'userName',
        'verificationUrl',
      ],
    },
    verification: {
      subject: 'Verify Your Email Address',
      variables: [
        'userName',
        'verificationUrl',
      ],
    },
    passwordReset: {
      subject: 'Reset Your Password',
      variables: [
        'userName',
        'resetUrl',
        'expiryHours',
      ],
    },
  },
  listing: {
    newBooking: {
      subject: (listingTitle: string) => `New Booking: ${listingTitle}`,
      variables: [
        'ownerName',
        'listingTitle',
        'renterName',
        'startDate',
        'endDate',
        'totalAmount',
      ],
    },
    bookingCancelled: {
      subject: (listingTitle: string) => `Booking Cancelled: ${listingTitle}`,
      variables: [
        'ownerName',
        'listingTitle',
        'renterName',
        'startDate',
        'endDate',
        'reason',
      ],
    },
  },
}

export function generateEmailHTML(template: string, variables: Record<string, string>): string {
  const patterns = {
    '{{userName}}': variables.userName || 'User',
    '{{listingTitle}}': variables.listingTitle || 'Listing',
    '{{listingLocation}}': variables.listingLocation || 'Location',
    '{{startDate}}': variables.startDate || 'Start Date',
    '{{endDate}}': variables.endDate || 'End Date',
    '{{totalPrice}}': variables.totalPrice || '$0',
    '{{duration}}': variables.duration || '1 day',
    '{{ownerName}}': variables.ownerName || 'Owner',
    '{{ownerEmail}}': variables.ownerEmail || 'owner@example.com',
    '{{renterName}}': variables.renterName || 'Renter',
    '{{renterEmail}}': variables.renterEmail || 'renter@example.com',
    '{{amount}}': variables.amount || '$0',
    '{{currency}}': variables.currency || 'USD',
    '{{transactionId}}': variables.transactionId || 'N/A',
    '{{paymentMethod}}': variables.paymentMethod || 'Card',
    '{{bookingId}}': variables.bookingId || 'N/A',
    '{{reason}}': variables.reason || 'No reason provided',
    '{{refundAmount}}': variables.refundAmount || '$0',
    '{{daysUntil}}': variables.daysUntil || '1',
    '{{verificationUrl}}': variables.verificationUrl || '#',
    '{{resetUrl}}': variables.resetUrl || '#',
    '{{expiryHours}}': variables.expiryHours || '24',
    '{{error}}': variables.error || 'Unknown error',
    '{{refundId}}': variables.refundId || 'N/A',
    '{{totalAmount}}': variables.totalAmount || '$0',
  }

  let processedTemplate = template
  Object.entries(patterns).forEach(([pattern, value]) => {
    processedTemplate = processedTemplate.replace(new RegExp(pattern, 'g'), value)
  })

  return processedTemplate
}

export const baseEmailTemplate = `
  <div style="font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.02em;">{{title}}</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">{{subtitle}}</p>
    </div>
    
    <div style="padding: 30px; background: white;">
      <h2 style="color: #333; margin-bottom: 20px;">Hello {{userName}},</h2>
      <div style="color: #666; line-height: 1.6; margin-bottom: 25px;">
        {{content}}
      </div>
      
      {{#if showAction}}
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{actionUrl}}" 
           style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
          {{actionText}}
        </a>
      </div>
      {{/if}}
      
      <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; margin-top: 30px;">
        <p style="margin: 0; color: #333;">
          <strong>Need help?</strong> Contact us at support@renthing.com
        </p>
      </div>
    </div>
    
    <div style="background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
      <p style="margin: 0; color: #666; font-size: 14px;">
        RenThing - Rent Anything, Anytime<br>
        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}" 
           style="color: #667eea; text-decoration: none;">
          ${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
        </a>
      </p>
    </div>
  </div>
`

// Pre-defined email templates with consistent styling
export const emailStyles = {
  colors: {
    primary: '#667eea',
    secondary: '#764ba2',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    text: '#333',
    muted: '#666',
    light: '#f8f9fa',
  },
  fonts: {
    family: 'Arial, sans-serif',
    size: {
      small: '14px',
      normal: '16px',
      large: '18px',
      title: '28px',
    },
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px',
    xl: '32px',
  },
}