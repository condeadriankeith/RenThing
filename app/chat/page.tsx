"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { SpinnerLoader } from "@/components/ui/spinner-loader";
import { Chat } from "../../components/chat";

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

const ChatPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Still loading
    
    if (!session) {
      router.push("/auth/login");
      return;
    }
  }, [session, status, router]);

  // Show loading spinner while session is loading
  if (status === "loading") {
    return (
      <main className="max-w-2xl mx-auto p-4">
        <div className="flex flex-col items-center justify-center py-8 space-y-4">
          <SpinnerLoader size="lg" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </main>
    );
  }

  // Redirect if not authenticated
  if (!session) {
    return (
      <main className="max-w-2xl mx-auto p-4">
        <div className="text-center py-8">
          <p className="text-gray-600">Redirecting to login...</p>
        </div>
      </main>
    );
  }

  // In a real app, you would get the ownerId from the query or user context
  const ownerId = "owner123";
  
  return (
    <main className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat</h1>
      <Chat ownerId={ownerId} />
    </main>
  );
};

export default ChatPage;
