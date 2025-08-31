import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, StyleSheet, FlatList, Dimensions, RefreshControl } from 'react-native';
import { Text, Searchbar, Card, Chip, Button, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import { apiClient } from '../services/api/client';

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  location: {
    city: string;
    state: string;
  };
  owner: {
    name: string;
    rating: number;
  };
  rating: number;
  reviews: number;
  available: boolean;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 32) / 2 - 8;

export default function BrowseScreen({ navigation }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'newest'>('newest');

  const categories = ['all', 'Electronics', 'Tools', 'Sports', 'Home', 'Clothing', 'Books', 'Vehicles'];
  const priceRanges = [
    { label: 'All Prices', value: 'all' },
    { label: 'Under $25', value: '0-25' },
    { label: '$25-$50', value: '25-50' },
    { label: '$50-$100', value: '50-100' },
    { label: '$100+', value: '100+' },
  ];

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, selectedCategory, selectedPriceRange, sortBy, listings]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchListings();
    setRefreshing(false);
  }, []);

  const fetchListings = async () => {
    try {
      const response = await apiClient.get('/listings?limit=50');
      setListings(response.data);
      setFilteredListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      const mockListings: Listing[] = [
        {
          id: '1',
          title: 'Professional Camera',
          description: 'High-end DSLR camera perfect for photography',
          price: 25,
          images: ['https://via.placeholder.com/300x200'],
          category: 'Electronics',
          condition: 'Excellent',
          location: { city: 'San Francisco', state: 'CA' },
          owner: { name: 'John Doe', rating: 4.8 },
          rating: 4.8,
          reviews: 12,
          available: true,
        },
        {
          id: '2',
          title: 'Power Drill Set',
          description: 'Complete drill set with accessories',
          price: 15,
          images: ['https://via.placeholder.com/300x200'],
          category: 'Tools',
          condition: 'Good',
          location: { city: 'New York', state: 'NY' },
          owner: { name: 'Jane Smith', rating: 4.5 },
          rating: 4.5,
          reviews: 8,
          available: true,
        },
      ];
      setListings(mockListings);
      setFilteredListings(mockListings);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...listings];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(listing => listing.category === selectedCategory);
    }

    // Price filter
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(p => p === '+' ? Infinity : Number(p));
      filtered = filtered.filter(listing => {
        if (max === Infinity) return listing.price >= min;
        return listing.price >= min && listing.price <= max;
      });
    }

    // Sort
    switch (sortBy) {
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
    }

    setFilteredListings(filtered);
  };

  const renderListingItem = ({ item }: { item: Listing }) => (
    <Card
      style={[styles.listingCard, { width: CARD_WIDTH }]}
      onPress={() => navigation.navigate('ListingDetail', { listingId: item.id })}
    >
      <Card.Cover source={{ uri: item.images[0] }} style={[styles.listingImage, { borderTopLeftRadius: 12, borderTopRightRadius: 12 }]} />
      <Card.Content style={styles.listingContent}>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listingPrice}>${item.price}/day</Text>
        <Text style={styles.listingLocation} numberOfLines={1}>
          {item.location.city}, {item.location.state}
        </Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.ratingText}>{item.rating} ({item.reviews})</Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search cameras, tools, tents..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        onIconPress={() => setShowFilters(!showFilters)}
      />

      {showFilters && (
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Sort By</Text>
          <SegmentedButtons
            value={sortBy}
            onValueChange={(value) => setSortBy(value as any)}
            buttons={[
              { value: 'newest', label: 'Newest' },
              { value: 'price', label: 'Price' },
              { value: 'rating', label: 'Rating' },
            ]}
            style={styles.sortButtons}
          />
        </View>
      )}

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsContainer}>
        {categories.map(category => (
          <Chip
            key={category}
            selected={selectedCategory === category}
            onPress={() => setSelectedCategory(category)}
            style={styles.categoryChip}
            compact
          >
            {category === 'all' ? 'All' : category}
          </Chip>
        ))}
      </ScrollView>

      <Text style={styles.resultsText}>
        {filteredListings.length} {filteredListings.length === 1 ? 'item' : 'items'} found
      </Text>

      <FlatList
        data={filteredListings}
        renderItem={renderListingItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listingsContainer}
        columnWrapperStyle={styles.listingsRow}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBar: {
    margin: 16,
    marginBottom: 8,
  },
  filterToggle: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  filtersContainer: {
    maxHeight: 120,
    paddingHorizontal: 16,
  },
  filterSection: {
    marginBottom: 8,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 4,
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 4,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  listingsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listingsRow: {
    justifyContent: 'space-between',
  },
  listingCard: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  listingImage: {
    height: 120,
  },
  listingContent: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  sortButtons: {
    marginBottom: 16,
  },
  chipsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryChip: {
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});