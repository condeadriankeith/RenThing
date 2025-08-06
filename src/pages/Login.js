import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Link,
  Alert
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // In a real app, you would authenticate with a backend
      // For now, we'll simulate authentication
      if (formData.email && formData.password) {
        login({
          id: 1,
          name: 'John Doe',
          email: formData.email
        });
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="sm" sx={{ background: 'rgba(255,255,255,0.2)', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}>
        <Box sx={{ 
          mt: 8, 
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Card sx={{ 
          borderRadius: '16px', 
          background: 'rgba(255,255,255,0.2)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          width: '100%'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mb: 3 
            }}>
              <Box sx={{ 
                width: 60, 
                height: 60, 
                backgroundColor: '#008080', 
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: 'bold'
              }}>
                RT
              </Box>
            </Box>
            
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: '#008080',
                mb: 3,
                textAlign: 'center'
              }}
            >
              Welcome Back
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3, 
                  borderRadius: '12px',
                  '& .MuiAlert-icon': {
                    color: '#C62828'
                  },
                  '& .MuiAlert-message': {
                    color: '#C62828',
                    fontWeight: 500
                  }
                }}
              >
                {error}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ mb: 3 }}
              />
              
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ mb: 3 }}
              />
              
              <Button 
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  mb: 2,
                  backgroundColor: '#008080',
                  color: 'white',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  py: 1.5,
                  fontSize: '1rem',
                  '&:hover': {
                    backgroundColor: '#006666',
                  },
                  '&:disabled': {
                    backgroundColor: '#B2DFDB',
                  }
                }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                href="/register" 
                sx={{ 
                  color: '#008080', 
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </CardContent>
        </Card>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Login;
