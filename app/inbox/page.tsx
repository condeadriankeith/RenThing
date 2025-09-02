"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Search, Send, MoreVertical, ArrowLeft, X } from "lucide-react"
import { Chat } from "@/components/chat"
import { useToast } from "@/hooks/use-toast"
import { SpinnerLoader } from "@/components/ui/spinner-loader"

interface ChatRoom {
  id: string
  listingId: string
  customerId: string
  ownerId: string
  listing: {
    title: string
    images: string[]
    price: number
  }
  lastMessage?: {
    id: string
    content: string
    senderId: string
    receiverId: string
    timestamp: Date
    read: boolean
    sender?: {
      id: string
      name: string
      avatar?: string
    }
  }
  unreadCount: number
  otherUser: {
    id: string
    name: string
    avatar?: string
  }
}

export default function InboxPage() {
  const { data: session, status } = useSession()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (session?.user?.id) {
      fetchChatRooms()
    }
  }, [session])

  const fetchChatRooms = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/chat/rooms')
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat rooms')
      }
      
      const data = await response.json()
      
      if (data.success) {
        // Process the rooms to add otherUser information
        const processedRooms = data.rooms.map((room: any) => ({
          ...room,
          otherUser: {
            id: room.customerId === session?.user?.id ? room.ownerId : room.customerId,
            name: `User ${room.customerId === session?.user?.id ? room.ownerId : room.customerId}`,
            avatar: undefined
          }
        }))
        setChatRooms(processedRooms)
      } else {
        throw new Error(data.error || 'Failed to fetch chat rooms')
      }
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error",
        description: "Failed to load chat rooms. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filteredRooms = chatRooms.filter(room => 
    room.listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const formatTime = (timestamp: Date) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <SpinnerLoader size="lg" className="text-blue-500" />
          <p className="text-gray-600 dark:text-gray-400">Loading your messages...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">Sign in to access your messages and chat with other users</p>
            <Button asChild>
              <Link href="/auth/login?from=/inbox">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          
          {/* Chat List Sidebar */}
          <div className={`${selectedRoom ? 'hidden lg:flex' : 'flex'} flex-col w-full lg:w-1/3 border-r border-gray-200 dark:border-gray-700`}>
            
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h1>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Chat Rooms List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-2">
                  <SpinnerLoader size="md" className="text-blue-500" />
                  <p className="text-gray-600 dark:text-gray-400 text-sm">Loading conversations...</p>
                </div>
              ) : error ? (
                <div className="p-4 text-center">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button onClick={fetchChatRooms} variant="outline" size="sm">
                    Try Again
                  </Button>
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No conversations yet</h3>
                  <p className="text-gray-500 mb-4">Start browsing listings to connect with owners!</p>
                  <Button asChild>
                    <Link href="/browse">Browse Listings</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                        selectedRoom?.id === room.id ? 'bg-blue-50 dark:bg-blue-900/20 border-r-2 border-blue-600' : ''
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-12 w-12 flex-shrink-0">
                          <AvatarImage src={room.otherUser.avatar} />
                          <AvatarFallback>{room.otherUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {room.otherUser.name}
                            </h3>
                            {room.lastMessage && (
                              <span className="text-xs text-gray-500">
                                {formatTime(room.lastMessage.timestamp)}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-2">
                            {room.listing.title}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            {room.lastMessage ? (
                              <p className="text-sm text-gray-500 truncate">
                                {room.lastMessage.content}
                              </p>
                            ) : (
                              <p className="text-sm text-gray-400 italic">No messages yet</p>
                            )}
                            
                            {room.unreadCount > 0 && (
                              <Badge variant="default" className="ml-2 text-xs">
                                {room.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`${selectedRoom ? 'flex' : 'hidden lg:flex'} flex-col flex-1`}>
            {selectedRoom ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="lg:hidden"
                        onClick={() => setSelectedRoom(null)}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={selectedRoom.otherUser.avatar} />
                        <AvatarFallback>{selectedRoom.otherUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedRoom.otherUser.name}
                        </h2>
                        <p className="text-sm text-gray-500">
                          {selectedRoom.listing.title} • ₱{selectedRoom.listing.price}/day
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/listing/${selectedRoom.listingId}`}>
                          View Listing
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Chat Component */}
                <div className="flex-1 p-4">
                  <Chat 
                    ownerId={selectedRoom.otherUser.id} 
                    listingId={selectedRoom.listingId}
                  />
                </div>
              </>
            ) : (
              /* No Chat Selected */
              <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <div className="text-center">
                  <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-gray-500">
                    Choose a conversation from the sidebar to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}