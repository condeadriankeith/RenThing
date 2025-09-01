import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { logger } from "@/lib/logger"

// GET /api/receipts/[transactionId] - Generate and download receipt
export async function GET(
  request: NextRequest,
  { params }: { params: { transactionId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { transactionId } = params

    // Fetch transaction with related data
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        booking: {
          include: {
            listing: {
              include: {
                owner: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                  }
                }
              }
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              }
            }
          }
        }
      }
    })

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found" },
        { status: 404 }
      )
    }

    // Verify user has access to this transaction
    if (transaction.booking.userId !== session.user.id && 
        transaction.booking.listing.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    // Generate receipt content (simplified - in production use a PDF library like puppeteer or jsPDF)
    const receiptContent = generateReceiptHTML(transaction)
    
    // For now, return as HTML with appropriate headers
    // In production, you'd want to convert this to PDF
    return new NextResponse(receiptContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="receipt-${transactionId}.html"`,
      },
    })

  } catch (error) {
    logger.error("Receipt generation error", error as Error, { context: "receipts" });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

function generateReceiptHTML(transaction: any): string {
  const { booking } = transaction
  const listing = booking.listing
  const user = booking.user
  const owner = listing.owner

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>RenThing Receipt - ${transaction.id}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          max-width: 600px; 
          margin: 0 auto; 
          padding: 20px;
          color: #333;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #3B82F6;
          padding-bottom: 20px;
        }
        .logo { 
          font-size: 24px; 
          font-weight: bold; 
          color: #3B82F6; 
        }
        .receipt-info { 
          background: #f8f9fa; 
          padding: 15px; 
          border-radius: 8px; 
          margin: 20px 0; 
        }
        .booking-details, .payment-details { 
          margin: 20px 0; 
        }
        .detail-row { 
          display: flex; 
          justify-content: space-between; 
          margin: 8px 0; 
        }
        .total-row { 
          font-weight: bold; 
          font-size: 18px; 
          border-top: 2px solid #ddd; 
          padding-top: 10px; 
        }
        .footer { 
          text-align: center; 
          margin-top: 40px; 
          padding-top: 20px; 
          border-top: 1px solid #ddd; 
          color: #666; 
          font-size: 12px; 
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">RenThing</div>
        <h2>Payment Receipt</h2>
      </div>

      <div class="receipt-info">
        <div class="detail-row">
          <span><strong>Receipt #:</strong></span>
          <span>${transaction.id}</span>
        </div>
        <div class="detail-row">
          <span><strong>Date:</strong></span>
          <span>${new Date(transaction.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="detail-row">
          <span><strong>Status:</strong></span>
          <span>${transaction.status.toUpperCase()}</span>
        </div>
      </div>

      <div class="booking-details">
        <h3>Booking Details</h3>
        <div class="detail-row">
          <span><strong>Item:</strong></span>
          <span>${listing.title}</span>
        </div>
        <div class="detail-row">
          <span><strong>Location:</strong></span>
          <span>${listing.location}</span>
        </div>
        <div class="detail-row">
          <span><strong>Rental Period:</strong></span>
          <span>${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</span>
        </div>
        <div class="detail-row">
          <span><strong>Customer:</strong></span>
          <span>${user.name} (${user.email})</span>
        </div>
        <div class="detail-row">
          <span><strong>Owner:</strong></span>
          <span>${owner.name} (${owner.email})</span>
        </div>
      </div>

      <div class="payment-details">
        <h3>Payment Summary</h3>
        <div class="detail-row">
          <span>Amount:</span>
          <span>₱${transaction.amount}</span>
        </div>
        <div class="detail-row">
          <span>Payment Method:</span>
          <span>${transaction.paymentMethod}</span>
        </div>
        <div class="detail-row">
          <span>Currency:</span>
          <span>${transaction.currency.toUpperCase()}</span>
        </div>
        <div class="detail-row total-row">
          <span>Total Paid:</span>
          <span>₱${transaction.amount}</span>
        </div>
      </div>

      <div class="footer">
        <p>Thank you for using RenThing!</p>
        <p>For support, contact us at support@renthing.com</p>
        <p>This is an automated receipt generated on ${new Date().toLocaleString()}</p>
      </div>
    </body>
    </html>
  `
}