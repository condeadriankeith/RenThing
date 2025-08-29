
"use client";
import React, { useState, useRef, useEffect } from "react";
import { useSocket } from "@/lib/use-socket";
import { useToast } from "@/hooks/use-toast";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const {
    isConnected,
    error,
    sendMessage,
    joinRoom,
    markMessagesAsRead,
    startTyping,
    stopTyping,
    on,
    off
  } = useSocket({
    onConnect: async () => {
      console.log("Socket connected");
      try {
        // Get or create chat room from API
        const response = await fetch('/api/chat/rooms', {
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
        
        const data = await response.json();
        
        if (data.success && data.message?.roomId) {
          const newRoomId = data.message.roomId;
          setRoomId(newRoomId);
          joinRoom(newRoomId);
        } else {
          throw new Error('Failed to get room ID');
        }
      } catch (error) {
        console.error("Error getting room ID:", error);
        toast({
          title: "Connection Error",
          description: "Failed to initialize chat room. Please try again.",
          variant: "destructive"
        });
      }
    },
    onDisconnect: () => {
      console.log("Socket disconnected");
    },
    onError: (errorMessage) => {
      console.error("Socket error:", errorMessage);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat service. Please try again.",
        variant: "destructive"
      });
    }
  });


  // Handle incoming messages
  useEffect(() => {
    const handleNewMessage = (data: any) => {
      if (data.roomId === roomId) {
        setMessages(prev => [...prev, data.message]);
      }
    };

    const handleTyping = (data: any) => {
      if (data.roomId === roomId && data.userId !== ownerId) {
        setOtherUserTyping(true);
      }
    };

    const handleStopTyping = (data: any) => {
      if (data.roomId === roomId && data.userId !== ownerId) {
        setOtherUserTyping(false);
      }
    };

    on('new_message', handleNewMessage);
    on('user_typing', handleTyping);
    on('user_stop_typing', handleStopTyping);

    return () => {
      off('new_message', handleNewMessage);
      off('user_typing', handleTyping);
      off('user_stop_typing', handleStopTyping);
    };
  }, [roomId, ownerId, on, off]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark messages as read when component mounts
  useEffect(() => {
    if (roomId) {
      markMessagesAsRead(roomId);
    }
  }, [roomId, markMessagesAsRead]);

  const handleSend = () => {
    if (!input.trim() || !roomId) return;
    
    sendMessage(roomId, input, ownerId, listingId || "");
    setInput("");
    
    // Reset typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    stopTyping(roomId, ownerId);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    
    // Send typing indicator
    if (roomId && !isTyping) {
      setIsTyping(true);
      startTyping(roomId, ownerId);
      
      // Stop typing after 1 second of inactivity
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        stopTyping(roomId, ownerId);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] max-h-[600px] min-h-[350px] w-full max-w-2xl mx-auto border rounded-lg shadow bg-white sm:h-[500px] sm:max-h-[600px]">
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2">
        {!isConnected && (
          <div className="text-center text-gray-500 py-2">
            Connecting to chat...
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-500 py-2">
            {error}
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.senderId === ownerId ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`px-3 py-2 rounded-2xl max-w-[80vw] sm:max-w-xs break-words text-sm shadow-sm ${
                msg.senderId === ownerId
                  ? "bg-gray-200 text-gray-900"
                  : "bg-blue-500 text-white"
              }`}
              title={new Date(msg.timestamp).toLocaleString()}
              style={{ wordBreak: "break-word" }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="px-3 py-2 rounded-2xl bg-gray-200 text-gray-900 text-sm">
              Typing...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-2 sm:p-3 border-t flex gap-2 bg-gray-50">
        <input
          type="text"
          className="flex-1 border rounded-full px-3 py-2 focus:outline-none focus:ring text-sm sm:text-base"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          autoComplete="off"
          disabled={!isConnected}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 disabled:opacity-50 text-sm sm:text-base"
          onClick={handleSend}
          disabled={!input.trim() || !isConnected}
        >
          Send
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
