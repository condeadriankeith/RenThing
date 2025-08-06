import React, { useState, useEffect } from 'react';
import {
  Tabs,
  Tab,
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Fade,
  Slide,
  Skeleton,
  IconButton,
  Divider
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  AccessTime as AccessTimeIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useBookings } from '../context/BookingContext';
import { motion } from 'framer-motion';
const Bookings = () => {
  const { 
    bookings, 
    loading, 
    getActiveBookings, 
    getPastBookings, 
    getIncomingBookings 
  } = useBookings();
  const [activeTab, setActiveTab] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  
  const showAlert = (message, severity = 'info') => {
    setAlert({ open: true, message, severity });
    setTimeout(() => {
      setAlert({ ...alert, open: false });
    }, 3000);
  };
  const renderBookingCard = (booking, index) => {
    const statusColors = {
      active: { bg: '#4CAF50', icon: '🟢' },
      past: { bg: '#757575', icon: '⚪' },
      incoming: { bg: '#FFC107', icon: '🟡' }
    };

    const statusConfig = statusColors[booking.status] || { bg: '#008080', icon: '🔵' };

    return (
      <Grid xs={12} sm={6} lg={4} key={booking.id}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -8 }}
        >
          <Card sx={{
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0,128,128,0.18)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.32) 60%, rgba(0,128,128,0.14) 100%)',
            backdropFilter: 'blur(18px)',
            WebkitBackdropFilter: 'blur(18px)',
            border: '2px solid rgba(255,255,255,0.25)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 16px 48px rgba(0, 128, 128, 0.2)',
              transform: 'translateY(-4px)',
            },
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Chip
                  icon={<AccessTimeIcon />}
                  label={booking.status.toUpperCase()}
                  size="small"
                  sx={{
                    bgcolor: statusConfig.bg,
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    '& .MuiChip-icon': {
                      color: 'white',
                    }
                  }}
                />
              </Box>

              <Typography variant="h6" sx={{ 
                fontWeight: 700, 
                color: '#008080',
                mb: 1,
                lineHeight: 1.3
              }}>
                {booking.title}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationIcon sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {booking.location || 'Location TBD'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ fontSize: 16, color: '#666', mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  {booking.start_date} - {booking.end_date}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MoneyIcon sx={{ fontSize: 20, color: '#008080', mr: 1 }} />
                  <Typography variant="h6" sx={{ 
                    fontWeight: 700, 
                    color: '#008080',
                    fontSize: '1.25rem'
                  }}>
                    ₱{booking.price}
                  </Typography>
                </Box>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      borderRadius: '50px',
                      bgcolor: '#008080',
                      color: 'white',
                      fontWeight: 600,
                      px: 3,
                      py: 1,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: '#006666',
                        boxShadow: '0 4px 12px rgba(0, 128, 128, 0.3)',
                      }
                    }}
                  >
                    View Details
                  </Button>
                </motion.div>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Grid>
    );
  };
  const LoadingSkeleton = () => (
    <Grid container spacing={3}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Grid xs={12} sm={6} lg={4} key={i}>
          <Card sx={{ borderRadius: '20px' }}>
            <Skeleton variant="rectangular" height={200} />

            <CardContent>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="80%" />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="90%" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          minHeight: '100vh',
          background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 60%, rgba(0,128,128,0.10) 100%)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          boxShadow: '0 8px 32px 0 rgba(0,128,128,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.08) inset',
          border: '2px solid rgba(255,255,255,0.25)',
          borderRadius: '32px',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#008080',
                mb: 3,
                textAlign: 'center',
                textShadow: '0 2px 16px rgba(0,128,128,0.18)',
                letterSpacing: '0.04em',
              }}
            >
              My Bookings
            </Typography>
            <Card sx={{ 
              borderRadius: '28px', 
              boxShadow: '0 12px 48px rgba(0,128,128,0.22)',
              maxWidth: '800px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.32) 60%, rgba(0,128,128,0.14) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '2.5px solid rgba(255,255,255,0.45)',
              overflow: 'hidden',
              position: 'relative',
              '&:before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(120deg, rgba(255,255,255,0.12) 0%, rgba(0,128,128,0.08) 100%)',
                zIndex: 0,
                pointerEvents: 'none',
              },
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <LoadingSkeleton />
              </CardContent>
            </Card>
          </Box>
        </Container>
      </motion.div>
    );
  }
  const renderBookings = () => {
    let bookingsToRender = [];
    switch (activeTab) {
      case 0:
        bookingsToRender = getActiveBookings();
        break;
      case 1:
        bookingsToRender = getPastBookings();
        break;
      case 2:
        bookingsToRender = getIncomingBookings();
        break;
      default:
        bookingsToRender = getActiveBookings();
    }

    if (bookingsToRender.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ 
            textAlign: 'center', 
            py: 8,
            background: 'linear-gradient(135deg, #f8fffe 0%, #ffffff 100%)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 128, 128, 0.1)'
          }}>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: '#008080',
              mb: 2
            }}>
              No bookings found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {activeTab === 0 ? 'You have no active bookings at the moment.' :
               activeTab === 1 ? 'No past bookings to display.' :
               'No incoming bookings to review.'}
            </Typography>
          </Box>
        </motion.div>
      );
    }

    return (
      <Grid container spacing={3}>
        {bookingsToRender.map((booking, index) => renderBookingCard(booking, index))}
      </Grid>
    );
  };
  return (
      <Container maxWidth="lg" sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        pt: 4,
      }}>
        <Box sx={{ width: '100%', maxWidth: '800px', mx: 'auto', pt: 0, pb: 4 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#008080',
                mb: 3,
                textAlign: 'center',
                textShadow: '0 2px 16px rgba(0,128,128,0.18)',
                letterSpacing: '0.04em',
              }}
            >
              My Bookings
            </Typography>
            {alert.open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Alert 
                  severity={alert.severity} 
                  sx={{ 
                    mb: 3, 
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 128, 128, 0.1)',
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
              </motion.div>
            )}
            <Card sx={{ 
              borderRadius: '28px', 
              boxShadow: '0 12px 48px rgba(0,128,128,0.22)',
              maxWidth: '800px',
              margin: '0 auto',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.32) 60%, rgba(0,128,128,0.14) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '2.5px solid rgba(255,255,255,0.45)',
              overflow: 'hidden',
              position: 'relative',
            }}>
              <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleChangeTab} 
                  centered 
                  sx={{
                    background: 'linear-gradient(135deg, #f8fffe 0%, #ffffff 100%)',
                    borderBottom: '1px solid rgba(0, 128, 128, 0.1)',
                    borderRadius: '999px',
                    minHeight: '56px',
                    '.MuiTabs-indicator': {
                      display: 'none',
                    },
                    '.MuiTab-root': {
                      color: '#666',
                      fontWeight: 600,
                      fontSize: '1rem',
                      py: 2,
                      px: 4,
                      borderRadius: '999px',
                      margin: '0 8px',
                      transition: 'all 0.3s ease',
                      backgroundColor: 'transparent',
                      '&.Mui-selected': {
                        color: '#fff',
                        background: 'linear-gradient(90deg, #008080 60%, #00b4b4 100%)',
                        boxShadow: '0 2px 8px rgba(0,128,128,0.10)',
                        opacity: 1,
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(0, 128, 128, 0.08)',
                        color: '#008080',
                        opacity: 1,
                      },
                      '&.Mui-selected:hover': {
                        background: 'linear-gradient(90deg, #008080 60%, #00b4b4 100%)',
                        color: '#fff',
                        opacity: 1,
                      }
                    },
                  }}
                >
                  <Tab label="Active Bookings" />
                  <Tab label="Past Bookings" />
                  <Tab label="Incoming Bookings" />
                </Tabs>
                <Box sx={{ p: 2 }}>
                  {renderBookings()}
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Container>
  );
};

export default Bookings;
