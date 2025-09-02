import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Image, Dimensions } from 'react-native';
import { Text, Button, Card, Chip, Divider, ActivityIndicator } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SpinnerLoader } from '../components/SpinnerLoader';

import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../services/api/client';

const { width } = Dimensions.get('window');

interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: string;
  location: {
    address: string;
    city: string;
    state: string;
  };
  owner: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    totalReviews: number;
  };
  available: boolean;
  features: string[];
  rules: string[];
  deposit: number;
}

type RootStackParamList = {
  ListingDetail: { listingId: string };
  Booking: { listingId: string };
  Profile: { userId: string };
};

type ListingDetailScreenRouteProp = RouteProp<RootStackParamList, 'ListingDetail'>;
type ListingDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ListingDetail'>;

interface Props {
  route: ListingDetailScreenRouteProp;
  navigation: ListingDetailScreenNavigationProp;
}

export default function ListingDetailScreen({ route, navigation }: Props) {
  const { listingId } = route.params;
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [listingId]);

  const fetchListing = async () => {
    try {
      const response = await apiClient.get(`/listings/${listingId}`);
      setListing(response.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigation.navigate('Auth' as any);
      return;
    }
    navigation.navigate('Booking', { listingId });
  };

  const handleContactOwner = () => {
    if (listing?.owner.id && listing?.id) {
      (navigation as any).navigate('Chat', {
        recipientId: listing.owner.id,
        listingId: listing.id
      });
    }
  };

  const handleViewOwnerProfile = () => {
    if (listing?.owner.id) {
      navigation.navigate('Profile', { userId: listing.owner.id });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <SpinnerLoader size={60} />
        <Text style={styles.loadingText}>Loading listing details...</Text>
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Listing not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Image Gallery */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: listing.images[currentImageIndex] }}
          style={styles.mainImage}
          resizeMode="cover"
        />
        <View style={styles.imageDots}>
          {listing.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentImageIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.price}>${listing.price}/day</Text>
        </View>

        <Chip style={styles.categoryChip}>{listing.category}</Chip>

        {/* Owner Info */}
        <Card style={styles.ownerCard} onPress={handleViewOwnerProfile}>
          <Card.Content style={styles.ownerContent}>
            <Image
              source={{ uri: listing.owner.avatar || 'https://via.placeholder.com/50' }}
              style={styles.ownerAvatar}
            />
            <View style={styles.ownerInfo}>
              <Text style={styles.ownerName}>{listing.owner.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.ratingText}>
                  {listing.owner.rating} ({listing.owner.totalReviews} reviews)
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        {/* Description */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{listing.description}</Text>
          </Card.Content>
        </Card>

        {/* Features */}
        {listing.features.length > 0 && (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Features</Text>
              <View style={styles.featuresContainer}>
                {listing.features.map((feature, index) => (
                  <Chip key={index} style={styles.featureChip}>
                    {feature}
                  </Chip>
                ))}
              </View>
            </Card.Content>
          </Card>
        )}

        {/* Rules */}
        {listing.rules.length > 0 && (
          <Card style={styles.sectionCard}>
            <Card.Content>
              <Text style={styles.sectionTitle}>Rules</Text>
              {listing.rules.map((rule, index) => (
                <View key={index} style={styles.ruleItem}>
                  <Ionicons name="alert-circle-outline" size={16} color="#666" />
                  <Text style={styles.ruleText}>{rule}</Text>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Location */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.locationText}>
              {listing.location.address}, {listing.location.city}, {listing.location.state}
            </Text>
          </Card.Content>
        </Card>

        {/* Deposit Info */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Security Deposit</Text>
            <Text style={styles.depositText}>${listing.deposit}</Text>
            <Text style={styles.depositNote}>
              Fully refundable if item is returned in the same condition
            </Text>
          </Card.Content>
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            onPress={handleBookNow}
            style={styles.bookButton}
            disabled={!listing.available}
          >
            {listing.available ? 'Book Now' : 'Not Available'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleContactOwner}
            style={styles.contactButton}
          >
            Contact Owner
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: width,
    height: width * 0.75,
  },
  imageDots: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#fff',
  },
  inactiveDot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  categoryChip: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  ownerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  ownerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    color: '#666',
    fontSize: 14,
  },
  sectionCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  featureChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ruleText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  locationText: {
    fontSize: 16,
    color: '#333',
  },
  depositText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  depositNote: {
    fontSize: 14,
    color: '#666',
  },
  actionContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  bookButton: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  contactButton: {
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
});