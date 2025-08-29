import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { chatService } from "@/lib/chat-service"

// GET /api/chat/rooms/[roomId]/messages - Get messages for a room
export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Validate room ID format
    if (!/^[0-9a-fA-F]{24}$/.test(params.roomId)) {
      return NextResponse.json(
        { error: "Invalid room ID format" },
        { status: 400 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)

    // Verify room membership
    const hasAccess = await chatService.verifyRoomAccess(
      params.roomId,
      session.user.id
    )
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: "Access to chat room denied" },
        { status: 403 }
      )
    }

    const messages = await chatService.getRoomMessages(
      params.roomId,
      session.user.id,
      limit,
      offset
    )

    return NextResponse.json({
      success: true,
      messages,
      pagination: {
        limit,
        offset,
        total: messages.length
      }
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// POST /api/chat/rooms/[roomId]/messages - Send a message
export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { content, listingId, receiverId } = await request.json()

    if (!content || !listingId || !receiverId) {
      return NextResponse.json(
        { error: "Content, listing ID, and receiver ID are required" },
        { status: 400 }
      )
    }

    const message = await chatService.createMessage({
      content,
      senderId: session.user.id,
      receiverId,
      listingId,
      roomId: params.roomId
    })

    return NextResponse.json({
      success: true,
      message
    })

  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}

// PUT /api/chat/rooms/[roomId]/messages/read - Mark messages as read
export async function PUT(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await chatService.markMessagesAsRead(params.roomId, session.user.id)

    return NextResponse.json({
      success: true,
      message: "Messages marked as read"
    })

  } catch (error) {
    console.error('Error marking messages as read:', error)
    return NextResponse.json(
      { error: "Failed to mark messages as read" },
      { status: 500 }
    )
  }
}