import React from "react";
import { Chat } from "../../components/chat";

const ChatPage = () => {
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
