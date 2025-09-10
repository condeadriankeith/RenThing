import { prisma } from '@/lib/prisma'

export interface CommissionRate {
  id: string
  durationType: string // daily, weekly, monthly
  rate: number // percentage (e.g., 7.0 for 7%)
  createdAt: Date
  updatedAt: Date
}

export interface CommissionCalculation {
  amount: number
  durationType: string
  commission: number
  total: number
}

class CommissionService {
  /**
   * Get all commission rates
   */
  async getCommissionRates(): Promise<CommissionRate[]> {
    try {
      const rates = await prisma.commissionRate.findMany({
        orderBy: {
          createdAt: 'asc'
        }
      })
      return rates
    } catch (error) {
      console.error('Error getting commission rates:', error)
      throw new Error('Failed to get commission rates')
    }
  }

  /**
   * Get commission rate by duration type
   */
  async getCommissionRateByDuration(durationType: string): Promise<CommissionRate | null> {
    try {
      const rate = await prisma.commissionRate.findFirst({
        where: {
          durationType: durationType
        }
      })
      return rate
    } catch (error) {
      console.error('Error getting commission rate:', error)
      throw new Error('Failed to get commission rate')
    }
  }

  /**
   * Calculate commission based on amount and duration type
   */
  async calculateCommission(amount: number, durationType: string): Promise<CommissionCalculation> {
    try {
      // Get the commission rate for the duration type
      const rate = await this.getCommissionRateByDuration(durationType)
      
      // If no specific rate found, use default rate of 7%
      const commissionRate = rate ? rate.rate : 7.0
      
      // Calculate commission
      const commission = amount * (commissionRate / 100)
      const total = amount + commission
      
      return {
        amount,
        durationType,
        commission: parseFloat(commission.toFixed(2)),
        total: parseFloat(total.toFixed(2))
      }
    } catch (error) {
      console.error('Error calculating commission:', error)
      throw new Error('Failed to calculate commission')
    }
  }

  /**
   * Initialize default commission rates
   */
  async initializeDefaultRates(): Promise<void> {
    try {
      // Check if rates already exist
      const existingRates = await prisma.commissionRate.count()
      
      if (existingRates === 0) {
        // Create default commission rates
        await prisma.commissionRate.createMany({
          data: [
            {
              durationType: 'daily',
              rate: 7.0
            },
            {
              durationType: 'weekly',
              rate: 5.0
            },
            {
              durationType: 'monthly',
              rate: 3.0
            }
          ]
        })
      }
    } catch (error) {
      console.error('Error initializing default commission rates:', error)
      throw new Error('Failed to initialize default commission rates')
    }
  }

  /**
   * Update commission rate
   */
  async updateCommissionRate(id: string, rate: number): Promise<CommissionRate> {
    try {
      const updatedRate = await prisma.commissionRate.update({
        where: { id },
        data: { rate, updatedAt: new Date() }
      })
      return updatedRate
    } catch (error) {
      console.error('Error updating commission rate:', error)
      throw new Error('Failed to update commission rate')
    }
  }
}

// Export singleton instance
export const commissionService = new CommissionService()