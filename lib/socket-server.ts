import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { NextApiResponse } from 'next'
import { chatService } from './chat-service'

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: {
    server: HTTPServer & {
      io?: SocketIOServer
    }
  }
}

let io: SocketIOServer | undefined

export function getSocketIO(res?: NextApiResponseWithSocket): SocketIOServer | undefined {
  if (res?.socket.server.io) {
    return res.socket.server.io
  }
  return io
}

export function initSocketIO(res: NextApiResponseWithSocket) {
  if (res.socket.server.io) {
    console.log('Socket.IO already initialized')
    return res.socket.server.io
  }

  console.log('Initializing Socket.IO...')
  
  const httpServer = res.socket.server
  
  const io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXTAUTH_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: '/api/socket'
  })

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication error'))
      }

      const jwt = require('jsonwebtoken')
      const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET!)
      socket.data.userId = decoded.sub
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  // Set up chat service handlers
  chatService.initialize(io)

  res.socket.server.io = io
  return io
}

export function closeSocketIO() {
  if (io) {
    io.close()
    io = undefined
  }
}