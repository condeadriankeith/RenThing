import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  AddPhotoAlternate as AddPhotoIcon,
  Delete as DeleteIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useListings } from '../context/ListingContext';
import { motion } from 'framer-motion';

const Add = () => {
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your form submission logic here
    // Example: send data to backend, show success message, etc.
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };
  const [success, setSuccess] = useState(false);
  const { addListing } = useListings();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price_per_day: '',
    location: '',
    availability: []
  });
  // ...existing code...

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
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
            Add New Listing
          </Typography>
          
          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3, 
                borderRadius: '12px',
                '& .MuiAlert-icon': {
                  color: '#2E7D32'
                },
                '& .MuiAlert-message': {
                  color: '#2E7D32',
                  fontWeight: 500
                }
              }}
            >
              Listing added successfully!
            </Alert>
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
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2, color: '#222', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}
                      InputLabelProps={{ style: { color: '#008080', fontWeight: 600 } }}
                      InputProps={{ style: { color: '#222' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{ mb: 2, color: '#222', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}
                      InputLabelProps={{ style: { color: '#008080', fontWeight: 600 } }}
                      InputProps={{ style: { color: '#222' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth sx={{ mb: 2, background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}>
                      <InputLabel>Category</InputLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        label="Category"
                        onChange={handleInputChange}
                        required
                      >
                        <MenuItem value="Electronics">Electronics</MenuItem>
                        <MenuItem value="Sports">Sports</MenuItem>
                        <MenuItem value="Tools">Tools</MenuItem>
                        <MenuItem value="Fashion">Fashion</MenuItem>
                        <MenuItem value="Home">Home</MenuItem>
                        <MenuItem value="Other">Other</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Price per day (€)"
                      name="price_per_day"
                      value={formData.price_per_day}
                      onChange={handleInputChange}
                      required
                      type="number"
                      variant="outlined"
                      sx={{ mb: 2, color: '#222', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}
                      InputLabelProps={{ style: { color: '#008080', fontWeight: 600 } }}
                      InputProps={{ style: { color: '#222' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                      sx={{ mb: 2, color: '#222', background: 'rgba(255,255,255,0.7)', borderRadius: '8px' }}
                      InputLabelProps={{ style: { color: '#008080', fontWeight: 600 } }}
                      InputProps={{ style: { color: '#222' } }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="h6" sx={{ mb: 2, color: '#008080', textShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                      Images
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      sx={{
                        height: '100px',
                        border: '2px dashed #008080',
                        color: '#008080',
                        background: 'rgba(255,255,255,0.6)',
                        borderRadius: '16px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 8px rgba(0,128,128,0.08)',
                        '&:hover': {
                          border: '2px dashed #006666',
                          backgroundColor: 'rgba(0, 128, 128, 0.08)',
                          transform: 'scale(1.02)',
                          boxShadow: '0 4px 16px rgba(0, 128, 128, 0.12)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {isLoadingImage ? (
                          <CircularProgress size={40} sx={{ color: '#008080' }} />
                        ) : (
                          <>
                            <AddPhotoIcon sx={{ fontSize: 40 }} />
                            <Typography variant="body1" sx={{ color: '#008080', fontWeight: 600 }}>Upload Images</Typography>
                            <Typography variant="caption" sx={{ mt: 1, color: '#222', opacity: 0.7 }}>
                              Or we'll find a relevant image for you
                            </Typography>
                          </>
                        )}
                      </Box>
                      <input type="file" hidden multiple onChange={handleImageUpload} accept="image/*" />
                    </Button>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                      {previewUrls.map((url, index) => (
                        <Box key={index} sx={{
                          position: 'relative',
                          boxShadow: '0 4px 16px rgba(0,128,128,0.18)',
                          borderRadius: '16px',
                          background: 'rgba(255,255,255,0.32)',
                          backdropFilter: 'blur(16px)',
                          WebkitBackdropFilter: 'blur(16px)',
                          border: '1.5px solid rgba(255,255,255,0.25)',
                          overflow: 'hidden',
                        }}>
                          <img 
                            src={url} 
                            alt={`Preview ${index}`} 
                            style={{ 
                              width: '100px', 
                              height: '100px', 
                              objectFit: 'cover', 
                              borderRadius: '16px',
                              boxShadow: '0 2px 8px rgba(0,128,128,0.10)',
                              border: '1.5px solid rgba(255,255,255,0.18)',
                            }} 
                          />
                          <IconButton 
                            size="small" 
                            sx={{ 
                              position: 'absolute', 
                              top: -8, 
                              right: -8, 
                              backgroundColor: 'rgba(255,255,255,0.85)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                              '&:hover': {
                                backgroundColor: '#FFEBEE'
                              }
                            }}
                            onClick={() => removeImage(index)}
                          >
                            <DeleteIcon fontSize="small" sx={{ color: '#C62828' }} />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button 
                      type="submit"
                      variant="contained" 
                      fullWidth
                      sx={{ 
                        mt: 2,
                        background: 'linear-gradient(90deg, #008080 60%, #00b4b4 100%)',
                        color: '#fff',
                        borderRadius: '9999px',
                        fontWeight: 700,
                        py: 1.5,
                        fontSize: '1rem',
                        boxShadow: '0 4px 16px rgba(0,128,128,0.12)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(90deg, #006666 60%, #009999 100%)',
                          transform: 'scale(1.03)',
                          boxShadow: '0 8px 32px rgba(0,128,128,0.18)',
                        }
                      }}
                    >
                      Add Listing
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Add;
