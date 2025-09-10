import { prisma } from '@/lib/prisma'

export interface UserTier {
  id: string
  userId: string
  tier: string // new, bronze, silver, gold
  points: number
  totalListingsRented: number
  totalListingsOwned: number
  totalSuccessfulRentals: number
  createdAt: Date
  updatedAt: Date
}

export interface TierBenefits {
  tier: string
  maxListings: number
  discount: number
  prioritySupport: boolean
  dedicatedAccountManager: boolean
  featuredListings: boolean
}

class UserTierService {
  // Define tier benefits
  private tierBenefits: TierBenefits[] = [
    {
      tier: 'new',
      maxListings: 5,
      discount: 0,
      prioritySupport: false,
      dedicatedAccountManager: false,
      featuredListings: false
    },
    {
      tier: 'bronze',
      maxListings: 10,
      discount: 5,
      prioritySupport: false,
      dedicatedAccountManager: false,
      featuredListings: false
    },
    {
      tier: 'silver',
      maxListings: 25,
      discount: 10,
      prioritySupport: true,
      dedicatedAccountManager: false,
      featuredListings: false
    },
    {
      tier: 'gold',
      maxListings: Infinity,
      discount: 15,
      prioritySupport: true,
      dedicatedAccountManager: true,
      featuredListings: true
    }
  ]

  /**
   * Get user's current tier
   */
  async getUserTier(userId: string): Promise<UserTier | null> {
    try {
      const userTier = await prisma.userTier.findUnique({
        where: { userId }
      })
      return userTier
    } catch (error) {
      console.error('Error getting user tier:', error)
      throw new Error('Failed to get user tier')
    }
  }

  /**
   * Get tier benefits
   */
  getTierBenefits(tier: string): TierBenefits | null {
    const benefits = this.tierBenefits.find(b => b.tier === tier)
    return benefits || null
  }

  /**
   * Get all tier benefits
   */
  getAllTierBenefits(): TierBenefits[] {
    return this.tierBenefits
  }

  /**
   * Calculate user tier based on activity
   */
  async calculateUserTier(userId: string): Promise<{ tier: string; points: number }> {
    try {
      // Get user's rental and listing activity
      const userRentals = await prisma.booking.count({
        where: {
          userId,
          status: 'completed'
        }
      })

      const userListings = await prisma.listing.count({
        where: {
          ownerId: userId
        }
      })

      // Get user's reviews
      const userReviews = await prisma.review.findMany({
        where: {
          userId
        },
        select: {
          rating: true
        }
      })

      // Calculate points based on activity
      let points = userRentals + userListings

      // Adjust points based on review score
      if (userReviews.length > 0) {
        const averageRating = userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length
        
        if (averageRating >= 4) {
          points += 2
        } else if (averageRating >= 3) {
          points += 1
        } else if (averageRating <= 2) {
          points -= 1
        }
      }

      // Determine tier based on points
      let tier = 'new'
      if (points >= 50) {
        tier = 'gold'
      } else if (points >= 20) {
        tier = 'silver'
      } else if (points >= 5) {
        tier = 'bronze'
      }

      return { tier, points }
    } catch (error) {
      console.error('Error calculating user tier:', error)
      throw new Error('Failed to calculate user tier')
    }
  }

  /**
   * Update or create user tier
   */
  async updateUserTier(userId: string): Promise<UserTier> {
    try {
      // Calculate the new tier
      const { tier, points } = await this.calculateUserTier(userId)

      // Get user's rental and listing activity
      const totalListingsRented = await prisma.booking.count({
        where: {
          userId,
          status: 'completed'
        }
      })

      const totalListingsOwned = await prisma.listing.count({
        where: {
          ownerId: userId
        }
      })

      const totalSuccessfulRentals = totalListingsRented

      // Update or create user tier record
      const userTier = await prisma.userTier.upsert({
        where: { userId },
        update: {
          tier,
          points,
          totalListingsRented,
          totalListingsOwned,
          totalSuccessfulRentals,
          updatedAt: new Date()
        },
        create: {
          userId,
          tier,
          points,
          totalListingsRented,
          totalListingsOwned,
          totalSuccessfulRentals,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      return userTier
    } catch (error) {
      console.error('Error updating user tier:', error)
      throw new Error('Failed to update user tier')
    }
  }

  /**
   * Initialize user tier for new users
   */
  async initializeUserTier(userId: string): Promise<UserTier> {
    try {
      const userTier = await prisma.userTier.create({
        data: {
          userId,
          tier: 'new',
          points: 0,
          totalListingsRented: 0,
          totalListingsOwned: 0,
          totalSuccessfulRentals: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      return userTier
    } catch (error) {
      console.error('Error initializing user tier:', error)
      throw new Error('Failed to initialize user tier')
    }
  }
}

// Export singleton instance
export const userTierService = new UserTierService()