import React, { createContext, useState, useContext, useEffect } from 'react';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching conversations from backend
    const fetchConversations = () => {
      // Mock data - in a real app, you would fetch from your backend
      const mockConversations = [
        {
          id: 1,
          user: {
            id: 101,
            name: 'John Doe',
            avatar: ''
          },
          lastMessage: {
            text: 'Hey, is the camera still available?',
            time: '10:30 AM'
          },
          unreadCount: 2,
          messages: [
            {
              id: 1,
              text: 'Hi there! I\'m interested in renting your camera.',
              time: '9:15 AM',
              fromMe: false
            },
            {
              id: 2,
              text: 'Hey, is the camera still available?',
              time: '10:30 AM',
              fromMe: false
            }
          ]
        },
        {
          id: 2,
          user: {
            id: 102,
            name: 'Sarah Miller',
            avatar: ''
          },
          lastMessage: {
            text: 'Thanks for the rental!',
            time: 'Yesterday'
          },
          unreadCount: 0,
          messages: [
            {
              id: 1,
              text: 'The bike was in perfect condition, thanks!',
              time: 'Yesterday',
              fromMe: true
            },
            {
              id: 2,
              text: 'Thanks for the rental!',
              time: 'Yesterday',
              fromMe: false
            }
          ]
        },
        {
          id: 3,
          user: {
            id: 103,
            name: 'Mike Thompson',
            avatar: ''
          },
          lastMessage: {
            text: 'Can I extend the rental for 2 more days?',
            time: 'Wed',
            fromMe: false
          },
          unreadCount: 1,
          messages: [
            {
              id: 1,
              text: 'Can I extend the rental for 2 more days?',
              time: 'Wed',
              fromMe: false
            }
          ]
        }
      ];
      
      setConversations(mockConversations);
      if (mockConversations.length > 0) {
        setActiveConversation(mockConversations[0]);
      }
      setLoading(false);
    };

    setTimeout(() => {
      fetchConversations();
    }, 1000); // Simulate network delay
  }, []);

  const sendMessage = (conversationId, messageText) => {
    const newMessage = {
      id: Date.now(),
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      fromMe: true
    };

    setConversations(prev => 
      prev.map(conversation => {
        if (conversation.id === conversationId) {
          const updatedConversation = {
            ...conversation,
            lastMessage: {
              text: messageText,
              time: newMessage.time
            },
            messages: [...conversation.messages, newMessage]
          };
          
          // If this is the active conversation, update it too
          if (activeConversation && activeConversation.id === conversationId) {
            setActiveConversation(updatedConversation);
          }
          
          return updatedConversation;
        }
        return conversation;
      })
    );
  };

  const value = {
    conversations,
    activeConversation,
    setActiveConversation,
    loading,
    sendMessage
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
