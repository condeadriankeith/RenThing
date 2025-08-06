import React from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Tabs,
  Tab,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon
} from '@mui/icons-material';
import { useListings } from '../context/ListingContext';
import { motion } from 'framer-motion';

const Listings = () => {
  const { listings, loading } = useListings();
  const [activeTab, setActiveTab] = React.useState(0);

  // In a real app, you would filter by user's listings
  // For now, we'll just use all listings
  const user = { id: 1 }; // Mock user
  const userActiveListings = listings.filter(listing => listing.owner === 'You');
  const userInactiveListings = listings.filter(listing => listing.owner !== 'You');

  const renderListingCard = (listing) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{
        borderRadius: '28px',
        boxShadow: '0 12px 48px rgba(0,128,128,0.22)',
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
        {/* ...existing code... */}
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 60%, rgba(0,128,128,0.10) 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,128,128,0.18)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1.5px solid rgba(255,255,255,0.35)',
      }}>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '60vh',
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CircularProgress sx={{ color: '#008080' }} />
          </motion.div>
        </Box>
      </Container>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 60%, rgba(0,128,128,0.10) 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,128,128,0.18)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1.5px solid rgba(255,255,255,0.35)',
      }}>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#008080',
              mb: 3,
              textAlign: 'center',
              textShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          >
            My Listings
          </Typography>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
          >
            <Box sx={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 60%, rgba(0,128,128,0.10) 100%)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0,128,128,0.18)',
              backdropFilter: 'blur(18px)',
              WebkitBackdropFilter: 'blur(18px)',
              border: '1.5px solid rgba(255,255,255,0.35)',
              mb: 4,
            }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#008080',
                  },
                }}
              >
                <Tab
                  label={`Active (${userActiveListings.length})`}
                  sx={{
                    fontWeight: 600,
                    '&.Mui-selected': {
                      color: '#008080',
                    },
                  }}
                />
                <Tab 
                  label={`Inactive (${userInactiveListings.length})`} 
                  sx={{ 
                    fontWeight: 600,
                    '&.Mui-selected': {
                      color: '#008080',
                    }
                  }} 
                />
              </Tabs>
              <Box sx={{ p: 3 }}>
                {activeTab === 0 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#008080' }}>
                      Active Listings
                    </Typography>
                    {userActiveListings.length > 0 ? (
                      userActiveListings.map(listing => renderListingCard(listing))
                    ) : (
                      <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: '#5A7D8C' }}>
                        You don't have any active listings. <Button sx={{ ml: 1, textTransform: 'none' }} href="/add">Add a new listing</Button>
                      </Typography>
                    )}
                  </Box>
                )}
                {activeTab === 1 && (
                  <Box>
                    <Typography variant="h6" sx={{ mb: 2, color: '#008080' }}>
                      Inactive Listings
                    </Typography>
                    {userInactiveListings.length > 0 ? (
                      userInactiveListings.map(listing => renderListingCard(listing))
                    ) : (
                      <Typography variant="body1" sx={{ textAlign: 'center', py: 4, color: '#5A7D8C' }}>
                        You don't have any inactive listings.
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Listings;
