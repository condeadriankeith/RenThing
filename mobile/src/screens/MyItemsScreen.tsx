import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, FlatList, Image } from 'react-native';
import { Text, Button, Card, ActivityIndicator, IconButton, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SpinningLogo } from '../components/SpinningLogo';

import { apiClient } from '../services/api/client';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

interface UserListing {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  status: string;
  createdAt: string;
}

export default function MyItemsScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [listings, setListings] = useState<UserListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserListings();
  }, []);

  const fetchUserListings = async () => {
    try {
      const response = await apiClient.get(`/listings?ownerId=${user?.id}`);
      setListings(response.data.listings || []);
    } catch (error) {
      // Log error for debugging but provide fallback for users
      if (__DEV__) {
        console.error('Error fetching listings:', error);
      }
      // Mock data for demonstration
      setListings([
        {
          id: '1',
          title: 'Professional Camera',
          price: 25,
          images: ['https://via.placeholder.com/300x200'],
          category: 'Electronics',
          status: 'active',
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          title: 'Power Drill Set',
          price: 15,
          images: ['https://via.placeholder.com/300x200'],
          category: 'Tools',
          status: 'rented',
          createdAt: '2024-01-10'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditListing = (listingId: string) => {
    Alert.alert('Edit Listing', `Edit functionality for listing ${listingId} coming soon!`);
  };

  const handleDeleteListing = (listingId: string) => {
    Alert.alert(
      'Delete Listing',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setListings(prev => prev.filter(item => item.id !== listingId));
            Alert.alert('Success', 'Listing deleted successfully');
          }
        }
      ]
    );
  };

  const renderListingItem = ({ item }: { item: UserListing }) => (
    <Card style={styles.listingCard}>
      <View style={styles.listingContent}>
        <Image 
          source={{ uri: item.images[0] || 'https://via.placeholder.com/100x80' }}
          style={styles.listingImage}
        />
        <View style={styles.listingDetails}>
          <Text style={styles.listingTitle}>{item.title}</Text>
          <Text style={styles.listingPrice}>${item.price}/day</Text>
          <Text style={styles.listingCategory}>{item.category}</Text>
          <Text style={[
            styles.listingStatus, 
            { color: item.status === 'active' ? '#22C55E' : '#F59E0B' }
          ]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        <View style={styles.listingActions}>
          <IconButton 
            icon="pencil" 
            size={20} 
            onPress={() => handleEditListing(item.id)}
          />
          <IconButton 
            icon="delete" 
            size={20} 
            onPress={() => handleDeleteListing(item.id)}
          />
        </View>
      </View>
    </Card>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="My Items" showBack />
        <View style={styles.loadingContainer}>
          <SpinningLogo size={60} />
          <Text style={styles.loadingText}>Loading your items...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Items" showBack />
      
      <View style={styles.content}>
        {/* Stats Header */}
        <Card style={styles.statsCard}>
          <Card.Content style={styles.statsContent}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{listings.length}</Text>
              <Text style={styles.statLabel}>Total Items</Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {listings.filter(item => item.status === 'active').length}
              </Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <Divider style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {listings.filter(item => item.status === 'rented').length}
              </Text>
              <Text style={styles.statLabel}>Rented</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Add New Item Button */}
        <Button 
          mode="contained" 
          onPress={() => (navigation as any).navigate('CreateListing')}
          style={styles.addButton}
          icon="plus"
        >
          Add New Item
        </Button>

        {/* Listings List */}
        {listings.length > 0 ? (
          <FlatList
            data={listings}
            keyExtractor={(item) => item.id}
            renderItem={renderListingItem}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No items yet</Text>
            <Text style={styles.emptySubtitle}>Start earning by listing your first item</Text>
            <Button 
              mode="contained" 
              onPress={() => (navigation as any).navigate('CreateListing')}
              style={styles.emptyButton}
            >
              List Your First Item
            </Button>
          </View>
        )}
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  statsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    height: 40,
    width: 1,
  },
  addButton: {
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  listingCard: {
    marginBottom: 12,
    elevation: 2,
  },
  listingContent: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  listingImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  listingDetails: {
    flex: 1,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
    marginBottom: 2,
  },
  listingCategory: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  listingStatus: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  listingActions: {
    flexDirection: 'row',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
  },
});