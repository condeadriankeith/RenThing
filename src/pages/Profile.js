import React, { useState } from 'react';
import {
  TextField,
  Container,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemAvatar,
  Switch,
  styled
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  CreditCard as PaymentIcon,
  HeadsetMic as SupportIcon,
  Info as InfoIcon,
  Help as HelpIcon,
  Gavel as LegalIcon,
  Security as SecurityIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const MenuButton = styled(Button)({
  justifyContent: 'flex-start',
  textTransform: 'none',
  width: '100%',
  padding: '12px 16px',
  borderRadius: '8px',
  color: '#0C1F26',
  '&:hover': {
    backgroundColor: 'rgba(0, 128, 128, 0.05)',
    transform: 'scale(1.02)',
    boxShadow: '0 4px 8px rgba(0, 128, 128, 0.1)',
  },
  transition: 'all 0.3s ease',
  '&.Mui-selected': {
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
    color: '#008080',
    fontWeight: 600,
  },
  '&.Mui-selected:hover': {
    backgroundColor: 'rgba(0, 128, 128, 0.1)',
  },
});

const Profile = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  // Handle null user object gracefully
  const safeUser = user || { name: '', email: '' };
  const [profileData, setProfileData] = useState({
    name: safeUser.name,
    email: safeUser.email,
    // Add other profile fields as needed
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleProfileSave = () => {
    // Implement save logic here, e.g., API call to update user profile
    console.log('Saving profile data:', profileData);
    // showAlert('Profile updated successfully!', 'success');
  };

  const menuItems = [
    { id: 'profile', label: 'Personal Information', icon: <PersonIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <NotificationsIcon /> },
    { id: 'payment', label: 'Payment Methods', icon: <PaymentIcon /> },
    { id: 'language', label: 'Language', icon: <LanguageIcon /> },
    { id: 'help', label: 'Help & Support', icon: <HelpIcon /> },
    { id: 'about', label: 'About', icon: <InfoIcon /> },
    { id: 'legal', label: 'Legal', icon: <LegalIcon /> },
    { id: 'security', label: 'Security', icon: <SecurityIcon /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, color: '#008080', fontWeight: 700 }}>
              Personal Information
            </Typography>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              margin="normal"
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '&:hover fieldset': { borderColor: '#008080' },
                  '&.Mui-focused fieldset': { borderColor: '#008080' },
                },
                '& .MuiInputLabel-root': { color: '#008080' },
              }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              margin="normal"
              variant="outlined"
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '& fieldset': { borderColor: '#e0e0e0' },
                  '&:hover fieldset': { borderColor: '#008080' },
                  '&.Mui-focused fieldset': { borderColor: '#008080' },
                },
                '& .MuiInputLabel-root': { color: '#008080' },
              }}
            />
            {/* Add more input fields for other profile information */}
            <Button 
              variant="contained" 
              onClick={handleProfileSave}
              sx={{
                mt: 2,
                bgcolor: '#008080',
                color: 'white',
                borderRadius: '9999px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: '#006666',
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 8px rgba(0, 128, 128, 0.1)'
                },
                transition: 'all 0.3s ease',
              }}
            >
              Save Changes
            </Button>
          </Box>
        );
      case 'notifications':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#008080' }}>
              Notifications
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body1">Push Notifications</Typography>
                <Typography variant="body2" color="text.secondary">
                  For all your bookings and messages
                </Typography>
              </Box>
              <Switch 
                checked={notifications} 
                onChange={(e) => setNotifications(e.target.checked)} 
              />
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography variant="body1">Email Notifications</Typography>
                <Typography variant="body2" color="text.secondary">
                  For important account notifications
                </Typography>
              </Box>
              <Switch 
                checked={emailNotifications} 
                onChange={(e) => setEmailNotifications(e.target.checked)} 
              />
            </Box>
          </Box>
        );
      case 'payment':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#008080' }}>
              Payment Methods
            </Typography>
            <Typography variant="body1">
              You haven't added any payment methods yet.
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ 
                mt: 2,
                color: '#008080',
                borderColor: '#008080',
                borderRadius: '9999px',
                fontWeight: 600,
                textTransform: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  borderColor: '#006666',
                  backgroundColor: 'rgba(0, 128, 128, 0.05)',
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 8px rgba(0, 128, 128, 0.1)'
                }
              }}
            >
              Add Payment Method
            </Button>
          </Box>
        );
      case 'language':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#008080' }}>
              Language
            </Typography>
            <Typography variant="body1">
              Current language: English
            </Typography>
          </Box>
        );
      case 'help':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#008080' }}>
              Help & Support
            </Typography>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <HelpOutlineIcon />
                </ListItemIcon>
                <ListItemText primary="Help Center" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <SupportIcon />
                </ListItemIcon>
                <ListItemText primary="Contact Support" />
              </ListItem>
            </List>
          </Box>
        );
      case 'about':
        return (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box>
                <Typography variant="h4">RenThing</Typography>
                <Typography variant="subtitle1">Version 1.0.0</Typography>
              </Box>
            </Box>
            <Typography variant="body1">
              RenThing is a peer-to-peer rental marketplace that connects people who want to rent out their items with people who are looking to borrow.
            </Typography>
          </Box>
        );
      case 'legal':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#008080' }}>
              Legal
            </Typography>
            <List>
              <ListItem button>
                <ListItemIcon>
                  <InfoIcon />
                </ListItemIcon>
                <ListItemText primary="Terms of Service" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <SecurityIcon />
                </ListItemIcon>
                <ListItemText primary="Privacy Policy" />
              </ListItem>
            </List>
          </Box>
        );
      case 'security':
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 2, color: '#008080' }}>
              Security
            </Typography>
            <Button 
              variant="outlined" 
              sx={{ 
                color: '#008080',
                borderColor: '#008080',
                borderRadius: '9999px',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#006666',
                  backgroundColor: 'rgba(0, 128, 128, 0.05)'
                }
              }}
            >
              Change Password
            </Button>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxWidth="md" sx={{
        mt: 4,
        mb: 4,
        // Removed the extra background shape
      }}>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Sidebar */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            style={{ flex: '0 0 280px' }}
          >
            <Box sx={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '16px',
              boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              p: 3,
              height: 'fit-content',
              minWidth: 240,
              maxWidth: 280,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#008080', mb: 1 }}>
                {safeUser.name ? safeUser.name[0].toUpperCase() : <PersonIcon sx={{ fontSize: 40 }} />}
              </Avatar>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#008080', textAlign: 'center' }}>
                {safeUser.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
                {safeUser.email}
              </Typography>
              <Chip label="Verified" color="success" size="small" sx={{ mt: 1, bgcolor: '#e8f5e9', color: '#2e7d32', fontWeight: 600 }} />
              <Divider sx={{ my: 2, width: '100%' }} />
              <List component="nav" sx={{ width: '100%' }}>
                {menuItems.map((item) => (
                  <ListItem key={item.id} disablePadding>
                    <MenuButton
                      onClick={() => setActiveTab(item.id)}
                      sx={{
                        '&.Mui-selected': {
                          backgroundColor: 'rgba(0, 128, 128, 0.1)',
                          color: '#008080',
                          fontWeight: 600,
                        },
                      }}
                      className={activeTab === item.id ? 'Mui-selected' : ''}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: activeTab === item.id ? '#008080' : 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.label} />
                    </MenuButton>
                  </ListItem>
                ))}
              </List>
              <Button 
                variant="outlined" 
                onClick={logout}
                sx={{ 
                  mt: 3,
                  width: '100%',
                  color: '#008080',
                  borderColor: '#008080',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  textTransform: 'none',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: '#006666',
                    backgroundColor: 'rgba(0, 128, 128, 0.05)',
                    transform: 'scale(1.02)',
                    boxShadow: '0 4px 8px rgba(0, 128, 128, 0.1)'
                  }
                }}
              >
                Logout
              </Button>
            </Box>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ flex: 1 }}
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
              p: 3,
              minHeight: 400,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
            }}>
              {renderContent()}
            </Card>
          </motion.div>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Profile;
