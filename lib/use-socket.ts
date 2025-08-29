import { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'

interface UseSocketOptions {
  autoConnect?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
  onMessage?: (data: any) => void
  onError?: (error: string) => void
}

export function useSocket(options: UseSocketOptions = {}) {
  const { data: session } = useSession()
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const socketRef = useRef<Socket | null>(null)

  const {
    autoConnect = true,
    onConnect,
    onDisconnect,
    onMessage,
    onError
  } = options

  useEffect(() => {
    if (!session?.accessToken || !autoConnect) {
      return
    }

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
      path: '/api/socket',
      auth: {
        token: session.accessToken
      },
      autoConnect: true
    })

    socketRef.current = socket

    socket.on('connect', () => {
      setIsConnected(true)
      setError(null)
      onConnect?.()
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
      onDisconnect?.()
    })

    socket.on('auth_error', (errorMessage) => {
      setError(errorMessage)
      onError?.(errorMessage)
    })

    socket.on('error', (errorMessage) => {
      setError(errorMessage)
      onError?.(errorMessage)
    })

    socket.on('new_message', (data) => {
      onMessage?.(data)
    })

    socket.on('message_received', (data) => {
      onMessage?.(data)
    })

    return () => {
      socket.disconnect()
      socketRef.current = null
    }
  }, [session?.accessToken, autoConnect, onConnect, onDisconnect, onMessage, onError])

  const sendMessage = (roomId: string, content: string, receiverId: string, listingId: string) => {
    if (!socketRef.current || !isConnected) {
      console.error('Socket not connected')
      return
    }

    socketRef.current.emit('send_message', {
      roomId,
      content,
      receiverId,
      listingId
    })
  }

  const joinRoom = (roomId: string) => {
    if (!socketRef.current || !isConnected) {
      console.error('Socket not connected')
      return
    }

    socketRef.current.emit('join_room', roomId)
  }

  const markMessagesAsRead = (roomId: string) => {
    if (!socketRef.current || !isConnected) {
      console.error('Socket not connected')
      return
    }

    socketRef.current.emit('mark_read', roomId)
  }

  const startTyping = (roomId: string, receiverId: string) => {
    if (!socketRef.current || !isConnected) {
      return
    }

    socketRef.current.emit('typing', { roomId, receiverId })
  }

  const stopTyping = (roomId: string, receiverId: string) => {
    if (!socketRef.current || !isConnected) {
      return
    }

    socketRef.current.emit('stop_typing', { roomId, receiverId })
  }

  const on = (event: string, callback: (data: any) => void) => {
    if (!socketRef.current) return
    
    socketRef.current.on(event, callback)
  }

  const off = (event: string, callback?: (data: any) => void) => {
    if (!socketRef.current) return
    
    if (callback) {
      socketRef.current.off(event, callback)
    } else {
      socketRef.current.off(event)
    }
  }

  return {
    socket: socketRef.current,
    isConnected,
    error,
    sendMessage,
    joinRoom,
    markMessagesAsRead,
    startTyping,
    stopTyping,
    on,
    off
  }
}