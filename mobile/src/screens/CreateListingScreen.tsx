import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { Text, Button, Card, TextInput, Chip, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import { apiClient } from '../services/api/client';
import { useAuth } from '../hooks/useAuth';

interface NewListing {
  title: string;
  description: string;
  price: number;
  deposit: number;
  category: string;
  condition: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  features: string[];
  rules: string[];
  images: string[];
}

export default function CreateListingScreen({ navigation }: any) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const [listing, setListing] = useState<NewListing>({
    title: '',
    description: '',
    price: 0,
    deposit: 0,
    category: '',
    condition: '',
    location: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    features: [],
    rules: [],
    images: [],
  });

  const [newFeature, setNewFeature] = useState('');
  const [newRule, setNewRule] = useState('');

  const categories = ['Electronics', 'Tools', 'Sports', 'Home', 'Clothing', 'Books', 'Vehicles', 'Venues', 'Hobbies & Leisure'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Used'];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setUploadingImages(true);
      try {
        const newImages = [...listing.images];
        
        for (const asset of result.assets) {
          const formData = new FormData();
          formData.append('image', {
            uri: asset.uri,
            type: 'image/jpeg',
            name: 'listing-image.jpg',
          } as any);

          const uploadResponse = await apiClient.post('/upload/image', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          
          newImages.push(uploadResponse.data.url);
        }
        
        setListing(prev => ({ ...prev, images: newImages }));
      } catch (error) {
        Alert.alert('Upload Error', 'Failed to upload images');
      } finally {
        setUploadingImages(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setListing(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setListing(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setListing(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const addRule = () => {
    if (newRule.trim()) {
      setListing(prev => ({
        ...prev,
        rules: [...prev.rules, newRule.trim()]
      }));
      setNewRule('');
    }
  };

  const removeRule = (index: number) => {
    setListing(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!listing.title.trim() || !listing.description.trim() || !listing.category || 
        !listing.condition || listing.price <= 0 || listing.images.length === 0) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    if (!listing.location.address || !listing.location.city || 
        !listing.location.state || !listing.location.zipCode) {
      Alert.alert('Validation Error', 'Please provide complete location information');
      return;
    }

    setLoading(true);
    
    try {
      await apiClient.post('/listings', listing);
      Alert.alert(
        'Success',
        'Your listing has been created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error: any) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to create listing'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Images Section */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Photos *</Text>
            <Button
              mode="outlined"
              onPress={pickImage}
              loading={uploadingImages}
              style={styles.uploadButton}
              icon="camera"
            >
              Add Photos ({listing.images.length}/5)
            </Button>
            
            <View style={styles.imagesContainer}>
              {listing.images.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.image} />
                  <Button
                    mode="text"
                    onPress={() => removeImage(index)}
                    style={styles.removeImageButton}
                    icon="close"
                  >
                    {' '}
                  </Button>
                </View>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Basic Info */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            
            <TextInput
              label="Title *"
              value={listing.title}
              onChangeText={(text: string) => setListing(prev => ({ ...prev, title: text }))}
              style={styles.input}
            />
            
            <TextInput
              label="Description *"
              value={listing.description}
              onChangeText={(text: string) => setListing(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
            
            <TextInput
              label="Price per day *"
              value={listing.price.toString()}
              onChangeText={(text: string) => setListing(prev => ({ ...prev, price: Number(text) || 0 }))}
              keyboardType="numeric"
              style={styles.input}
            />
            
            <TextInput
              label="Security deposit *"
              value={listing.deposit.toString()}
              onChangeText={(text: string) => setListing(prev => ({ ...prev, deposit: Number(text) || 0 }))}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Category & Condition */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Category & Condition</Text>
            
            <View style={styles.chipContainer}>
              <Text style={styles.label}>Category *</Text>
              {categories.map(cat => (
                <Chip
                  key={cat}
                  selected={listing.category === cat}
                  onPress={() => setListing(prev => ({ ...prev, category: cat }))}
                  style={styles.chip}
                >
                  {cat}
                </Chip>
              ))}
            </View>
            
            <View style={styles.chipContainer}>
              <Text style={styles.label}>Condition *</Text>
              {conditions.map(cond => (
                <Chip
                  key={cond}
                  selected={listing.condition === cond}
                  onPress={() => setListing(prev => ({ ...prev, condition: cond }))}
                  style={styles.chip}
                >
                  {cond}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Location */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Location</Text>
            
            <TextInput
              label="Address *"
              value={listing.location.address}
              onChangeText={(text: string) => setListing(prev => ({ 
                ...prev, 
                location: { ...prev.location, address: text } 
              }))}
              style={styles.input}
            />
            
            <TextInput
              label="City *"
              value={listing.location.city}
              onChangeText={(text: string) => setListing(prev => ({ 
                ...prev, 
                location: { ...prev.location, city: text } 
              }))}
              style={styles.input}
            />
            
            <TextInput
              label="State *"
              value={listing.location.state}
              onChangeText={(text: string) => setListing(prev => ({ 
                ...prev, 
                location: { ...prev.location, state: text } 
              }))}
              style={styles.input}
            />
            
            <TextInput
              label="ZIP Code *"
              value={listing.location.zipCode}
              onChangeText={(text: string) => setListing(prev => ({ 
                ...prev, 
                location: { ...prev.location, zipCode: text } 
              }))}
              keyboardType="numeric"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {/* Features */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Features</Text>
            
            <View style={styles.addItemRow}>
              <TextInput
                label="Add feature"
                value={newFeature}
                onChangeText={setNewFeature}
                style={[styles.input, styles.flexInput]}
              />
              <Button
                mode="contained"
                onPress={addFeature}
                style={styles.addButton}
              >
                Add
              </Button>
            </View>
            
            <View style={styles.chipContainer}>
              {listing.features.map((feature, index) => (
                <Chip
                  key={index}
                  onClose={() => removeFeature(index)}
                  style={styles.chip}
                >
                  {feature}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Rules */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Rules</Text>
            
            <View style={styles.addItemRow}>
              <TextInput
                label="Add rule"
                value={newRule}
                onChangeText={setNewRule}
                style={[styles.input, styles.flexInput]}
              />
              <Button
                mode="contained"
                onPress={addRule}
                style={styles.addButton}
              >
                Add
              </Button>
            </View>
            
            <View style={styles.chipContainer}>
              {listing.rules.map((rule, index) => (
                <Chip
                  key={index}
                  onClose={() => removeRule(index)}
                  style={styles.chip}
                >
                  {rule}
                </Chip>
              ))}
            </View>
          </Card.Content>
        </Card>

        {/* Submit Button */}
        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading}
            style={styles.submitButton}
          >
            Create Listing
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  sectionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    marginBottom: 12,
  },
  uploadButton: {
    marginBottom: 16,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 20,
    height: 20,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  addItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flexInput: {
    flex: 1,
    marginRight: 8,
    marginBottom: 0,
  },
  addButton: {
    height: 40,
  },
  actionContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  submitButton: {
    paddingVertical: 8,
  },
});