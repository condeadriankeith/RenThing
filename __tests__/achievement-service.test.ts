import { achievementService } from '../lib/achievement-service'
import { prisma } from '../lib/prisma'

// Mock prisma
jest.mock('../lib/prisma', () => ({
  prisma: {
    achievement: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn()
    }
  }
}))

describe('AchievementService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createAchievement', () => {
    it('should create a new achievement', async () => {
      const mockAchievement = {
        id: 'ach1',
        userId: 'user123',
        type: 'milestone',
        title: 'First Rental',
        description: 'Completed first rental',
        icon: 'trophy',
        earnedAt: new Date(),
        expiresAt: undefined
      }

      ;(prisma.achievement.create as jest.Mock).mockResolvedValue(mockAchievement)

      const result = await achievementService.createAchievement({
        userId: 'user123',
        type: 'milestone',
        title: 'First Rental',
        description: 'Completed first rental',
        icon: 'trophy'
      })

      expect(prisma.achievement.create).toHaveBeenCalledWith({
        data: {
          userId: 'user123',
          type: 'milestone',
          title: 'First Rental',
          description: 'Completed first rental',
          icon: 'trophy',
          expiresAt: undefined
        }
      })
      expect(result).toEqual(mockAchievement)
    })
  })

  describe('getUserAchievements', () => {
    it('should fetch user achievements', async () => {
      const mockAchievements = [
        {
          id: 'ach1',
          userId: 'user123',
          type: 'milestone',
          title: 'First Rental',
          description: 'Completed first rental',
          icon: 'trophy',
          earnedAt: new Date(),
          expiresAt: undefined
        }
      ]

      ;(prisma.achievement.findMany as jest.Mock).mockResolvedValue(mockAchievements)

      const result = await achievementService.getUserAchievements('user123')

      expect(prisma.achievement.findMany).toHaveBeenCalledWith({
        where: {
          userId: 'user123',
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: expect.any(Date) } }
          ]
        },
        orderBy: {
          earnedAt: 'desc'
        }
      })
      expect(result).toEqual(mockAchievements)
    })
  })

  describe('hasAchievement', () => {
    it('should return true if user has achievement', async () => {
      ;(prisma.achievement.findFirst as jest.Mock).mockResolvedValue({
        id: 'ach1',
        userId: 'user123',
        type: 'milestone'
      })

      const result = await achievementService.hasAchievement('user123', 'milestone')

      expect(prisma.achievement.findFirst).toHaveBeenCalledWith({
        where: {
          userId: 'user123',
          type: 'milestone',
          OR: [
            { expiresAt: null },
            { expiresAt: { gte: expect.any(Date) } }
          ]
        }
      })
      expect(result).toBe(true)
    })

    it('should return false if user does not have achievement', async () => {
      ;(prisma.achievement.findFirst as jest.Mock).mockResolvedValue(null)

      const result = await achievementService.hasAchievement('user123', 'milestone')

      expect(result).toBe(false)
    })
  })

  describe('awardRentalMilestones', () => {
    it('should award first rental achievement', async () => {
      ;(prisma.achievement.findFirst as jest.Mock).mockResolvedValue(null)
      ;(prisma.achievement.create as jest.Mock).mockResolvedValue({})

      await achievementService.awardRentalMilestones('user123', 1)

      expect(prisma.achievement.create).toHaveBeenCalledWith({
        data: {
          userId: 'user123',
          type: 'milestone',
          title: 'First Rental',
          description: 'Completed your first rental on RenThing',
          icon: 'calendar'
        }
      })
    })

    it('should award 10 rentals achievement', async () => {
      ;(prisma.achievement.findFirst as jest.Mock)
        .mockResolvedValueOnce({}) // first-rental exists
        .mockResolvedValueOnce(null) // 10-rentals does not exist
      ;(prisma.achievement.create as jest.Mock).mockResolvedValue({})

      await achievementService.awardRentalMilestones('user123', 10)

      expect(prisma.achievement.create).toHaveBeenCalledWith({
        data: {
          userId: 'user123',
          type: 'milestone',
          title: '10 Rentals',
          description: 'Completed 10 rentals on RenThing',
          icon: 'shopping-bag'
        }
      })
    })
  })
})