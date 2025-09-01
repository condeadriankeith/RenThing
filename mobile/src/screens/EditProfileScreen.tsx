import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, TextInput, Switch, Divider, Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

export default function EditProfileScreen() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        location: formData.location,
        avatar: avatar,
      });
      
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImagePicker = async () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to select an image',
      [
        { text: 'Camera', onPress: () => openCamera() },
        { text: 'Gallery', onPress: () => openGallery() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Camera permission is required to take photos');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Gallery permission is required to select photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Edit Profile" showBack />
      
      <ScrollView style={styles.content}>
        {/* Profile Picture */}
        <View style={styles.avatarSection}>
          <Avatar.Image 
            size={120} 
            source={{ uri: avatar || 'https://via.placeholder.com/120' }}
            style={styles.avatar}
          />
          <Button 
            mode="outlined" 
            onPress={handleImagePicker}
            style={styles.avatarButton}
            icon="camera"
          >
            Change Photo
          </Button>
        </View>

        {/* Basic Information */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <TextInput
              label="Full Name"
              value={formData.name}
              onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="account" />}
            />
            
            <TextInput
              label="Email Address"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              left={<TextInput.Icon icon="email" />}
            />
            
            <TextInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              style={styles.input}
              mode="outlined"
              keyboardType="phone-pad"
              left={<TextInput.Icon icon="phone" />}
            />
          </Card.Content>
        </Card>

        {/* Additional Information */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            
            <TextInput
              label="Location"
              value={formData.location}
              onChangeText={(text) => setFormData(prev => ({ ...prev, location: text }))}
              style={styles.input}
              mode="outlined"
              left={<TextInput.Icon icon="map-marker" />}
              placeholder="City, State"
            />
            
            <TextInput
              label="Bio"
              value={formData.bio}
              onChangeText={(text) => setFormData(prev => ({ ...prev, bio: text }))}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={4}
              left={<TextInput.Icon icon="text" />}
              placeholder="Tell others about yourself..."
            />
          </Card.Content>
        </Card>

        {/* Verification Status */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Verification</Text>
            
            <View style={styles.verificationItem}>
              <Text style={styles.verificationText}>Email Verification</Text>
              <Text style={styles.verificationStatus}>✅ Verified</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.verificationItem}>
              <Text style={styles.verificationText}>Phone Verification</Text>
              <Text style={styles.verificationStatusPending}>⏳ Pending</Text>
            </View>
            
            <Button 
              mode="outlined" 
              onPress={() => Alert.alert('Phone Verification', 'Phone verification coming soon!')}
              style={styles.verifyButton}
            >
              Verify Phone Number
            </Button>
            
            <Divider style={styles.divider} />
            
            <View style={styles.verificationItem}>
              <Text style={styles.verificationText}>Identity Verification</Text>
              <Text style={styles.verificationStatusPending}>⏳ Pending</Text>
            </View>
            
            <Button 
              mode="outlined" 
              onPress={() => Alert.alert('ID Verification', 'Identity verification coming soon!')}
              style={styles.verifyButton}
            >
              Upload ID Document
            </Button>
          </Card.Content>
        </Card>

        {/* Privacy Settings */}
        <Card style={styles.section}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Privacy Settings</Text>
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Show email to other users</Text>
                <Text style={styles.settingDescription}>
                  Allow other users to see your email address
                </Text>
              </View>
              <Switch value={false} onValueChange={() => {}} />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Show phone to other users</Text>
                <Text style={styles.settingDescription}>
                  Allow other users to see your phone number
                </Text>
              </View>
              <Switch value={false} onValueChange={() => {}} />
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Show online status</Text>
                <Text style={styles.settingDescription}>
                  Let others know when you're online
                </Text>
              </View>
              <Switch value={true} onValueChange={() => {}} />
            </View>
          </Card.Content>
        </Card>

        {/* Save Button */}
        <Button 
          mode="contained" 
          onPress={handleUpdateProfile}
          style={styles.saveButton}
          loading={loading}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  avatarButton: {
    marginTop: 8,
  },
  section: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    marginBottom: 12,
  },
  verificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  verificationText: {
    fontSize: 16,
  },
  verificationStatus: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: 'bold',
  },
  verificationStatusPending: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: 'bold',
  },
  verifyButton: {
    marginTop: 8,
    marginBottom: 16,
  },
  divider: {
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
  saveButton: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 8,
  },
});