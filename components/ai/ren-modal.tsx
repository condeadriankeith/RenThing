"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatWidget } from "@/components/ai/chat-widget";

interface RenModalProps {
  onAction?: (action: any) => void;
}

export function RenModal({ onAction }: RenModalProps) {
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
    <ChatWidget onAction={handleRenAction} />
  );
}
