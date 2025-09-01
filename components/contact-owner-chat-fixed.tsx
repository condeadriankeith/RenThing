"use client";
/**
 * Contact Owner Chat Component
 * 
 * BUSINESS RULE: Creates permanent transaction history
 * When a customer clicks "Contact Owner", this initiates a permanent
 * chat room that serves as transaction evidence and cannot be deleted.
 */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal-no-ssr";
import { Chat } from "@/components/chat";
import { MessageCircle } from "lucide-react";

interface ContactOwnerChatProps {
  ownerId: string;
  ownerName: string;
  listingId?: string;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showIcon?: boolean;
}

export function ContactOwnerChat({ 
  ownerId, 
  ownerName, 
  listingId, 
  variant = "default", 
  size = "sm", 
  className = "",
  showIcon = true 
}: ContactOwnerChatProps) {
  const [open, setOpen] = useState(false);
  
  const handleOpenFullChat = () => {
    setOpen(false);
    // Redirect to inbox page which shows all chats
    window.location.href = "/inbox";
  };
  
  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={() => setOpen(true)}
        title="Start a conversation with the owner. Note: Chat history is permanent and serves as transaction record."
      >
        {showIcon && <MessageCircle className="h-4 w-4 mr-2" />}
        Contact Owner
      </Button>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="mb-2 font-semibold">Chat with {ownerName}</div>
        <Chat 
          ownerId={ownerId} 
          listingId={listingId}
          onOpenFullChat={handleOpenFullChat} 
        />
      </Modal>
    </>
  );
}
