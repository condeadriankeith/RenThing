import React, { useState, useEffect, useRef } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Badge,
  IconButton,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { useChat } from '../context/ChatContext';

const Chat = () => {
  const { conversations, activeConversation, setActiveConversation, sendMessage, loading } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);
  
  const quickReplies = [
    "Is this still available?",
    "Can I rent it tomorrow?",
    "What's your best price?",
    "Can you deliver?"
  ];
  
  const showAlert = (message, severity = 'info') => {
    setAlert({ open: true, message, severity });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, open: false }));
    }, 3000);
  };
  
  const handleQuickReply = (message) => {
    setNewMessage(message);
    messageInputRef.current?.focus();
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      sendMessage(activeConversation.id, newMessage);
      setNewMessage('');
      showAlert('Message sent!', 'success');
    } else if (!activeConversation) {
      showAlert('Please select a conversation first', 'warning');
    } else {
      showAlert('Please enter a message', 'warning');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh' 
        }}>
          <CircularProgress sx={{ color: '#008080' }} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{
      mt: 4,
      mb: 4,
      background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 60%, rgba(0,128,128,0.10) 100%)',
      backdropFilter: 'blur(32px)',
      WebkitBackdropFilter: 'blur(32px)',
      boxShadow: '0 8px 32px 0 rgba(0,128,128,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.08) inset',
      border: '2px solid rgba(255,255,255,0.25)',
      borderRadius: '32px',
      overflow: 'hidden',
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2,
    }}>
      <Box sx={{ mt: 4, mb: 4 }}>
        {alert.open && (
          <Alert 
            severity={alert.severity} 
            sx={{ 
              mb: 3, 
              borderRadius: '12px',
              '& .MuiAlert-icon': {
                color: alert.severity === 'success' ? '#2E7D32' : 
                       alert.severity === 'error' ? '#C62828' : 
                       alert.severity === 'warning' ? '#FF8F00' : '#008080'
              },
              '& .MuiAlert-message': {
                fontWeight: 500
              }
            }}
          >
            {alert.message}
          </Alert>
        )}
        
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#008080',
            mb: 3,
            textAlign: 'center'
          }}
        >
          Messages
        </Typography>
        
        <Card sx={{ 
          borderRadius: '16px', 
          boxShadow: '0 4px 12px rgba(0, 128, 128, 0.1)',
          height: '70vh',
          display: 'flex'
        }}>
          {/* Conversations List */}
          <Box sx={{ 
            width: '35%', 
            borderRight: '1px solid #E0E0E0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <CardContent sx={{ 
              p: 2, 
              pb: '16px !important',
              borderBottom: '1px solid #E0E0E0'
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#008080' }}>
                Conversations
              </Typography>
            </CardContent>
            
            <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
              <List sx={{ p: 0 }}>
                {conversations.map(conversation => (
                  <ListItem 
                    key={conversation.id}
                    button
                    onClick={() => {
                      setActiveConversation(conversation);
                      showAlert(`Opened conversation with ${conversation.user.name}`, 'info');
                    }}
                    sx={{ 
                      borderBottom: '1px solid #F0F0F0',
                      backgroundColor: activeConversation?.id === conversation.id ? '#E0F7F7' : 'transparent',
                      '&:hover': {
                        backgroundColor: activeConversation?.id === conversation.id ? '#E0F7F7' : '#F5F5F5'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Badge 
                        badgeContent={conversation.unreadCount} 
                        color="primary"
                        sx={{ 
                          '& .MuiBadge-badge': {
                            backgroundColor: '#008080'
                          }
                        }}
                      >
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>
                    <ListItemText 
                      primary={conversation.user.name}
                      secondary={conversation.lastMessage.text}
                      primaryTypographyProps={{ 
                        fontWeight: conversation.unreadCount > 0 ? 600 : 400,
                        color: '#0C1F26'
                      }}
                      secondaryTypographyProps={{ 
                        noWrap: true,
                        color: '#5A7D8C'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {conversation.lastMessage.time}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
          
          {/* Chat Window */}
          <Box sx={{ 
            width: '65%', 
            display: 'flex',
            flexDirection: 'column'
          }}>
            {activeConversation ? (
              <>
                <CardContent sx={{ 
                  p: 2, 
                  pb: '16px !important',
                  borderBottom: '1px solid #E0E0E0'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>
                      <PersonIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: '#008080' }}>
                        {activeConversation.user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Online
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
                
                <Box sx={{ 
                  flexGrow: 1, 
                  p: 2, 
                  overflow: 'auto',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <Box className="chat-thread">
                    {activeConversation ? (
                      <>
                        {activeConversation.messages?.map((msg, idx) => (
                          <Box
                            key={idx}
                            className={`message-bubble ${msg.sent ? 'message-sent' : 'message-received'}`}
                            sx={{
                              background: 'rgba(255,255,255,0.32)',
                              backdropFilter: 'blur(12px)',
                              WebkitBackdropFilter: 'blur(12px)',
                              borderRadius: '16px',
                              boxShadow: '0 2px 8px rgba(0,128,128,0.10)',
                              border: '1.5px solid rgba(255,255,255,0.18)',
                              p: 2,
                              mb: 1,
                            }}
                          >
                            <Typography variant="body2">{msg.text}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', textAlign: msg.sent ? 'right' : 'left', mt: 0.5 }}>
                              {msg.time}
                            </Typography>
                          </Box>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    ) : (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        Select a conversation to start chatting
                      </Typography>
                    )}
                  </Box>
                </Box>
                
                <Box sx={{ 
                  p: 2, 
                  borderTop: '1px solid #E0E0E0',
                  display: 'flex'
                }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    variant="outlined"
                    sx={{ 
                      mr: 1,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '24px',
                        backgroundColor: '#F4F9F9'
                      }
                    }}
                  />
                  <IconButton 
                    onClick={handleSendMessage}
                    sx={{ 
                      backgroundColor: '#008080',
                      color: 'white',
                      width: '48px',
                      height: '48px',
                      '&:hover': {
                        backgroundColor: '#006666'
                      }
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
              </>
            ) : (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100%' 
              }}>
                <Typography variant="h6" color="text.secondary">
                  Select a conversation to start chatting
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default Chat;
