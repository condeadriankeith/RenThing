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

// GET /api/chat/rooms - Get user's chat rooms
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithId
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const rooms = await chatService.getUserRooms(session.user.id)
    
    return NextResponse.json({
      success: true,
      rooms
    })

  } catch (error) {
    console.error('Error fetching chat rooms:', error)
    return NextResponse.json(
      { error: "Failed to fetch chat rooms" },
      { status: 500 }
    )
  }
}

// POST /api/chat/rooms - Create or get chat room
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as SessionWithId
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { listingId, receiverId, content } = await request.json();

    if (!listingId || !content) {
      return NextResponse.json(
        { error: "Listing ID and content are required" },
        { status: 400 }
      )
    }

    // Create or get the chat room
    const room = await chatService.createOrGetRoom({
        listingId,
        receiverId: receiverId || '',
        senderId: session.user.id,
    });

    const message = await chatService.createMessage({
      content,
      senderId: session.user.id,
      receiverId: receiverId || '',
      listingId
    })

    return NextResponse.json({
      success: true,
      roomId: room.id,
      message
    })

  } catch (error) {
    console.error('Error creating chat room:', error)
    return NextResponse.json(
      { error: "Failed to create chat room" },
      { status: 500 }
    )
  }
}
