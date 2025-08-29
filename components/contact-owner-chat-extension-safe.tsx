"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/extension-safe-modal";
import { Chat } from "@/components/chat";

interface ContactOwnerChatProps {
  ownerId: string;
  ownerName: string;
  listingId?: string;
}

export function ContactOwnerChat({ ownerId, ownerName, listingId }: ContactOwnerChatProps) {
  const [open, setOpen] = useState(false);

  const handleOpenFullChat = () => {
    setOpen(false);
    window.location.href = "/chat";
  };

  return (
    <>
      <Button variant="default" size="sm" onClick={() => setOpen(true)}>
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
