"use client";

import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sparkles, MessageCircle, Minimize, Trash2 } from "lucide-react";
import { RenChat } from "@/components/ai/ren-chat";

interface ChatWidgetProps {
  onAction?: (action: any) => void;
}

export function ChatWidget({ onAction }: ChatWidgetProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [modalPosition, setModalPosition] = useState({ right: 18, bottom: 90 });

  // Position the modal above the button
  useEffect(() => {
    const reposition = () => {
      const btn = btnRef.current;
      const modal = modalRef.current;
      if (!btn || !modal) return;
      
      const rect = btn.getBoundingClientRect();
      const margin = 12; // gap between button and modal

      // distance from right edge
      const rightDist = Math.max(12, window.innerWidth - rect.right + margin);
      // distance from bottom to button top -> place modal above button
      const bottomDist = Math.max(12, window.innerHeight - rect.top + margin);

      setModalPosition({
        right: rightDist,
        bottom: bottomDist
      });
    };

    reposition();
    window.addEventListener('resize', reposition);
    const ro = new ResizeObserver(reposition);
    if (btnRef.current) ro.observe(btnRef.current);

    return () => {
      window.removeEventListener('resize', reposition);
      ro.disconnect();
    };
  }, []);

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
    ];
    setChatMessages(welcomeMessage);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        ref={btnRef}
        className="ren-floating-button bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg flex items-center justify-center cursor-pointer border-2 border-white"
        onClick={() => {
          setIsChatOpen(true);
          setIsMinimized(false);
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Avatar className="h-10 w-10 rounded-full">
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <Sparkles className="h-6 w-6" />
          </AvatarFallback>
        </Avatar>
      </motion.button>

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
            
            {/* Chat modal positioned above the button */}
            <motion.div
              ref={modalRef}
              className="ren-chat-modal"
              style={{
                right: `${modalPosition.right}px`,
                bottom: `${modalPosition.bottom}px`,
              }}
              initial={{ 
                scale: 0,
                width: 56,
                height: 56
              }}
              animate={{ 
                scale: 1,
                width: 320,
                height: 500
              }}
              exit={{ 
                scale: 0,
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
                    onAction={onAction}
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