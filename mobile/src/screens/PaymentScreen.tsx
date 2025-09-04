import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, TextInput } from 'react-native-paper';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

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
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const handlePayment = async () => {
    if (!email || !name || !cardNumber || !expiry || !cvv) {
      Alert.alert('Validation Error', 'Please fill in all payment details');
      return;
    }

    setLoading(true);

    try {
      // Create payment intent with mock payment method
      const { data } = await apiClient.post('/payments/create-intent', {
        bookingId,
        amount,
        paymentMethod: 'mock'
      });

      // For mock payment, we'll just show a success message
      Alert.alert(
        'Payment Successful', 
        'Your payment has been processed successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Success' as any, { bookingId })
          }
        ]
      );
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
              label="Full Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            
            <TextInput
              label="Card Number"
              value={cardNumber}
              onChangeText={setCardNumber}
              placeholder="1234 5678 9012 3456"
              style={styles.input}
            />
            
            <View style={styles.row}>
              <TextInput
                label="Expiry Date"
                value={expiry}
                onChangeText={setExpiry}
                placeholder="MM/YY"
                style={[styles.input, styles.halfInput]}
              />
              
              <TextInput
                label="CVV"
                value={cvv}
                onChangeText={setCvv}
                placeholder="123"
                secureTextEntry
                style={[styles.input, styles.halfInput, styles.cvvInput]}
              />
            </View>
            
            <Text style={styles.infoText}>
              This is a mock payment interface for testing purposes.
            </Text>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginRight: 8,
  },
  cvvInput: {
    marginLeft: 8,
    marginRight: 0,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  actionContainer: {
    marginTop: 24,
    marginBottom: 32,
  },
  payButton: {
    paddingVertical: 8,
  },
});