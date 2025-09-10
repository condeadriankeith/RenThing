import { prisma } from '@/lib/prisma'

export interface Achievement {
  id: string
  userId: string
  type: string
  title: string
  description: string
  icon: string | null
  earnedAt: Date
  expiresAt?: Date
}

export interface CreateAchievementData {
  userId: string
  type: string
  title: string
  description: string
  icon?: string
  expiresAt?: Date
}

class AchievementService {
  /**
   * Create a new achievement for a user
   */
  async createAchievement(data: CreateAchievementData): Promise<Achievement> {
    try {
      const achievement = await prisma.achievement.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          description: data.description,
          icon: data.icon || null,
          expiresAt: data.expiresAt
        }
      })
      return achievement
    } catch (error) {
      console.error('Error creating achievement:', error)
      throw new Error('Failed to create achievement')
    }
  }

  /**
   * Get all achievements for a user
   */
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const achievements = await prisma.achievement.findMany({
        where: {
          userId,
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } }
          ]
        },
        orderBy: {
          earnedAt: 'desc'
        }
      })
      return achievements
    } catch (error) {
      console.error('Error fetching user achievements:', error)
      throw new Error('Failed to fetch user achievements')
    }
  }

  /**
   * Check if user has a specific achievement
   */
  async hasAchievement(userId: string, achievementType: string): Promise<boolean> {
    try {
      const achievement = await prisma.achievement.findFirst({
        where: {
          userId,
          type: achievementType,
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: new Date() } }
          ]
        }
      })
      return !!achievement
    } catch (error) {
      console.error('Error checking user achievement:', error)
      throw new Error('Failed to check user achievement')
    }
  }

  /**
   * Award rental milestone achievements
   */
  async awardRentalMilestones(userId: string, totalRentals: number): Promise<void> {
    try {
      // Check and award first rental achievement
      if (totalRentals >= 1 && !(await this.hasAchievement(userId, 'first-rental'))) {
        await this.createAchievement({
          userId,
          type: 'milestone',
          title: 'First Rental',
          description: 'Completed your first rental on RenThing',
          icon: 'calendar'
        })
      }

      // Check and award 10 rentals achievement
      if (totalRentals >= 10 && !(await this.hasAchievement(userId, '10-rentals'))) {
        await this.createAchievement({
          userId,
          type: 'milestone',
          title: '10 Rentals',
          description: 'Completed 10 rentals on RenThing',
          icon: 'shopping-bag'
        })
      }

      // Check and award 50 rentals achievement
      if (totalRentals >= 50 && !(await this.hasAchievement(userId, '50-rentals'))) {
        await this.createAchievement({
          userId,
          type: 'milestone',
          title: '50 Rentals',
          description: 'Completed 50 rentals on RenThing',
          icon: 'crown'
        })
      }
    } catch (error) {
      console.error('Error awarding rental milestones:', error)
    }
  }

  /**
   * Award community participation achievements
   */
  async awardCommunityAchievements(userId: string, reviewsCount: number, messagesCount: number): Promise<void> {
    try {
      // Check and award helpful reviewer achievement
      if (reviewsCount >= 5 && !(await this.hasAchievement(userId, 'helpful-reviewer'))) {
        await this.createAchievement({
          userId,
          type: 'community',
          title: 'Helpful Reviewer',
          description: 'Left 5 or more reviews for items you rented',
          icon: 'star'
        })
      }

      // Check and award active communicator achievement
      if (messagesCount >= 50 && !(await this.hasAchievement(userId, 'active-communicator'))) {
        await this.createAchievement({
          userId,
          type: 'community',
          title: 'Active Communicator',
          description: 'Sent 50 or more messages to other users',
          icon: 'users'
        })
      }
    } catch (error) {
      console.error('Error awarding community achievements:', error)
    }
  }

  /**
   * Award trust and verification achievements
   */
  async awardTrustAchievements(userId: string, isVerified: boolean, hasPaymentMethod: boolean): Promise<void> {
    try {
      // Check and award identity verified achievement
      if (isVerified && !(await this.hasAchievement(userId, 'identity-verified'))) {
        await this.createAchievement({
          userId,
          type: 'trust',
          title: 'Identity Verified',
          description: 'Successfully verified your identity',
          icon: 'check-circle'
        })
      }

      // Check and award payment verified achievement
      if (hasPaymentMethod && !(await this.hasAchievement(userId, 'payment-verified'))) {
        await this.createAchievement({
          userId,
          type: 'trust',
          title: 'Payment Verified',
          description: 'Added and verified a payment method',
          icon: 'zap'
        })
      }
    } catch (error) {
      console.error('Error awarding trust achievements:', error)
    }
  }
}

// Export singleton instance
export const achievementService = new AchievementService()