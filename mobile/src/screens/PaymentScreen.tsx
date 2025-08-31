import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert, Platform } from 'react-native';
import { Text, Button, Card, TextInput, ActivityIndicator } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

let CardField: any;
let useStripe: any;

if (Platform.OS !== 'web') {
  ({
    CardField,
    useStripe
  } = require('@stripe/stripe-react-native'));
}

import { apiClient } from '../services/api/client';

type RootStackParamList = {
  Payment: { bookingId: string; amount: number };
  Success: { bookingId: string };
};

type PaymentScreenRouteProp = RouteProp<RootStackParamList, 'Payment'>;
type PaymentScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Payment'>;

interface Props {
  route: PaymentScreenRouteProp;
  navigation: PaymentScreenNavigationProp;
}

export default function PaymentScreen({ route, navigation }: Props) {
  const { bookingId, amount } = route.params;
  const { confirmPayment } = Platform.OS !== 'web' ? useStripe() : { confirmPayment: () => {} };
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handlePayment = async () => {
    if (Platform.OS !== 'web' && (!cardDetails?.complete || !email || !name)) {
      Alert.alert('Validation Error', 'Please fill in all payment details');
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const { data: { clientSecret } } = await apiClient.post('/payments/create-intent', {
        bookingId,
        amount,
      });

      // Confirm payment
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email,
            name,
          },
        },
      });

      if (error) {
        Alert.alert('Payment Failed', error.message || 'Payment could not be processed');
      } else if (paymentIntent) {
        // Update booking status
        await apiClient.patch(`/bookings/${bookingId}/confirm-payment`, {
          paymentIntentId: paymentIntent.id,
        });

        navigation.navigate('Success' as any, { bookingId });
      }
    } catch (error: any) {
      Alert.alert(
        'Payment Error',
        error.response?.data?.message || 'Failed to process payment'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Payment Summary */}
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Payment Summary</Text>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Total Amount</Text>
              <Text style={styles.amountValue}>${amount}</Text>
            </View>
          </Card.Content>
        </Card>

        {/* Payment Form */}
        <Card style={styles.paymentCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Payment Details</Text>
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            
            <TextInput
              label="Name on Card"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            
            {Platform.OS !== 'web' ? (
              <View style={styles.cardFieldContainer}>
                <CardField
                  postalCodeEnabled={true}
                  placeholder={{
                    number: '4242 4242 4242 4242',
                  }}
                  cardStyle={styles.cardField}
                  style={styles.cardFieldStyle}
                  onCardChange={(cardDetails: any) => setCardDetails(cardDetails)}
                />
              </View>
            ) : (
              <Text style={styles.webPaymentMessage}>Payment via Stripe is not available on web. Please use the mobile app.</Text>
            )}
          </Card.Content>
        </Card>

        {/* Payment Button */}
        <View style={styles.actionContainer}>
          <Button
            mode="contained"
            onPress={handlePayment}
            loading={loading}
            disabled={loading}
            style={styles.payButton}
          >
            Pay ${amount}
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
  summaryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 16,
  },
  amountValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  paymentCard: {
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
  cardFieldContainer: {
    marginTop: 12,
  },
  cardField: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  webPaymentMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#e74c3c',
  },
  cardFieldStyle: {
    width: '100%',
    height: 50,
    marginVertical: 8,
  },
  actionContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  payButton: {
    paddingVertical: 8,
  },
});