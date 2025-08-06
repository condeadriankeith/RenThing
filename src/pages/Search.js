import React, { useState, useEffect } from 'react';
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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Checkbox,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  AttachMoney as PriceIcon,
  Star as StarIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { useListings } from '../context/ListingContext';
import { motion } from 'framer-motion';
import axios from 'axios';

const Search = () => {
  const { listings } = useListings();
  const [searchTerm, setSearchTerm] = useState('');
  const PEXELS_API_KEY = 'S6YsEWf484ZrbOFrIVqU92AGsBlpMX8MomXebcBPmzUw9Wk8lhc1kKOV';
  
  const fetchPexelsImage = async (query) => {
    try {
      const response = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });
      const photo = response.data.photos[0];
      return photo ? photo.src.medium : null;
    } catch (error) {
      console.error('Error fetching image from Pexels:', error);
      return null;
    }
  };
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState({
    today: false,
    tomorrow: false,
    thisWeek: false
  });

  const handleAvailabilityChange = (event) => {
    setAvailability({
      ...availability,
      [event.target.name]: event.target.checked
    });
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category ? listing.category === category : true;
    const matchesPrice = listing.price_per_day >= priceRange[0] && listing.price_per_day <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="lg" sx={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
        <Box sx={{ mt: 4, mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#008080',
              mb: 3,
              textAlign: 'center'
            }}
          >
            Find What You Need
          </Typography>
          <Box sx={{ 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '16px', 
            p: 3, 
            mb: 4,
            boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.3)'
          }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="What are you looking for?"
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Location"
                  variant="outlined"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  InputProps={{
                    startAdornment: <LocationIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
                  }}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    label="Category"
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    <MenuItem value="Electronics">Electronics</MenuItem>
                    <MenuItem value="Sports">Sports</MenuItem>
                    <MenuItem value="Tools">Tools</MenuItem>
                    <MenuItem value="Fashion">Fashion</MenuItem>
                    <MenuItem value="Home">Home</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                
                <Typography variant="body2" sx={{ mb: 1 }}>Price Range: €{priceRange[0]} - €{priceRange[1]}</Typography>
                <Slider
                  value={priceRange}
                  onChange={(e, newValue) => setPriceRange(newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid item xs={12} md={3}>
                <Typography variant="h6" sx={{ mb: 2 }}>Availability</Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={availability.today} 
                        onChange={handleAvailabilityChange} 
                        name="today" 
                      />
                    }
                    label="Today"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={availability.tomorrow} 
                        onChange={handleAvailabilityChange} 
                        name="tomorrow" 
                      />
                    }
                    label="Tomorrow"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox 
                        checked={availability.thisWeek} 
                        onChange={handleAvailabilityChange} 
                        name="thisWeek" 
                      />
                    }
                    label="This Week"
                  />
                </FormGroup>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{ 
                    mt: 2,
                    backgroundColor: '#008080',
                    color: 'white',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#006666',
                      transform: 'scale(1.02)',
                      boxShadow: '0 4px 8px rgba(0, 128, 128, 0.1)'
                    }
                  }}
                  startIcon={<SearchIcon />}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#008080', mb: 2 }}>
              Search Results ({filteredListings.length})
            </Typography>
          </Box>
          
          <Grid container spacing={3} justifyContent="center">
            {filteredListings.length === 0 ? (
              <Grid item xs={12} sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  No items found matching your criteria
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    setCategory('');
                    setPriceRange([0, 100]);
                    setLocation('');
                  }}
                  sx={{
                    mt: 2,
                    borderColor: '#008080',
                    color: '#008080',
                    borderRadius: '9999px',
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            ) : (
              filteredListings.map((listing) => (
                <Grid item xs={12} sm={6} md={4} key={listing.id}>
                  <Card sx={{ borderRadius: '16px', background: 'rgba(255,255,255,0.2)', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={listing.image || 'https://images.pexels.com/photos/1797103/pexels-photo-1797103.jpeg?auto=compress&cs=tinysrgb&w=800'}
                      alt={listing.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: '#008080', mb: 1 }}>
                        {listing.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                        {listing.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <LocationIcon sx={{ fontSize: 16, color: '#008080', mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {listing.location || 'Location not specified'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <PriceIcon sx={{ fontSize: 16, color: '#008080', mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                          €{listing.price_per_day}/day
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#FFD700', mr: 0.5 }} />
                        <Typography variant="body2" color="text.secondary">
                          {listing.rating || '4.5'} ({listing.review_count || '12'} reviews)
                        </Typography>
                      </Box>
                      <Chip 
                        label={listing.category} 
                        size="small" 
                        sx={{ 
                          backgroundColor: '#008080', 
                          color: 'white',
                          fontWeight: 600,
                          alignSelf: 'flex-start'
                        }} 
                      />
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button 
                        size="large" 
                        variant="contained" 
                        fullWidth
                        sx={{ 
                          backgroundColor: '#008080',
                          color: 'white',
                          borderRadius: '9999px',
                          fontWeight: 600,
                          '&:hover': {
                            backgroundColor: '#006666',
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Search;
