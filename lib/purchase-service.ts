import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

// Update interfaces to match what Prisma actually returns (with null values)
export interface Purchase {
  id: string
  userId: string
  itemType: string // badge, voucher
  itemId: string | null
  amount: number
  currency: string
  status: string
  createdAt: Date
}

export interface Voucher {
  id: string
  userId: string
  voucherType: string // item, owner, seasonal
  code: string
  discount: number
  expiresAt: Date | null
  used: boolean
  usedAt: Date | null
  createdAt: Date
}

export interface UserBadge {
  id: string
  userId: string
  badgeType: string // verified, gold_owner, gold_renter
  purchaseId: string | null
  expiresAt: Date | null
  createdAt: Date
}

export interface VoucherRedemptionResult {
  success: boolean
  error?: string
  discount?: number
  voucherType?: string
}

class PurchaseService {
  /**
   * Get available items for purchase
   */
  async getAvailableItems(): Promise<any[]> {
    // Define available items for purchase
    const items = [
      {
        id: 'verified-badge',
        type: 'badge',
        name: 'Verified Badge',
        description: 'Verification badge on profile, increased trust score',
        price: 199,
        currency: 'PHP',
        duration: '1 year'
      },
      {
        id: 'gold-renter-status',
        type: 'badge',
        name: 'Gold Renter Status',
        description: 'All Gold tier benefits regardless of activity level',
        price: 499,
        currency: 'PHP',
        duration: '1 month'
      },
      {
        id: 'gold-renter-status-yearly',
        type: 'badge',
        name: 'Gold Renter Status (Yearly)',
        description: 'All Gold tier benefits regardless of activity level',
        price: 4999,
        currency: 'PHP',
        duration: '1 year'
      },
      {
        id: 'item-voucher-100',
        type: 'voucher',
        name: 'Item Voucher (₱100)',
        description: '₱100 voucher for specific categories',
        price: 100,
        currency: 'PHP'
      },
      {
        id: 'item-voucher-200',
        type: 'voucher',
        name: 'Item Voucher (₱200)',
        description: '₱200 voucher for specific categories',
        price: 200,
        currency: 'PHP'
      },
      {
        id: 'item-voucher-500',
        type: 'voucher',
        name: 'Item Voucher (₱500)',
        description: '₱500 voucher for specific categories',
        price: 500,
        currency: 'PHP'
      }
    ]
    
    return items
  }

  /**
   * Create a new purchase
   */
  async createPurchase(data: {
    userId: string
    itemType: string
    itemId?: string
    amount: number
    currency?: string
  }): Promise<Purchase> {
    if (!prisma) {
      throw new Error('Database not available')
    }
    
    try {
      const purchase = await prisma.purchase.create({
        data: {
          userId: data.userId,
          itemType: data.itemType,
          itemId: data.itemId || null,
          amount: data.amount,
          currency: data.currency || 'PHP',
          status: 'completed',
          createdAt: new Date()
        }
      })
      return purchase
    } catch (error) {
      console.error('Error creating purchase:', error)
      throw new Error('Failed to create purchase')
    }
  }

  /**
   * Get user's purchase history
   */
  async getUserPurchases(userId: string): Promise<Purchase[]> {
    if (!prisma) {
      throw new Error('Database not available')
    }
    
    try {
      const purchases = await prisma.purchase.findMany({
        where: { userId },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return purchases
    } catch (error) {
      console.error('Error getting user purchases:', error)
      throw new Error('Failed to get user purchases')
    }
  }

  /**
   * Redeem a voucher code
   */
  async redeemVoucher(code: string, userId: string): Promise<VoucherRedemptionResult> {
    if (!prisma) {
      return { success: false, error: 'Database not available' }
    }
    
    try {
      const voucher = await prisma.voucher.findUnique({
        where: { code }
      })

      if (!voucher) {
        return { success: false, error: 'Invalid voucher code' }
      }

      if (voucher.used) {
        return { success: false, error: 'Voucher already used' }
      }

      if (voucher.expiresAt && voucher.expiresAt < new Date()) {
        return { success: false, error: 'Voucher expired' }
      }

      // Mark voucher as used
      await prisma.voucher.update({
        where: { id: voucher.id },
        data: {
          used: true,
          usedAt: new Date(),
          userId: userId
        }
      })

      return {
        success: true,
        discount: voucher.discount,
        voucherType: voucher.voucherType
      }
    } catch (error) {
      console.error('Error redeeming voucher:', error)
      return { success: false, error: 'Failed to redeem voucher' }
    }
  }

  /**
   * Get user's active badges
   */
  async getUserBadges(userId: string): Promise<UserBadge[]> {
    if (!prisma) {
      throw new Error('Database not available')
    }
    
    try {
      const badges = await prisma.userBadge.findMany({
        where: {
          userId,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } }
          ]
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
      return badges
    } catch (error) {
      console.error('Error getting user badges:', error)
      throw new Error('Failed to get user badges')
    }
  }

  /**
   * Create a user badge
   */
  async createUserBadge(data: {
    userId: string
    badgeType: string
    purchaseId?: string
    expiresAt?: Date
  }): Promise<UserBadge> {
    if (!prisma) {
      throw new Error('Database not available')
    }
    
    try {
      const badge = await prisma.userBadge.create({
        data: {
          userId: data.userId,
          badgeType: data.badgeType,
          purchaseId: data.purchaseId || null,
          expiresAt: data.expiresAt || null,
          createdAt: new Date()
        }
      })
      return badge
    } catch (error) {
      console.error('Error creating user badge:', error)
      throw new Error('Failed to create user badge')
    }
  }

  /**
   * Create a voucher
   */
  async createVoucher(data: {
    userId: string
    voucherType: string
    discount: number
    expiresAt?: Date
  }): Promise<Voucher> {
    if (!prisma) {
      throw new Error('Database not available')
    }
    
    try {
      // Generate a unique voucher code
      const code = `V${uuidv4().substring(0, 8).toUpperCase()}`
      
      const voucher = await prisma.voucher.create({
        data: {
          userId: data.userId,
          voucherType: data.voucherType,
          code,
          discount: data.discount,
          expiresAt: data.expiresAt || null,
          used: false,
          createdAt: new Date()
        }
      })
      return voucher
    } catch (error) {
      console.error('Error creating voucher:', error)
      throw new Error('Failed to create voucher')
    }
  }
}

// Export singleton instance
export const purchaseService = new PurchaseService()