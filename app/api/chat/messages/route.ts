import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { chatService } from "@/lib/chat-service"

// Extend the Session type to include the id property
type SessionWithId = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  expires: string;
} | null;

// GET /api/chat/messages - Get messages for a room
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithId
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    
    if (!roomId) {
      return NextResponse.json(
        { error: "Room ID is required" },
        { status: 400 }
      )
    }

    const messages = await chatService.getRoomMessages(roomId, session.user.id)
    
    return NextResponse.json({
      success: true,
      messages
    })

  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    )
  }
}

// POST /api/chat/messages - Send a message
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithId
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { roomId, content, receiverId, listingId } = await request.json();

    if (!roomId || !content || !receiverId || !listingId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const message = await chatService.createMessage({
      content,
      senderId: session.user.id,
      receiverId,
      listingId,
      roomId
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