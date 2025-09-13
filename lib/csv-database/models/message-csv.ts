import { csvDatabaseService } from '../csv-service';
import { logger } from '@/lib/logger';

// Define the Message interface based on the Prisma schema
export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  listingId: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define input types for create and update operations
export interface CreateMessageInput {
  content: string;
  senderId: string;
  receiverId: string;
  roomId: string;
  listingId: string;
  read?: boolean;
}

export interface UpdateMessageInput {
  content?: string;
  senderId?: string;
  receiverId?: string;
  roomId?: string;
  listingId?: string;
  read?: boolean;
}

export class MessageCSVService {
  /**
   * Create a new message
   * @param messageData The message data
   * @returns The created message
   */
  async createMessage(messageData: CreateMessageInput): Promise<Message> {
    try {
      const defaultMessageRead = messageData.read || false;
      
      const message = await csvDatabaseService.create<Message>('messages', {
        ...messageData,
        read: defaultMessageRead
      });
      
      logger.info(`Created message with ID: ${message.id}`);
      return message;
    } catch (error) {
      logger.error('Error creating message:', error);
      throw error;
    }
  }

  /**
   * Get a message by ID
   * @param id The message ID
   * @returns The message or null if not found
   */
  async getMessageById(id: string): Promise<Message | null> {
    try {
      const message = await csvDatabaseService.findUnique<Message>('messages', { id });
      return message;
    } catch (error) {
      logger.error(`Error getting message by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get messages by room ID
   * @param roomId The room ID
   * @returns Array of messages
   */
  async getMessagesByRoomId(roomId: string): Promise<Message[]> {
    try {
      const messages = await csvDatabaseService.findMany<Message>('messages', { roomId });
      return messages;
    } catch (error) {
      logger.error(`Error getting messages by room ID ${roomId}:`, error);
      throw error;
    }
  }

  /**
   * Get messages by sender ID
   * @param senderId The sender ID
   * @returns Array of messages
   */
  async getMessagesBySenderId(senderId: string): Promise<Message[]> {
    try {
      const messages = await csvDatabaseService.findMany<Message>('messages', { senderId });
      return messages;
    } catch (error) {
      logger.error(`Error getting messages by sender ID ${senderId}:`, error);
      throw error;
    }
  }

  /**
   * Get messages by receiver ID
   * @param receiverId The receiver ID
   * @returns Array of messages
   */
  async getMessagesByReceiverId(receiverId: string): Promise<Message[]> {
    try {
      const messages = await csvDatabaseService.findMany<Message>('messages', { receiverId });
      return messages;
    } catch (error) {
      logger.error(`Error getting messages by receiver ID ${receiverId}:`, error);
      throw error;
    }
  }

  /**
   * Update a message
   * @param id The message ID
   * @param messageData The message data to update
   * @returns The updated message
   */
  async updateMessage(id: string, messageData: UpdateMessageInput): Promise<Message> {
    try {
      const message = await csvDatabaseService.update<Message>('messages', { id }, messageData);
      logger.info(`Updated message with ID: ${id}`);
      return message;
    } catch (error) {
      logger.error(`Error updating message with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Mark a message as read
   * @param id The message ID
   * @returns The updated message
   */
  async markMessageAsRead(id: string): Promise<Message> {
    try {
      const message = await this.updateMessage(id, { read: true });
      logger.info(`Marked message ${id} as read`);
      return message;
    } catch (error) {
      logger.error(`Error marking message ${id} as read:`, error);
      throw error;
    }
  }

  /**
   * Delete a message
   * @param id The message ID
   * @returns The deleted message
   */
  async deleteMessage(id: string): Promise<Message> {
    try {
      const message = await csvDatabaseService.delete<Message>('messages', { id });
      logger.info(`Deleted message with ID: ${id}`);
      return message;
    } catch (error) {
      logger.error(`Error deleting message with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all messages
   * @returns Array of all messages
   */
  async getAllMessages(): Promise<Message[]> {
    try {
      const messages = await csvDatabaseService.findMany<Message>('messages');
      return messages;
    } catch (error) {
      logger.error('Error getting all messages:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const messageCSVService = new MessageCSVService();