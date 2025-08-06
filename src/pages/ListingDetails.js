import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  IconButton,
  TextField,
  Divider,
  Avatar,
  Rating
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  CalendarToday as CalendarIcon,
  Chat as ChatIcon,
  Favorite as FavoriteIcon,
  Share as ShareIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { useListings } from '../context/ListingContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Helper for demo images from Pexels
const getDemoImage = (idx) => `https://images.pexels.com/photos/${1000000 + idx}/pexels-photo-${1000000 + idx}.jpeg?auto=compress&cs=tinysrgb&w=800`;

const PEXELS_API_KEY = 'S6YsEWf484ZrbOFrIVqU92AGsBlpMX8MomXebcBPmzUw9Wk8lhc1kKOV';

const fetchPexelsImage = async (query) => {
  try {
    const response = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    const photo = response.data.photos[0];
    return photo ? photo.src.large : null;
  } catch (error) {
    console.error('Error fetching image from Pexels:', error);
    return null;
  }
};

const ListingDetails = () => {
  const navigate = useNavigate();
  const { listings, loading } = useListings(); // Assume loading is provided by context
  const { user } = useAuth();
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [message, setMessage] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Responsive aspect ratio for gallery
  const galleryHeight = window.innerWidth < 600 ? 240 : window.innerWidth < 900 ? 360 : 500;

  // Robust fallback for listings
  let listing;
  if (Array.isArray(listings) && listings.length > 0 && listings[0]) {
    listing = listings[0];
    listing.images = Array.isArray(listing.images) && listing.images.length > 0 ? listing.images : ['https://via.placeholder.com/800x600?text=No+Image'];
    listing.owner = listing.owner || {
      name: 'Unknown',
      avatar: 'https://via.placeholder.com/48?text=?',
      rating: 0,
      responseRate: 'N/A',
      responseTime: 'N/A',
      memberSince: 'N/A',
      verifiedID: false
    };
    listing.title = listing.title || 'No Title';
    listing.description = listing.description || 'No Description';
    listing.price_per_day = listing.price_per_day || 0;
    listing.rating = listing.rating || 0;
    listing.reviews = listing.reviews || 0;
    listing.location = listing.location || 'Unknown';
    listing.availability = listing.availability || 'Unavailable';
  } else {
    listing = {
      id: 1,
      title: 'Sample Item',
      description: 'No listing data available.',
      price_per_day: 0,
      category: 'Sample',
      images: ['https://via.placeholder.com/800x600?text=No+Image'],
      owner: {
        name: 'Unknown',
        avatar: 'https://via.placeholder.com/48?text=?',
        rating: 0,
        responseRate: 'N/A',
        responseTime: 'N/A',
        memberSince: 'N/A',
        verifiedID: false
      },
      rating: 0,
      reviews: 0,
      location: 'Unknown',
      availability: 'Unavailable'
    };
  }

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{
        py: 8,
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 60%, rgba(0,128,128,0.10) 100%)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,128,128,0.18)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '1.5px solid rgba(255,255,255,0.35)',
      }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Box className="shimmer" sx={{ width: '100%', maxWidth: 600, height: galleryHeight, borderRadius: 3, mb: 3 }} />
          <Typography variant="h5" color="text.secondary">Loading listing...</Typography>
        </Box>
      </Container>
    );
  }

  const handleBookNow = () => {
    if (!user) {
      alert('Please log in to book this item');
      return;
    }
    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    alert(`Booking confirmed for ${listing.title} from ${checkIn} to ${checkOut}`);
  };

  const handleSendMessage = () => {
    if (!user) {
      alert('Please log in to send a message');
      return;
    }
    if (!message || typeof message !== 'string' || !message.trim()) {
      alert('Please enter a message');
      return;
    }
    alert(`Message sent to ${listing.owner.name}: ${message}`);
    setMessage('');
  };

  if (!listing) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error">No listing found.</Typography>
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
    }}>
      {/* Back Button */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{ color: '#008080', fontWeight: 600, textTransform: 'none' }}
        >
          Back to listings
        </Button>
      </Box>

      {/* Image Gallery */}
      <Box className="image-gallery" sx={{ mb: 4, borderRadius: { xs: 0, md: 3 }, overflow: 'hidden', boxShadow: 3 }}>
        <CardMedia
          component="img"
          height={galleryHeight}
          image={listing.images[currentImageIndex] || getDemoImage(currentImageIndex)}
          alt={listing.title}
          sx={{ objectFit: 'cover', width: '100%' }}
        />
        <Box className="gallery-nav">
          {listing.images.map((_, index) => (
            <Box
              key={index}
              className={`gallery-dot ${currentImageIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentImageIndex(index)}
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Box sx={{ mb: 3, px: { xs: 1, md: 0 } }}>
            <Typography variant="h4" sx={{ mb: 2, color: '#0C1F26', fontWeight: 700 }}>
              {listing.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
              <Chip icon={<LocationIcon />} label={listing.location} className="chip-teal" />
              <Chip icon={<StarIcon />} label={`${listing.rating} (${listing.reviews} reviews)`} className="chip-yellow" />
              <Chip label={listing.availability} className="chip-green" />
            </Box>
            <Typography variant="body1" sx={{ mb: 3, color: '#5A7D8C', height: showFullDescription ? 'auto' : '4.5em', overflow: 'hidden', position: 'relative' }}>
              {listing.description}
              {!showFullDescription && (
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, #fff)', height: '2em' }} />
              )}
            </Typography>
            <Button onClick={() => setShowFullDescription(!showFullDescription)} sx={{ color: '#008080', textTransform: 'none', p: 0 }}>
              {showFullDescription ? 'Show less' : 'Read more'}
            </Button>
          </Box>

          {/* Owner Card */}
          <Box className="owner-card" sx={{ mb: 3 }}>
            <Avatar src={listing.owner.avatar} alt={listing.owner.name} className="owner-avatar" />
            <Box sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Typography variant="subtitle1" fontWeight={600}>{listing.owner.name}</Typography>
                {listing.owner.verifiedID && (<span className="trust-badge">Verified ID</span>)}
              </Box>
              <Typography variant="body2" color="text.secondary">Member since {listing.owner.memberSince}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Rating value={listing.owner.rating} precision={0.1} size="small" readOnly />
                <Typography variant="body2" color="text.secondary">{listing.owner.responseTime}</Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* Booking Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 24, borderRadius: '16px', background: 'rgba(255,255,255,0.2)', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            <CardContent>
              <Typography variant="h5" sx={{ mb: 2, color: '#0C1F26' }}>
                €{listing.price_per_day} <span style={{ fontSize: '1rem', color: '#5A7D8C' }}>/day</span>
              </Typography>
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  type="date"
                  label="Check-in"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  type="date"
                  label="Check-out"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </Box>
              <Button fullWidth variant="contained" size="large" onClick={handleBookNow} sx={{ mt: 2, backgroundColor: '#008080', '&:hover': { backgroundColor: '#006666', transform: 'scale(1.02)', boxShadow: 6 }, transition: 'all 0.3s ease' }}>
                Book Now
              </Button>
              <Button fullWidth variant="outlined" size="large" startIcon={<ChatIcon />} onClick={handleSendMessage} sx={{ mt: 2, borderColor: '#008080', color: '#008080', '&:hover': { borderColor: '#006666', color: '#006666', backgroundColor: 'rgba(0, 128, 128, 0.05)', transform: 'scale(1.02)', boxShadow: 6 }, transition: 'all 0.3s ease' }}>
                Message Owner
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box className="quick-actions">
        <IconButton
          sx={{
            color: '#008080',
            bgcolor: 'white',
            '&:hover': { bgcolor: 'rgba(0,128,128,0.1)' }
          }}
        >
          <ShareIcon />
        </IconButton>
        <IconButton
          sx={{
            color: '#008080',
            bgcolor: 'white',
            '&:hover': { bgcolor: 'rgba(0,128,128,0.1)' }
          }}
        >
          <FavoriteIcon />
        </IconButton>
        <Button
          variant="contained"
          className="btn btn-primary"
          startIcon={<ChatIcon />}
          sx={{ flexGrow: 1 }}
          onClick={() => handleSendMessage()}
        >
          Chat with Owner
        </Button>
      </Box>
    </Container>
  );
};

export default ListingDetails;
