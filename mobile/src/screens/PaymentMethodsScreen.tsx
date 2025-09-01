import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, TextInput, Switch, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

interface PaymentMethod {
  id: string;
  type: 'card' | 'gcash' | 'grabpay';
  last4?: string;
  name: string;
  isDefault: boolean;
}

export default function PaymentMethodsScreen() {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      name: 'Visa ending in 4242',
      isDefault: true
    },
    {
      id: '2',
      type: 'gcash',
      name: 'GCash (+63 9XX XXX XXXX)',
      isDefault: false
    }
  ]);

  const handleAddPaymentMethod = () => {
    Alert.alert(
      'Add Payment Method',
      'Choose a payment method to add',
      [
        { text: 'Credit/Debit Card', onPress: () => addCard() },
        { text: 'GCash', onPress: () => addGCash() },
        { text: 'GrabPay', onPress: () => addGrabPay() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const addCard = () => {
    Alert.alert('Add Card', 'Credit card integration coming soon!');
  };

  const addGCash = () => {
    Alert.alert('Add GCash', 'GCash integration coming soon!');
  };

  const addGrabPay = () => {
    Alert.alert('Add GrabPay', 'GrabPay integration coming soon!');
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
    Alert.alert('Success', 'Default payment method updated');
  };

  const handleRemoveMethod = (id: string) => {
    Alert.alert(
      'Remove Payment Method',
      'Are you sure you want to remove this payment method?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setPaymentMethods(prev => prev.filter(method => method.id !== id));
            Alert.alert('Success', 'Payment method removed');
          }
        }
      ]
    );
  };

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'card':
        return '💳';
      case 'gcash':
        return '📱';
      case 'grabpay':
        return '🚗';
      default:
        return '💰';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Payment Methods" showBack />
      
      <ScrollView style={styles.content}>
        {/* Current Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Payment Methods</Text>
          
          {paymentMethods.map((method) => (
            <Card key={method.id} style={styles.paymentCard}>
              <Card.Content style={styles.paymentContent}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentIcon}>{getPaymentIcon(method.type)}</Text>
                  <View style={styles.paymentDetails}>
                    <Text style={styles.paymentName}>{method.name}</Text>
                    {method.isDefault && (
                      <Text style={styles.defaultBadge}>Default</Text>
                    )}
                  </View>
                </View>
                
                <View style={styles.paymentActions}>
                  {!method.isDefault && (
                    <Button
                      mode="text"
                      onPress={() => handleSetDefault(method.id)}
                      style={styles.actionButton}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    mode="text"
                    onPress={() => handleRemoveMethod(method.id)}
                    style={styles.actionButton}
                    textColor="#EF4444"
                  >
                    Remove
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Add New Payment Method */}
        <View style={styles.section}>
          <Button
            mode="contained"
            onPress={handleAddPaymentMethod}
            style={styles.addButton}
            icon="plus"
          >
            Add New Payment Method
          </Button>
        </View>

        {/* Payment Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Settings</Text>
          
          <Card style={styles.settingsCard}>
            <Card.Content>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Auto-pay for bookings</Text>
                  <Text style={styles.settingDescription}>
                    Automatically charge your default payment method when booking is confirmed
                  </Text>
                </View>
                <Switch value={true} onValueChange={() => {}} />
              </View>
              
              <Divider style={styles.settingDivider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Save payment info</Text>
                  <Text style={styles.settingDescription}>
                    Securely save payment information for faster checkout
                  </Text>
                </View>
                <Switch value={true} onValueChange={() => {}} />
              </View>
              
              <Divider style={styles.settingDivider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Payment notifications</Text>
                  <Text style={styles.settingDescription}>
                    Get notified about payment confirmations and receipts
                  </Text>
                </View>
                <Switch value={true} onValueChange={() => {}} />
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Security Info */}
        <View style={styles.section}>
          <Card style={styles.securityCard}>
            <Card.Content>
              <Text style={styles.securityTitle}>🔒 Secure Payments</Text>
              <Text style={styles.securityText}>
                Your payment information is encrypted and secure. We use industry-standard 
                security measures to protect your financial data. We never store your 
                complete card details on our servers.
              </Text>
              
              <View style={styles.securityFeatures}>
                <Text style={styles.securityFeature}>✓ 256-bit SSL encryption</Text>
                <Text style={styles.securityFeature}>✓ PCI DSS compliant</Text>
                <Text style={styles.securityFeature}>✓ Fraud protection</Text>
                <Text style={styles.securityFeature}>✓ Secure payment processing</Text>
              </View>
            </Card.Content>
          </Card>
        </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  paymentCard: {
    marginBottom: 12,
    elevation: 2,
  },
  paymentContent: {
    padding: 16,
  },
  paymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  defaultBadge: {
    fontSize: 12,
    color: '#22C55E',
    fontWeight: 'bold',
  },
  paymentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 8,
  },
  addButton: {
    marginTop: 8,
  },
  settingsCard: {
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
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
  settingDivider: {
    marginVertical: 8,
  },
  securityCard: {
    elevation: 2,
    backgroundColor: '#F0F9FF',
  },
  securityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1E40AF',
  },
  securityText: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 16,
    lineHeight: 20,
  },
  securityFeatures: {
    gap: 8,
  },
  securityFeature: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '500',
  },
});