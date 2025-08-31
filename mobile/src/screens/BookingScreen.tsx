import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { Text, Button, Card, TextInput, ActivityIndicator, Divider } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

let DateTimePicker: any;
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

import { useAuth } from '../hooks/useAuth';
import { apiClient } from '../services/api/client';

interface Listing {
  id: string;
  title: string;
  price: number;
  deposit: number;
  images: string[];
  owner: {
    id: string;
    name: string;
  };
}

interface BookingRequest {
  listingId: string;
  startDate: Date;
  endDate: Date;
  message: string;
}

type RootStackParamList = {
  Booking: { listingId: string };
  Payment: { bookingId: string; amount: number };
};

type BookingScreenRouteProp = RouteProp<RootStackParamList, 'Booking'>;
type BookingScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Booking'>;

interface Props {
  route: BookingScreenRouteProp;
  navigation: BookingScreenNavigationProp;
}

export default function BookingScreen({ route, navigation }: Props) {
  const { listingId } = route.params;
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  const calculateTotal = () => {
    if (!listing) return { days: 0, rentalCost: 0, deposit: 0, total: 0 };

    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const rentalCost = days * listing.price;
    const total = rentalCost + listing.deposit;

    return {
      days,
      rentalCost,
      deposit: listing.deposit,
      total
    };
  };

  const handleBooking = async () => {
    if (!message.trim()) {
      Alert.alert('Validation Error', 'Please add a message for the owner');
      return;
    }

    if (endDate <= startDate) {
      Alert.alert('Validation Error', 'End date must be after start date');
      return;
    }

    setSubmitting(true);
    
    try {
      const bookingData: BookingRequest = {
        listingId,
        startDate,
        endDate,
        message: message.trim()
      };

      const response = await apiClient.post('/bookings', bookingData);
      const booking = response.data;
      
      Alert.alert(
        'Booking Request Sent',
        'The owner will review your request and get back to you soon.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Payment', { 
              bookingId: booking.id, 
              amount: calculateTotal().total 
            })
          }
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Booking Failed', 
        error.response?.data?.message || 'Failed to create booking'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onDateChange = (type: 'start' | 'end', selectedDate?: Date) => {
    if (type === 'start') {
      setShowStartDatePicker(false);
      if (selectedDate) setStartDate(selectedDate);
    } else {
      setShowEndDatePicker(false);
      if (selectedDate) setEndDate(selectedDate);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" />
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

  const totals = calculateTotal();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Listing Preview */}
        <Card style={styles.listingCard}>
          <Card.Content>
            <Text style={styles.listingTitle}>{listing.title}</Text>
            <Text style={styles.priceText}>${listing.price}/day</Text>
          </Card.Content>
        </Card>

        {/* Date Selection */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Rental Period</Text>
            
            <View style={styles.dateRow}>
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <Button 
                  mode="outlined" 
                  onPress={() => setShowStartDatePicker(true)}
                  style={styles.dateButton}
                >
                  {startDate.toLocaleDateString()}
                </Button>
              </View>
              
              <View style={styles.dateSection}>
                <Text style={styles.dateLabel}>End Date</Text>
                <Button 
                  mode="outlined" 
                  onPress={() => setShowEndDatePicker(true)}
                  style={styles.dateButton}
                >
                  {endDate.toLocaleDateString()}
                </Button>
              </View>
            </View>

            {showStartDatePicker && Platform.OS !== 'web' && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(_: any, selectedDate?: Date) => onDateChange('start', selectedDate)}
              />
            )}
            {showStartDatePicker && Platform.OS === 'web' && (
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(event) => onDateChange('start', new Date(event.target.value))}
                style={styles.webDatePicker}
              />
            )}

            {showEndDatePicker && Platform.OS !== 'web' && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(_: any, selectedDate?: Date) => onDateChange('end', selectedDate)}
              />
            )}
            {showEndDatePicker && Platform.OS === 'web' && (
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(event) => onDateChange('end', new Date(event.target.value))}
                style={styles.webDatePicker}
              />
            )}
          </Card.Content>
        </Card>

        {/* Cost Summary */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Cost Summary</Text>
            
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Rental ({totals.days} days)</Text>
              <Text style={styles.costValue}>${totals.rentalCost}</Text>
            </View>
            
            <View style={styles.costRow}>
              <Text style={styles.costLabel}>Security Deposit</Text>
              <Text style={styles.costValue}>${totals.deposit}</Text>
            </View>
            
            <Divider style={styles.divider} />
            
            <View style={styles.costRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>${totals.total}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Message */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Message to Owner</Text>
            <TextInput
              label="Add a message (required)"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              style={styles.messageInput}
              placeholder="Tell the owner why you need to rent this item..."
            />
          </Card.Content>
        </Card>

        {/* Booking Button */}
        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            onPress={handleBooking}
            loading={submitting}
            disabled={submitting}
            style={styles.bookButton}
          >
            Request Booking
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
  contentContainer: {
    padding: 16,
  },
  listingCard: {
    marginBottom: 16,
    elevation: 2,
  },
  listingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 18,
    color: '#1976d2',
    fontWeight: '600',
    marginTop: 4,
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
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateSection: {
    flex: 1,
    marginHorizontal: 4,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateButton: {
    marginVertical: 4,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  costLabel: {
    fontSize: 16,
  },
  costValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  messageInput: {
    marginTop: 8,
  },
  actionContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  bookButton: {
    paddingVertical: 8,
  },
  webDatePicker: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    width: '100%',
    marginTop: 10,
  },
});