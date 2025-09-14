import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, FlatList, Image } from 'react-native';
import { Text, Button, Card, Searchbar, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SpinnerLoader } from '../components/SpinnerLoader';

import { apiClient } from '../services/api/client';
import Header from '../components/Header';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 16px padding on each side + 16px between cards

interface Listing {
  id: string;
  title: string;
  price: number;
  images: string[];
  category: string;
  location: {
    city: string;
    state: string;
  };
}

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function HomeScreen() {
  const navigation = useNavigation();
  const [featuredItems, setFeaturedItems] = useState<Listing[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const mockCategories: Category[] = [
    { id: '1', name: 'Electronics', icon: '📱', color: '#E3F2FD' },
    { id: '2', name: 'Tools', icon: '🔧', color: '#FFF3E0' },
    { id: '3', name: 'Sports', icon: '⚽', color: '#E8F5E8' },
    { id: '4', name: 'Home', icon: '🏠', color: '#F3E5F5' },
    { id: '5', name: 'Clothing', icon: '👕', color: '#FFEBEE' },
    { id: '6', name: 'Books', icon: '📚', color: '#E1F5FE' },
    { id: '7', name: 'Venues', icon: '🎪', color: '#E0F7FA' },
    { id: '8', name: 'Hobbies & Leisure', icon: '🎨', color: '#F3E5F5' },
  ];

  useEffect(() => {
    fetchFeaturedItems();
    setCategories(mockCategories);
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const response = await apiClient.get('/listings?limit=6&featured=true');
      setFeaturedItems(response.data);
    } catch (error) {
      // Log error for debugging but provide fallback for users
      if (__DEV__) {
        console.error('Error fetching featured items:', error);
      }
      
      // Show user-friendly error message
      // In production, you might want to show a toast or banner
      // For now, gracefully fallback to mock data to keep the app functional
      setFeaturedItems([
        { id: '1', title: 'Professional Camera', price: 25, images: ['https://via.placeholder.com/300x200'], category: 'Electronics', location: { city: 'San Francisco', state: 'CA' } },
        { id: '2', title: 'Power Drill Set', price: 15, images: ['https://via.placeholder.com/300x200'], category: 'Tools', location: { city: 'New York', state: 'NY' } },
        { id: '3', title: 'Camping Tent', price: 20, images: ['https://via.placeholder.com/300x200'], category: 'Sports', location: { city: 'Denver', state: 'CO' } },
        { id: '4', title: 'Coffee Maker', price: 12, images: ['https://via.placeholder.com/300x200'], category: 'Home', location: { city: 'Seattle', state: 'WA' } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderFeaturedItem = ({ item }: { item: Listing }) => (
    <Card
      style={styles.featuredCard}
      onPress={() => (navigation as any).navigate('ListingDetail', { listingId: item.id })}
    >
      <Card.Cover 
        source={{ uri: item.images[0] }} 
        style={styles.featuredImage}
        resizeMode="cover"
      />
      <Card.Content style={styles.featuredContent}>
        <Text style={styles.featuredTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.featuredLocation} numberOfLines={1}>
          {item.location.city}, {item.location.state}
        </Text>
        <Text style={styles.featuredPrice}>${item.price}/day</Text>
      </Card.Content>
    </Card>
  );

  const renderCategory = ({ item }: { item: Category }) => (
    <Card
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      onPress={() => (navigation as any).navigate('Browse', { category: item.name })}
    >
      <Card.Content style={styles.categoryContent}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <Text style={styles.categoryName}>{item.name}</Text>
      </Card.Content>
    </Card>
  );

  const handleSearch = () => {
    (navigation as any).navigate('Browse', { searchQuery });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header showLogo title="Welcome to RenThing" />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <Text style={styles.heroTitle}>Find what you need</Text>
        <Text style={styles.heroSubtitle}>Rent items from your community</Text>
        
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search cameras, tools, tents..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            onIconPress={handleSearch}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('Browse' as never)}
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
        >
          Browse Items
        </Button>
        <Button 
          mode="outlined" 
          onPress={() => navigation.navigate('CreateListing' as never)}
          style={styles.actionButton}
          contentStyle={styles.actionButtonContent}
        >
          List Your Item
        </Button>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Browse by Category</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />
      </View>

      {/* Featured Items */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Items</Text>
          <Button 
            mode="text" 
            onPress={() => navigation.navigate('Browse' as never)}
            style={styles.seeAllButton}
          >
            See All
          </Button>
        </View>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <SpinnerLoader size={60} />
            <Text style={styles.loadingText}>Loading featured items...</Text>
          </View>
        ) : (
          <FlatList
            data={featuredItems}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          />
        )}
      </View>

      {/* How It Works */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.stepsContainer}>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepTitle}>Browse</Text>
            <Text style={styles.stepDescription}>Find items you need from your community</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepTitle}>Request</Text>
            <Text style={styles.stepDescription}>Send a booking request to the owner</Text>
          </View>
          <View style={styles.step}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepTitle}>Enjoy</Text>
            <Text style={styles.stepDescription}>Pick up your item and enjoy your rental</Text>
          </View>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  heroSection: {
    backgroundColor: '#2563eb',
    padding: 24,
    paddingTop: 48,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 24,
  },
  searchContainer: {
    marginTop: 8,
  },
  searchBar: {
    elevation: 0,
    borderRadius: 25,
  },
  quickActions: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonContent: {
    height: 48,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAllButton: {
    margin: 0,
  },
  categoriesContainer: {
    paddingRight: 16,
  },
  categoryCard: {
    width: 100,
    height: 100,
    marginRight: 12,
    borderRadius: 16,
    elevation: 2,
  },
  categoryContent: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  loadingContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredContainer: {
    paddingRight: 16,
  },
  featuredCard: {
    width: CARD_WIDTH,
    marginRight: 12,
    borderRadius: 12,
    elevation: 2,
  },
  featuredImage: {
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  featuredContent: {
    padding: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featuredLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  stepsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 2,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    color: 'white',
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: 'bold',
    marginRight: 16,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});