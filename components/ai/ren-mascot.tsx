"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { MessageCircle, Sparkles, Zap } from "lucide-react";
import { RenChat } from "@/components/ai/ren-chat"; // Added import for RenChat
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface RenMascotProps {
  variant?: "floating" | "static";
  size?: "sm" | "md" | "lg";
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  onChatOpen?: () => void;
}

export function RenMascot({
  variant = "floating",
  size = "md",
  position = "bottom-right",
  onChatOpen
}: RenMascotProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isEnergized, setIsEnergized] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Handle energized state periodically to show REN's enhanced capabilities
  useEffect(() => {
    const energizeInterval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance to show energized state
        setIsEnergized(true);
        setTimeout(() => setIsEnergized(false), 2000);
      }
    }, 15000);

    return () => clearInterval(energizeInterval);
  }, []);

  // Size classes
  const sizeClasses = {
    sm: "h-12 w-12 text-lg",
    md: "h-16 w-16 text-xl",
    lg: "h-20 w-20 text-2xl"
  };

  // Position classes
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6"
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating button for mobile/tablet */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        <motion.button 
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
          whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
        >
          <Sparkles className="w-8 h-8 text-white" />
          <span className="sr-only">Open REN chat</span>
        </motion.button>
        
        {isModalOpen && (
          <RenChat 
            onClose={() => setIsModalOpen(false)} 
            onMinimize={() => setIsModalOpen(false)} // Changed to close instead of minimize
          />
        )}
      </div>

      {/* Tooltip version for desktop */}
      <TooltipProvider>
        <AnimatePresence>
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className={`fixed ${variant === "floating" ? positionClasses[position] : ""} z-50 hidden md:block`}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`relative ${variant === "floating" ? "cursor-pointer" : ""}`}
                  onClick={onChatOpen}
                >
                  <motion.div
                    animate={prefersReducedMotion ? {} : { y: [0, -5, 0] }}
                    transition={prefersReducedMotion ? {} : { 
                      duration: 2, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    <Avatar className={`${sizeClasses[size]} rounded-full shadow-lg border-2 border-white`}>
                      <AvatarFallback className={`bg-gradient-to-br ${isEnergized ? 'from-purple-600 to-pink-600' : 'from-blue-500 to-purple-600'} text-white font-bold`}>
                        {isEnergized ? (
                          <Zap className="h-8 w-8 text-yellow-300" />
                        ) : (
                          <Sparkles className="h-8 w-8" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  
                  {/* Status indicator */}
                  <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"></div>
                  
                  {/* Floating action buttons */}
                  {variant === "floating" && (
                    <motion.div
                      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
                      animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      transition={prefersReducedMotion ? { duration: 0.1 } : { duration: 0.3 }}
                      className="absolute -top-2 -left-2 flex flex-col space-y-2"
                    >
                      <Button 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChatOpen?.();
                        }}
                      >
                        <MessageCircle className="h-4 w-4 text-white" />
                      </Button>
                    </motion.div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side={position.includes("bottom") ? "top" : "bottom"}
                className="bg-gradient-to-br from-blue-600 to-purple-700 text-white border-0"
              >
                <p className="font-medium">Hi, I'm REN! Your AI assistant</p>
                <p className="text-xs opacity-90">Click to chat or get help</p>
                {isEnergized && (
                  <p className="text-xs mt-1 flex items-center">
                    <Zap className="h-3 w-3 mr-1 text-yellow-300" />
                    Enhanced capabilities activated!
                  </p>
                )}
              </TooltipContent>
            </Tooltip>
          </motion.div>
        </AnimatePresence>
      </TooltipProvider>
    </>
  );
}