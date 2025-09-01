/**
 * Transaction History Utilities
 * 
 * This module provides utilities for managing permanent transaction history
 * in the chat system. All chat rooms and messages represent business records
 * that cannot be deleted.
 */

import { chatService } from './chat-service';

export interface TransactionHistoryEntry {
  chatRoomId: string;
  listingId: string;
  customerId: string;
  ownerId: string;
  firstContactDate: Date;
  messageCount: number;
  lastActivityDate: Date;
}

/**
 * Get transaction history for a specific listing
 * Useful for owners to see all customer inquiries
 */
export async function getListingTransactionHistory(listingId: string): Promise<TransactionHistoryEntry[]> {
  const rooms = await chatService.getUserRooms(''); // This will need to be modified to accept listingId filter
  
  // Filter and transform room data into transaction history format
  return rooms
    .filter(room => room.listingId === listingId)
    .map(room => ({
      chatRoomId: room.id,
      listingId: room.listingId,
      customerId: room.customerId,
      ownerId: room.ownerId,
      firstContactDate: new Date(), // Would need to get from room.createdAt
      messageCount: 0, // Would need to count messages
      lastActivityDate: room.lastMessage?.timestamp || new Date()
    }));
}

/**
 * Get customer inquiry statistics for business analytics
 */
export async function getCustomerInquiryStats(ownerId: string) {
  const stats = await chatService.getChatRoomStats();
  
  return {
    totalInquiries: stats.totalRooms,
    totalMessages: stats.totalMessages,
    activeConversations: stats.activeRooms,
    averageResponseRate: stats.averageMessagesPerRoom,
    conversionMetrics: {
      // These would be calculated based on actual booking data
      inquiriesToBookings: 0,
      averageInquiryToBookingTime: 0
    }
  };
}

/**
 * Business rule enforcement
 */
export const TRANSACTION_HISTORY_RULES = {
  CHAT_DELETION_FORBIDDEN: 'Chat rooms represent permanent transaction history and cannot be deleted',
  MESSAGE_DELETION_FORBIDDEN: 'Messages are permanent records of customer-owner communication',
  RETENTION_PERIOD: 'All chat history is retained permanently for business and legal purposes',
  EVIDENCE_PURPOSE: 'Chat history serves as evidence of rental inquiries and negotiations'
} as const;

/**
 * Validate that a user has permission to view transaction history
 */
export function validateTransactionHistoryAccess(
  userId: string, 
  chatRoom: { customerId: string; ownerId: string }
): boolean {
  return userId === chatRoom.customerId || userId === chatRoom.ownerId;
}