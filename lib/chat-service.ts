import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const prisma = new PrismaClient()

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
    // Find or create chat room
    let room = await prisma.chatRoom.findFirst({
      where: {
        listingId: data.listingId,
        customerId: data.senderId,
        ownerId: data.receiverId
      }
    })

    if (!room) {
      const listing = await prisma.listing.findUnique({
        where: { id: data.listingId }
      })

      if (!listing) throw new Error('Listing not found')

      // Determine customer and owner IDs
      const isSenderOwner = data.senderId === listing.ownerId;
      const customerId = isSenderOwner ? data.receiverId : data.senderId;
      const ownerId = listing.ownerId;

      room = await prisma.chatRoom.create({
        data: {
          listingId: data.listingId,
          customerId: customerId,
          ownerId: ownerId
        }
      })
    }

    const message = await prisma.message.create({
      data: {
        content: data.content,
        senderId: data.senderId,
        receiverId: data.receiverId,
        roomId: room.id,
        listingId: data.listingId
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
      sender: message.sender
    }
  }

  async createOrGetRoom(data: {
    listingId: string;
    receiverId: string;
    senderId: string;
  }): Promise<ChatRoom> {
    // Find or create chat room
    let room = await prisma.chatRoom.findFirst({
      where: {
        listingId: data.listingId,
        customerId: data.senderId,
        ownerId: data.receiverId
      }
    });

    if (!room) {
      const listing = await prisma.listing.findUnique({
        where: { id: data.listingId }
      });

      if (!listing) throw new Error('Listing not found');

      // Determine customer and owner IDs
      const isSenderOwner = data.senderId === listing.ownerId;
      const customerId = isSenderOwner ? data.receiverId : data.senderId;
      const ownerId = listing.ownerId;

      room = await prisma.chatRoom.create({
        data: {
          listingId: data.listingId,
          customerId: customerId,
          ownerId: ownerId
        }
      });
    }

    return room;
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
        sender: room.messages[0].sender
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
      sender: message.sender
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
}

export const chatService = new ChatService()
