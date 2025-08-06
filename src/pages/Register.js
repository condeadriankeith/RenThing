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

const Register = () => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
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
    setSuccess(false);
    
    try {
      // Validate form data
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      
      // In a real app, you would register with a backend
      // For now, we'll simulate registration
      if (formData.name && formData.email && formData.password) {
        register({
          id: Date.now(),
          name: formData.name,
          email: formData.email
        });
        setSuccess(true);
      } else {
        setError('Please fill in all fields');
      }
    } catch (err) {
      setError('Failed to register. Please try again.');
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
              Create Account
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
                Registration successful! You can now log in.
              </Alert>
            )}
            
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ mb: 3 }}
              />
              
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
              
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
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
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
            
            <Box sx={{ textAlign: 'center' }}>
              <Link 
                href="/login" 
                sx={{ 
                  color: '#008080', 
                  fontWeight: 600,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                Already have an account? Sign In
              </Link>
            </Box>
          </CardContent>
        </Card>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Register;
