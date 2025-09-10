import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

/**
 * BUSINESS LOGIC DOCUMENTATION
 * 
 * Chat System Transaction History Rules:
 * 1. Chat rooms are created when a customer first messages an owner about a listing
 * 2. Chat rooms represent PERMANENT transaction history and cannot be deleted
 * 3. Messages serve as evidence of customer-owner interactions and are immutable
 * 4. Each chat room is tied to a specific listing for transaction context
 * 5. Both customer and owner can view the complete message history
 * 6. All messages maintain direct links to both the chat room and the original listing
 */

export interface ChatMessage {
  id: string
  content: string
  senderId: string
  receiverId: string
  listingId: string
  timestamp: Date
  read: boolean
  sender?: {
    id: string
    name: string
    avatar?: string
  }
}

export interface ChatRoom {
  id: string
  listingId: string
  customerId: string
  ownerId: string
  listing: {
    title: string
    images: string[]
    price: number
  }
  lastMessage?: ChatMessage
  unreadCount: number
}

export class ChatService {
  private io: SocketIOServer | null = null

  initialize(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    })

    this.setupSocketHandlers()
  }

  private setupSocketHandlers() {
    if (!this.io) return

    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.id)

      // Authenticate user
      socket.on('authenticate', async (token: string) => {
        try {
          const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { sub: string }
          const userId = decoded.sub
          
          socket.join(`user:${userId}`)
          socket.data.userId = userId

          // Join all relevant chat rooms
          const rooms = await this.getUserRooms(userId)
          rooms.forEach(room => {
            socket.join(`room:${room.id}`)
          })

        } catch (error) {
          socket.emit('auth_error', 'Invalid token')
          socket.disconnect()
        }
      })

      // Join specific chat room
      socket.on('join_room', async (roomId: string) => {
        const userId = socket.data.userId
        if (!userId) return

        const room = await prisma.chatRoom.findUnique({
          where: { id: roomId },
          include: { listing: true }
        })

        if (!room) {
          socket.emit('error', 'Room not found')
          return
        }

        // Check if user is part of this room
        if (room.customerId !== userId && room.ownerId !== userId) {
          socket.emit('error', 'Access denied')
          return
        }

        socket.join(`room:${roomId}`)
        socket.emit('room_joined', roomId)
      })

      // Send message
      socket.on('send_message', async (data: {
        roomId: string
        content: string
        listingId: string
        receiverId: string
      }) => {
        const senderId = socket.data.userId
        if (!senderId) return

        try {
          const message = await this.createMessage({
            content: data.content,
            senderId,
            receiverId: data.receiverId,
            listingId: data.listingId,
            roomId: data.roomId
          })

          // Emit to room participants
          this.io?.to(`room:${data.roomId}`).emit('new_message', message)
          
          // Emit to receiver if online
          this.io?.to(`user:${data.receiverId}`).emit('message_received', {
            roomId: data.roomId,
            message
          })

        } catch (error) {
          socket.emit('error', 'Failed to send message')
        }
      })

      // Mark messages as read
      socket.on('mark_read', async (roomId: string) => {
        const userId = socket.data.userId
        if (!userId) return

        await this.markMessagesAsRead(roomId, userId)
        
        // Notify other participants
        this.io?.to(`room:${roomId}`).emit('messages_read', {
          roomId,
          userId
        })
      })

      // Typing indicators
      socket.on('typing', (data: { roomId: string, receiverId: string }) => {
        const userId = socket.data.userId
        if (!userId) return

        this.io?.to(`user:${data.receiverId}`).emit('user_typing', {
          roomId: data.roomId,
          userId
        })
      })

      socket.on('stop_typing', (data: { roomId: string, receiverId: string }) => {
        const userId = socket.data.userId
        if (!userId) return

        this.io?.to(`user:${data.receiverId}`).emit('user_stop_typing', {
          roomId: data.roomId,
          userId
        })
      })

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id)
      })
    })
  }

  async createMessage(data: {
    content: string
    senderId: string
    receiverId: string
    listingId: string
    roomId?: string
  }): Promise<ChatMessage> {
    let room;
    
    if (data.roomId) {
      // Use existing room
      room = await prisma.chatRoom.findUnique({
        where: { id: data.roomId }
      });
      
      if (!room) {
        throw new Error('Room not found');
      }
    } else {
      // BUSINESS LOGIC: Create new chat room when customer sends first message to owner
      // This represents the beginning of a transaction history that CANNOT be deleted
      // Each chat room is permanent evidence of customer-owner interaction
      
      // Find existing room first (bidirectional check)
      room = await prisma.chatRoom.findFirst({
        where: {
          listingId: data.listingId,
          OR: [
            { customerId: data.senderId, ownerId: data.receiverId },
            { customerId: data.receiverId, ownerId: data.senderId }
          ]
        }
      })

      if (!room) {
        // Validate listing exists before creating transaction history
        const listing = await prisma.listing.findUnique({
          where: { id: data.listingId }
        })

        if (!listing) throw new Error('Listing not found')

        // Determine customer and owner IDs based on listing ownership
        const isSenderOwner = data.senderId === listing.ownerId;
        const customerId = isSenderOwner ? data.receiverId : data.senderId;
        const ownerId = listing.ownerId;

        // Create new chat room - this marks the beginning of PERMANENT transaction history
        room = await prisma.chatRoom.create({
          data: {
            listingId: data.listingId,
            customerId: customerId,
            ownerId: ownerId
          }
        })
        
        console.log(`🔒 PERMANENT TRANSACTION HISTORY CREATED: Chat room ${room.id} for listing ${data.listingId}`);
        console.log(`Customer: ${customerId}, Owner: ${ownerId}`);
      }
    }

    // Create the message - this becomes part of the PERMANENT transaction record
    // Messages represent the complete communication history and cannot be deleted
    // as they serve as evidence of customer-owner interactions
    const message = await prisma.message.create({
      data: {
        content: data.content,
        senderId: data.senderId,
        receiverId: data.receiverId,
        roomId: room.id,
        listingId: data.listingId  // Essential: links message to specific listing transaction
      },
      include: {
        sender: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return {
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      listingId: message.listingId,
      timestamp: message.createdAt,
      read: message.read,
      sender: message.sender ? {
        id: message.sender.id,
        name: message.sender.name || 'Unknown User',
        avatar: message.sender.avatar || undefined
      } : undefined
    }
  }

  async createOrGetRoom(data: {
    listingId: string;
    receiverId: string;
    senderId: string;
  }): Promise<ChatRoom> {
    // Validate inputs
    if (!data.listingId || !data.receiverId || !data.senderId) {
      throw new Error('Missing required parameters: listingId, receiverId, or senderId');
    }

    // Prevent self-chat
    if (data.senderId === data.receiverId) {
      throw new Error('Cannot create chat room with yourself');
    }

    console.log('createOrGetRoom called with:', data);

    // Find existing chat room (check both directions)
    let room = await prisma.chatRoom.findFirst({
      where: {
        listingId: data.listingId,
        OR: [
          { customerId: data.senderId, ownerId: data.receiverId },
          { customerId: data.receiverId, ownerId: data.senderId }
        ]
      }
    });

    if (!room) {
      // Validate that the listing exists
      const listing = await prisma.listing.findUnique({
        where: { id: data.listingId },
        select: { id: true, ownerId: true }
      });

      if (!listing) {
        throw new Error(`Listing with ID ${data.listingId} not found`);
      }

      // Validate that both users exist
      const [sender, receiver] = await Promise.all([
        prisma.user.findUnique({ where: { id: data.senderId }, select: { id: true } }),
        prisma.user.findUnique({ where: { id: data.receiverId }, select: { id: true } })
      ]);

      if (!sender) {
        throw new Error(`Sender with ID ${data.senderId} not found`);
      }
      if (!receiver) {
        throw new Error(`Receiver with ID ${data.receiverId} not found`);
      }

      // Determine customer and owner IDs
      const isSenderOwner = data.senderId === listing.ownerId;
      const customerId = isSenderOwner ? data.receiverId : data.senderId;
      const ownerId = listing.ownerId;

      console.log('Creating new chat room:', { listingId: data.listingId, customerId, ownerId });

      try {
        room = await prisma.chatRoom.create({
          data: {
            listingId: data.listingId,
            customerId: customerId,
            ownerId: ownerId
          }
        });
        console.log('Chat room created successfully:', room);
      } catch (createError) {
        console.error('Error creating chat room:', createError);
        throw new Error(`Failed to create chat room: ${createError}`);
      }
    }

    return {
      ...room,
      listing: {
        title: '',
        images: [],
        price: 0
      },
      unreadCount: 0
    };
  }

  async getUserRooms(userId: string): Promise<ChatRoom[]> {
    const rooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { customerId: userId },
          { ownerId: userId }
        ]
      },
      include: {
        listing: {
          select: { title: true, images: true, price: true }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: { id: true, name: true, avatar: true }
            }
          }
        }
      }
    })

    return rooms.map(room => ({
      id: room.id,
      listingId: room.listingId,
      customerId: room.customerId,
      ownerId: room.ownerId,
      listing: {
        title: room.listing.title,
        images: JSON.parse(room.listing.images || '[]'),
        price: room.listing.price
      },
      lastMessage: room.messages[0] ? {
        id: room.messages[0].id,
        content: room.messages[0].content,
        senderId: room.messages[0].senderId,
        receiverId: room.messages[0].receiverId,
        listingId: room.messages[0].listingId,
        timestamp: room.messages[0].createdAt,
        read: room.messages[0].read,
        sender: room.messages[0].sender ? {
          id: room.messages[0].sender.id,
          name: room.messages[0].sender.name || 'Unknown User',
          avatar: room.messages[0].sender.avatar || undefined
        } : undefined
      } : undefined,
      unreadCount: 0 // Will be calculated separately
    }))
  }

  async getRoomMessages(roomId: string, userId: string, limit: number = 50, offset: number = 0): Promise<ChatMessage[]> {
    const room = await prisma.chatRoom.findUnique({
      where: { id: roomId }
    })

    if (!room || (room.customerId !== userId && room.ownerId !== userId)) {
      throw new Error('Access denied')
    }

    const messages = await prisma.message.findMany({
      where: { roomId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        sender: {
          select: { id: true, name: true, avatar: true }
        }
      }
    })

    return messages.map(message => ({
      id: message.id,
      content: message.content,
      senderId: message.senderId,
      receiverId: message.receiverId,
      listingId: message.listingId,
      timestamp: message.createdAt,
      read: message.read,
      sender: message.sender ? {
        id: message.sender.id,
        name: message.sender.name || 'Unknown User',
        avatar: message.sender.avatar || undefined
      } : undefined
    })).reverse()
  }

  async markMessagesAsRead(roomId: string, userId: string) {
    await prisma.message.updateMany({
      where: {
        roomId,
        receiverId: userId,
        read: false
      },
      data: { read: true }
    })
  }

  async getUnreadCount(userId: string): Promise<number> {
    return await prisma.message.count({
      where: {
        receiverId: userId,
        read: false
      }
    })
  }

  // BUSINESS RULE: Chat rooms and messages cannot be deleted
  // These methods are intentionally NOT implemented to protect transaction history
  
  /**
   * @deprecated Chat rooms represent permanent transaction history and cannot be deleted
   * @throws Error Always throws an error to prevent accidental deletion
   */
  async deleteChatRoom(roomId: string): Promise<never> {
    throw new Error(
      '🚫 BUSINESS RULE VIOLATION: Chat rooms represent permanent transaction history ' +
      'between customers and owners and cannot be deleted. They serve as evidence of ' +
      'rental inquiries and negotiations.'
    );
  }

  /**
   * @deprecated Messages represent permanent transaction records and cannot be deleted
   * @throws Error Always throws an error to prevent accidental deletion
   */
  async deleteMessage(messageId: string): Promise<never> {
    throw new Error(
      '🚫 BUSINESS RULE VIOLATION: Messages represent permanent transaction records ' +
      'and cannot be deleted. They serve as evidence of customer-owner communication ' +
      'history for legal and business purposes.'
    );
  }

  /**
   * Get chat room statistics for business analytics
   * This helps track customer engagement and transaction patterns
   */
  async getChatRoomStats(listingId?: string) {
    const whereClause = listingId ? { listingId } : {};
    
    const [totalRooms, totalMessages, activeRooms] = await Promise.all([
      prisma.chatRoom.count({ where: whereClause }),
      prisma.message.count({ 
        where: listingId ? { listingId } : {} 
      }),
      prisma.chatRoom.count({
        where: {
          ...whereClause,
          messages: {
            some: {
              createdAt: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
              }
            }
          }
        }
      })
    ]);

    return {
      totalRooms,
      totalMessages,
      activeRooms,
      averageMessagesPerRoom: totalRooms > 0 ? Math.round(totalMessages / totalRooms) : 0
    };
  }
}

export const chatService = new ChatService()
