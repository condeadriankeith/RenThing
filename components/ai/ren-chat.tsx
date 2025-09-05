"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { renAIClientService, type AIResponse, type AIContext } from "@/lib/ai/ren-ai-service-client";
import { motion } from "framer-motion";
import { Sparkles, X, Send, ExternalLink, ThumbsUp, ThumbsDown } from "lucide-react"; // Added feedback icons
import { useToast } from "@/hooks/use-toast"; // Add this import
import { useGeolocation } from "@/contexts/geolocation-context"; // Import geolocation context

// Helper function to parse markdown-like formatting
const parseMarkdown = (text: string) => {
  if (!text) return '';
  
  // Escape HTML to prevent XSS
  let escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // Convert bold text (enclosed in *)
  escapedText = escapedText.replace(/\*([^\*]+)\*/g, '<strong>$1</strong>');
  
  // Convert italic text (enclosed in _)
  escapedText = escapedText.replace(/\_([^\_]+)\_/g, '<em>$1</em>');
  
  // Convert bold italic text (enclosed in __)
  escapedText = escapedText.replace(/\_\_([^\_\_]+)\_\_/g, '<strong><em>$1</em></strong>');
  
  // Convert code blocks (enclosed in `)
  escapedText = escapedText.replace(/\`([^\`]+)\`/g, '<code class="bg-gray-200 px-1 rounded text-xs">$1</code>');
  
  // Convert line breaks
  escapedText = escapedText.replace(/\n/g, '<br />');
  
  return escapedText;
};

// Helper component to render formatted text
const FormattedText = ({ content }: { content: string }) => {
  const formattedContent = parseMarkdown(content);
  
  return (
    <span 
      className="text-sm"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
};

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  suggestions?: string[];
  action?: {
    type: string;
    payload?: any;
  };
  feedback?: {
    rating: number;
    comment?: string;
  };
}

interface RenChatProps {
  onAction?: (action: any) => void;
  onMessagesChange?: (messages: Message[]) => void;
  initialMessages?: Message[];
  onClose?: () => void; // Added onClose prop
  onMinimize?: () => void; // Added onMinimize prop
}

export function RenChat({ onAction, onMessagesChange, initialMessages, onClose, onMinimize }: RenChatProps) {
  const { data: session } = useSession();
  const { toast } = useToast(); // Add toast hook
  const { latitude, longitude, error: geolocationError } = useGeolocation(); // Get geolocation data
  const [messages, setMessages] = useState<Message[]>(initialMessages || [
    {
      id: "1",
      content: "Hi! I'm REN, your assistant for RenThing. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
      suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Notify parent of message changes
  useEffect(() => {
    if (onMessagesChange) {
      onMessagesChange(messages);
    }
  }, [messages, onMessagesChange]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleMinimize = () => {
    setIsMinimized(true);
    if (onMinimize) {
      onMinimize();
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare context with conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      const context: AIContext = {
        userId: session?.user?.id,
        conversationHistory: conversationHistory,
        userPreferences: {
          language: "en",
          currency: "PHP"
        },
        // Add geolocation data to context if available
        currentGeolocation: latitude !== null && longitude !== null ? {
          latitude,
          longitude
        } : undefined
      };

      // Get AI response
      const response: AIResponse = await renAIClientService.processMessage(input, context);

      // Handle actions from AI response
      if (response.action && onAction) {
        onAction(response.action);
      }

      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.text,
        role: "assistant",
        timestamp: new Date(),
        suggestions: response.suggestions,
        action: response.action || undefined // Store action for potential later use
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  const handleListingSuggestionClick = (listingId: string) => {
    // Handle when user clicks on a suggested listing
    if (onAction) {
      onAction({
        type: "navigate",
        payload: { path: `/listing/${listingId}` }
      });
    }
  };

  const handleFeedback = async (messageId: string, rating: number) => {
    try {
      // Update local state first for immediate feedback
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback: { rating } } 
          : msg
      ));
      
      // Send feedback to the server
      const response = await fetch('/api/ai/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messageId,
          rating
        })
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || `Failed to submit feedback: ${response.status} ${response.statusText}`);
      }
      
      console.log('Feedback submitted successfully:', responseData.feedback);
      
      // Show success toast notification
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! It helps REN improve.",
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // Show user-friendly error message
      toast({
        title: "Feedback Error",
        description: "Failed to submit feedback. Please try again later.",
        variant: "destructive",
      });
      
      // Revert the local state change if the server request failed
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, feedback: undefined } 
          : msg
      ));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Render a listing suggestion card
  const renderListingSuggestion = (listing: any) => (
    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center">
        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
        <div className="ml-3 flex-1">
          <h4 className="font-medium text-sm">{listing.title}</h4>
          <p className="text-xs text-gray-500 truncate">{listing.description}</p>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm font-medium text-blue-600">₱{listing.price}/day</span>
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7 text-xs"
              onClick={() => handleListingSuggestionClick(listing.id)}
            >
              View <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    // Changed from fixed height to dynamic height with max-height constraint
    <div className="flex flex-col h-full max-h-[70vh] bg-white">
      {/* Messages Area - flex-1 to take available space */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <Avatar className="h-8 w-8 mr-2 mt-1">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                <FormattedText content={message.content} />
                
                {/* Render listing suggestion if action is to show a listing */}
                {message.action && message.action.type === "show_listing" && message.action.payload?.listingId && (
                  <div className="mt-2">
                    {/* In a real implementation, we would fetch the actual listing data */}
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        I can show you this listing directly. Would you like me to take you there?
                      </p>
                      <Button 
                        size="sm" 
                        className="mt-2 h-7 text-xs"
                        onClick={() => {
                          if (onAction) {
                            onAction({
                              type: "navigate",
                              payload: { path: `/listing/${message.action!.payload.listingId}` }
                            });
                          }
                        }}
                      >
                        Show me this listing
                      </Button>
                    </div>
                  </div>
                )}
                
                {/* Feedback buttons for assistant messages */}
                {message.role === "assistant" && !message.feedback && (
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs text-gray-500">Was this helpful?</span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 text-gray-400 hover:text-green-500"
                      onClick={() => handleFeedback(message.id, 5)}
                    >
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => handleFeedback(message.id, 1)}
                    >
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                
                {/* Feedback confirmation */}
                {message.role === "assistant" && message.feedback && (
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    {message.feedback.rating >= 4 ? (
                      <span className="text-green-600">Thanks for your positive feedback!</span>
                    ) : (
                      <span className="text-red-600">Thanks for your feedback. I'll try to do better.</span>
                    )}
                  </div>
                )}
              </div>
              {message.role === "user" && (
                <Avatar className="h-8 w-8 ml-2 mt-1">
                  <AvatarFallback className="bg-gray-200 text-gray-800 text-xs">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <Avatar className="h-8 w-8 mr-2 mt-1">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  <Sparkles className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 text-gray-800 rounded-2xl rounded-tl-none px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Suggestions */}
      {messages.length > 0 && messages[messages.length - 1].suggestions && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7 px-2 bg-white hover:bg-gray-100 border-gray-300 rounded-full"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Removed extra padding */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            placeholder="Ask REN anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            className="flex-1 rounded-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm"
          />
          <Button 
            onClick={handleSend} 
            disabled={isLoading || !input.trim()}
            className="rounded-full bg-blue-500 hover:bg-blue-600 h-9 w-9 p-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}