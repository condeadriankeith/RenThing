import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface UserFeedback {
  id?: string;
  userId?: string;
  messageId: string;
  rating: number; // 1-5 scale
  comment?: string;
  timestamp: Date;
}

export interface InteractionLog {
  id?: string;
  userId?: string;
  userInput: string;
  aiResponse: string;
  actionTaken?: string;
  timestamp: Date;
}

export class RenFeedbackService {
  /**
   * Log user feedback for an AI interaction
   */
  async logFeedback(feedback: UserFeedback) {
    try {
      const savedFeedback = await prisma.aIFeedback.create({
        data: {
          userId: feedback.userId,
          messageId: feedback.messageId,
          rating: feedback.rating,
          comment: feedback.comment,
          createdAt: feedback.timestamp
        }
      });
      return savedFeedback;
    } catch (error) {
      console.error('Error logging feedback:', error);
      throw error;
    }
  }

  /**
   * Log an AI interaction for analysis
   */
  async logInteraction(interaction: InteractionLog) {
    try {
      const savedInteraction = await prisma.aIInteraction.create({
        data: {
          userId: interaction.userId,
          userInput: interaction.userInput,
          aiResponse: interaction.aiResponse,
          actionTaken: interaction.actionTaken,
          createdAt: interaction.timestamp
        }
      });
      return savedInteraction;
    } catch (error) {
      console.error('Error logging interaction:', error);
      throw error;
    }
  }

  /**
   * Get feedback statistics
   */
  async getFeedbackStats() {
    try {
      const totalFeedback = await prisma.aIFeedback.count();
      const averageRating = await prisma.aIFeedback.aggregate({
        _avg: {
          rating: true
        }
      });
      
      const feedbackByRating = await prisma.aIFeedback.groupBy({
        by: ['rating'],
        _count: {
          rating: true
        }
      });
      
      return {
        total: totalFeedback,
        averageRating: averageRating._avg.rating || 0,
        distribution: feedbackByRating
      };
    } catch (error) {
      console.error('Error getting feedback stats:', error);
      throw error;
    }
  }

  /**
   * Get common user intents from interaction logs
   */
  async getCommonIntents(limit: number = 10) {
    try {
      // This would require more sophisticated text analysis in a real implementation
      // For now, we'll return a placeholder
      return [];
    } catch (error) {
      console.error('Error getting common intents:', error);
      throw error;
    }
  }

  /**
   * Analyze failed navigations to improve path recognition
   */
  async analyzeNavigationFailures() {
    try {
      // Find interactions where navigation was attempted but may have failed
      const navigationInteractions = await prisma.aIInteraction.findMany({
        where: {
          actionTaken: {
            startsWith: 'navigate'
          }
        },
        take: 100,
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      return navigationInteractions;
    } catch (error) {
      console.error('Error analyzing navigation failures:', error);
      throw error;
    }
  }
}

export const renFeedbackService = new RenFeedbackService();