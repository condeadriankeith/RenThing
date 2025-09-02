
"use client";
/**
 * Chat Component - Handles Customer-Owner Communication
 * 
 * BUSINESS LOGIC:
 * - Creates permanent transaction history when customer first contacts owner
 * - All messages are immutable and serve as evidence of rental inquiries
 * - Chat rooms cannot be deleted as they represent business transaction records
 */
import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { SpinnerLoader } from "@/components/ui/spinner-loader";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  read: boolean;
  sender?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ChatProps {
  ownerId: string;
  listingId?: string;
  onOpenFullChat?: () => void;
}

export const Chat: React.FC<ChatProps> = ({ ownerId, listingId, onOpenFullChat }) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  // Initialize chat room and load messages
  useEffect(() => {
    if (!session?.user?.id) {
      setIsLoading(false);
      return;
    }

    if (!listingId) {
      console.error("Missing listingId for chat initialization");
      toast({
        title: "Configuration Error",
        description: "Missing listing information. Please try again.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }

    initializeChat();
  }, [session, listingId, ownerId]);

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      
      // Create or get chat room
      const roomResponse = await fetch('/api/chat/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          listingId, 
          receiverId: ownerId, 
          content: 'Chat initiated' 
        }),
      });
      
      const roomData = await roomResponse.json();
      
      if (roomData.success && roomData.roomId) {
        setRoomId(roomData.roomId);
        
        // Load existing messages
        await loadMessages(roomData.roomId);
      } else {
        throw new Error(roomData.error || 'Failed to initialize chat');
      }
    } catch (error) {
      console.error("Error initializing chat:", error);
      toast({
        title: "Connection Error",
        description: "Failed to initialize chat. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (roomId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Poll for new messages every 3 seconds
  useEffect(() => {
    if (!roomId) return;

    const interval = setInterval(() => {
      loadMessages(roomId);
    }, 3000);

    return () => clearInterval(interval);
  }, [roomId]);

  const handleSend = async () => {
    if (!input.trim() || !roomId || !session?.user?.id || isSending) return;
    
    setIsSending(true);
    const messageContent = input.trim();
    setInput(""); // Clear input immediately for better UX
    
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          content: messageContent,
          receiverId: ownerId,
          listingId
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add the new message to the list immediately
        setMessages(prev => [...prev, data.message]);
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setInput(messageContent); // Restore input on error
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const isConnected = !isLoading && roomId !== null;

  return (
    <div className="flex flex-col h-[70vh] max-h-[600px] min-h-[350px] w-full max-w-2xl mx-auto border rounded-lg shadow bg-white sm:h-[500px] sm:max-h-[600px]">
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <SpinnerLoader size="md" className="text-blue-500" />
            <div className="text-center text-gray-500 text-sm">
              Connecting to chat...
            </div>
          </div>
        )}
        
        {!isLoading && !isConnected && (
          <div className="text-center text-red-500 py-2">
            Failed to connect to chat
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === session?.user?.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-2xl max-w-[80vw] sm:max-w-xs break-words text-sm shadow-sm ${
                msg.senderId === session?.user?.id
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-900"
              }`}
              title={new Date(msg.timestamp).toLocaleString()}
              style={{ wordBreak: "break-word" }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-2 sm:p-3 border-t flex gap-2 bg-gray-50">
        <input
          type="text"
          className="flex-1 border rounded-full px-3 py-2 focus:outline-none focus:ring text-sm sm:text-base"
          placeholder={isConnected ? "Type your message..." : "Chat not available"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
          disabled={!isConnected || isSending}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 text-sm sm:text-base flex items-center justify-center"
          onClick={handleSend}
          disabled={!input.trim() || !isConnected || isSending}
        >
          {isSending ? (
            <>
              <SpinnerLoader size="sm" className="mr-2 text-white" />
              Sending...
            </>
          ) : (
            "Send"
          )}
        </button>
      </div>
      
      {onOpenFullChat && (
        <div className="p-2 text-center border-t bg-gray-50">
          <button 
            onClick={onOpenFullChat}
            className="text-blue-500 hover:text-blue-700 text-sm"
          >
            Open full chat
          </button>
        </div>
      )}
    </div>
  );
};
