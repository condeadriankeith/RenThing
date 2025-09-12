"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, Zap, MessageCircle, X, Minimize, Trash2 } from "lucide-react";
import { RenChat } from "@/components/ai/ren-chat";
import { usePathname } from "next/navigation";

interface RenModalProps {
  onAction?: (action: any) => void;
}

export function RenModal({ onAction }: RenModalProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasProactiveSuggestion, setHasProactiveSuggestion] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [serverRestartChecked, setServerRestartChecked] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Check for server restart and load chat history accordingly
  useEffect(() => {
    const checkServerRestart = async () => {
      try {
        const response = await fetch('/api/server-status');
        const serverStatus = await response.json();
        
        if (serverStatus.restarted) {
          console.log('Server was restarted, clearing chat history');
          // Clear chat history from localStorage
          localStorage.removeItem('renChatMessages');
          // Set to default welcome message
          setChatMessages([
            {
              id: "1",
              content: "Hi there! I'm REN, your rental assistant. I can help you find items, explain how things work, or even search the web for tips. What can I do for you today?",
              role: "assistant",
              timestamp: new Date(),
              suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
            }
          ]);
        } else {
          // Load existing chat history from localStorage
          try {
            const savedMessages = localStorage.getItem('renChatMessages')
            if (savedMessages) {
              const parsedMessages = JSON.parse(savedMessages)
              // Convert timestamp strings back to Date objects
              const messagesWithDates = parsedMessages.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp)
              }))
              setChatMessages(messagesWithDates)
            } else {
              // Set default welcome message if no history exists
              setChatMessages([
                {
                  id: "1",
                  content: "Hi there! I'm REN, your rental assistant. I can help you find items, explain how things work, or even search the web for tips. What can I do for you today?",
                  role: "assistant",
                  timestamp: new Date(),
                  suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
                }
              ])
            }
          } catch (error) {
            console.error('Failed to load chat history:', error)
            // Reset to default welcome message if there's an error
            setChatMessages([
              {
                id: "1",
                content: "Hi there! I'm REN, your rental assistant. I can help you find items, explain how things work, or even search the web for tips. What can I do for you today?",
                role: "assistant",
                timestamp: new Date(),
                suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
              }
            ])
          }
        }
        setServerRestartChecked(true);
      } catch (error) {
        console.error('Failed to check server status:', error)
        // Fallback to loading existing chat history
        try {
          const savedMessages = localStorage.getItem('renChatMessages')
          if (savedMessages) {
            const parsedMessages = JSON.parse(savedMessages)
            // Convert timestamp strings back to Date objects
            const messagesWithDates = parsedMessages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
            setChatMessages(messagesWithDates)
          } else {
            // Set default welcome message if no history exists
            setChatMessages([
              {
                id: "1",
                content: "Hi there! I'm REN, your rental assistant. I can help you find items, explain how things work, or even search the web for tips. What can I do for you today?",
                role: "assistant",
                timestamp: new Date(),
                suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
              }
            ])
          }
        } catch (loadError) {
          console.error('Failed to load chat history:', loadError)
          // Reset to default welcome message if there's an error
          setChatMessages([
            {
              id: "1",
              content: "Hi there! I'm REN, your rental assistant. I can help you find items, explain how things work, or even search the web for tips. What can I do for you today?",
              role: "assistant",
              timestamp: new Date(),
              suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
            }
          ])
        }
        setServerRestartChecked(true);
      }
    };

    checkServerRestart();
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    // Only save if we've already checked for server restart
    if (serverRestartChecked && chatMessages.length > 0) {
      try {
        localStorage.setItem('renChatMessages', JSON.stringify(chatMessages))
      } catch (error) {
        console.error('Failed to save chat history:', error)
      }
    }
  }, [chatMessages, serverRestartChecked]);

  // Handle proactive suggestions
  useEffect(() => {
    // Simulate proactive suggestions based on user behavior
    const simulateProactiveSuggestions = () => {
      // Check if user is on a specific page for a while
      if (pathname === '/list-item' || pathname === '/browse') {
        // 30% chance to show proactive suggestion
        if (Math.random() > 0.7) {
          setHasProactiveSuggestion(true);
          // Clear the suggestion after 5 seconds
          setTimeout(() => setHasProactiveSuggestion(false), 5000);
        }
      }
    };

    const interval = setInterval(simulateProactiveSuggestions, 10000);
    return () => clearInterval(interval);
  }, [pathname]);

  // Handle clicks outside the modal to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (isChatOpen && !isMinimized) {
          setIsMinimized(true);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isChatOpen, isMinimized]);

  // Clear chat history
  const clearChatHistory = () => {
    const welcomeMessage = [
      {
        id: "1",
        content: "Hi there! I'm REN, your rental assistant. I can help you find items, explain how things work, or even search the web for tips. What can I do for you today?",
        role: "assistant",
        timestamp: new Date(),
        suggestions: ["Find rentals", "List items", "Check bookings", "View wishlist"]
      }
    ]
    setChatMessages(welcomeMessage)
    // Also clear localStorage
    try {
      localStorage.removeItem('renChatMessages')
    } catch (error) {
      console.error('Failed to clear chat history from localStorage:', error)
    }
  }

  // Handle navigation actions from REN
  const handleRenNavigation = async (path: string) => {
    // In a real implementation, this would navigate to the path
    console.log(`REN navigating to: ${path}`);
    if (onAction) {
      onAction({ type: 'navigate', payload: { path } });
    }
  }

  // Handle external actions from REN
  const handleRenAction = async (action: any) => {
    if (action.type === 'navigate') {
      await handleRenNavigation(action.payload.path)
    } else if (action.type === 'suggest_listing') {
      // Handle listing suggestions
      console.log("REN suggested listing:", action.payload.listingId)
      // In a real implementation, we could show a preview or notification
    } else if (action.type === 'show_listing') {
      // Navigate to the specific listing
      await handleRenNavigation(`/listing/${action.payload.listingId}`)
    } else if (action.type === 'search_query') {
      // Handle search queries
      await handleRenNavigation(`/browse?query=${encodeURIComponent(action.payload.query)}`)
    } else if (action.type === 'web_search') {
      // Handle web search requests
      console.log("REN requesting web search:", action.payload.query)
    }
    // Add more action types as needed
  }

  return (
    <>
      {/* Always-on circular mascot button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.button
          className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center cursor-pointer border-2 border-white"
          onClick={() => {
            setIsChatOpen(true);
            setIsMinimized(false);
            setHasProactiveSuggestion(false); // Clear proactive suggestion when opening
          }}
          animate={hasProactiveSuggestion ? { 
            scale: [1, 1.1, 1],
            boxShadow: [
              "0 0 0 0 rgba(59, 130, 246, 0.7)",
              "0 0 0 10px rgba(59, 130, 246, 0.3)",
              "0 0 0 0 rgba(59, 130, 246, 0)"
            ]
          } : {}}
          transition={{ 
            duration: 1.5,
            repeat: hasProactiveSuggestion ? Infinity : 0,
            repeatType: "loop"
          }}
        >
          <Avatar className="h-10 w-10 rounded-full">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Sparkles className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
        </motion.button>
      </motion.div>

      {/* Chat Modal */}
      <AnimatePresence>
        {isChatOpen && !isMinimized && (
          <>
            {/* Semi-transparent overlay */}
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMinimized(true)}
            />
            
            {/* Chat modal that expands from the mascot button */}
            <motion.div
              ref={modalRef}
              className="fixed bottom-20 right-6 z-50"
              initial={{ 
                scale: 0,
                x: 0,
                y: 0,
                width: 56,
                height: 56
              }}
              animate={{ 
                scale: 1,
                x: -132, // Center the modal relative to the button
                y: -200,
                width: 320,
                height: 500
              }}
              exit={{ 
                scale: 0,
                x: 0,
                y: 0,
                width: 56,
                height: 56
              }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="bg-white rounded-2xl shadow-xl h-full flex flex-col border border-gray-200 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <h3 className="font-semibold flex items-center">
                    <Sparkles className="h-5 w-5 mr-2" />
                    Chat with REN
                  </h3>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                      onClick={clearChatHistory}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-8 w-8 text-white hover:bg-white hover:bg-opacity-20 rounded-full"
                      onClick={() => setIsMinimized(true)}
                    >
                      <Minimize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex-grow overflow-hidden flex flex-col">
                  <RenChat 
                    onAction={handleRenAction}
                    onMessagesChange={setChatMessages}
                    initialMessages={chatMessages}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Minimized chat indicator */}
      <AnimatePresence>
        {isChatOpen && isMinimized && (
          <motion.div
            className="fixed bottom-20 right-6 z-50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Button
              className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full px-4 py-2 flex items-center"
              onClick={() => setIsMinimized(false)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat with REN
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}