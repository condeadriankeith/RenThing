import React from 'react';
import { View, ScrollView, StyleSheet, Linking, Alert } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '../components/Header';

export default function HelpSupportScreen() {
  const handleEmailSupport = () => {
    const email = 'support@renthing.com';
    const subject = 'Mobile App Support Request';
    const body = 'Please describe your issue or question:';
    
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Email client not available. Please contact support@renthing.com directly.');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Unable to open email client. Please contact support@renthing.com directly.');
      });
  };

  const handleCallSupport = () => {
    const phoneNumber = 'tel:+15551234567';
    
    Linking.canOpenURL(phoneNumber)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(phoneNumber);
        } else {
          Alert.alert('Error', 'Phone dialer not available.');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Unable to make phone call.');
      });
  };

  const handleWebsiteHelp = () => {
    const url = 'https://renthing.com/help';
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert('Error', 'Unable to open web browser.');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Unable to open web browser.');
      });
  };

  const handleReportBug = () => {
    Alert.alert(
      'Report a Bug',
      'Please describe the issue you encountered and we\'ll get back to you soon.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Send Email', onPress: () => {
          const email = 'bugs@renthing.com';
          const subject = 'Mobile App Bug Report';
          const body = 'Bug Description:\n\nSteps to Reproduce:\n\nExpected Behavior:\n\nActual Behavior:\n\nDevice Info:\n';
          
          const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          Linking.openURL(url);
        }}
      ]
    );
  };

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Tap "Sign Up" on the login screen, fill in your details, and verify your email address.'
    },
    {
      question: 'How do I list an item for rent?',
      answer: 'Go to the Profile tab, tap "List Item", and fill out the form with photos, description, and pricing.'
    },
    {
      question: 'How do I book an item?',
      answer: 'Find an item you want to rent, tap "Book Now", select your dates, and complete the payment.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit/debit cards, GCash, and GrabPay for secure payments.'
    },
    {
      question: 'How do I contact the owner?',
      answer: 'After booking, you can message the owner directly through the in-app chat system.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel bookings depending on the owner\'s cancellation policy. Check your booking details for specific terms.'
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Help & Support" showBack />
      
      <ScrollView style={styles.content}>
        {/* Contact Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get Help</Text>
          
          <Card style={styles.contactCard}>
            <Card.Content>
              <View style={styles.contactOption}>
                <Text style={styles.contactTitle}>📧 Email Support</Text>
                <Text style={styles.contactDescription}>
                  Send us a detailed message and we'll respond within 24 hours
                </Text>
                <Button 
                  mode="contained" 
                  onPress={handleEmailSupport}
                  style={styles.contactButton}
                >
                  Send Email
                </Button>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.contactCard}>
            <Card.Content>
              <View style={styles.contactOption}>
                <Text style={styles.contactTitle}>📞 Phone Support</Text>
                <Text style={styles.contactDescription}>
                  Call us for urgent issues (available 9 AM - 9 PM)
                </Text>
                <Button 
                  mode="outlined" 
                  onPress={handleCallSupport}
                  style={styles.contactButton}
                >
                  Call Support
                </Button>
              </View>
            </Card.Content>
          </Card>

          <Card style={styles.contactCard}>
            <Card.Content>
              <View style={styles.contactOption}>
                <Text style={styles.contactTitle}>🌐 Help Center</Text>
                <Text style={styles.contactDescription}>
                  Browse our comprehensive help articles and guides
                </Text>
                <Button 
                  mode="outlined" 
                  onPress={handleWebsiteHelp}
                  style={styles.contactButton}
                >
                  Visit Help Center
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Report Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Issues</Text>
          
          <Card style={styles.card}>
            <Card.Content>
              <Button 
                mode="outlined" 
                onPress={handleReportBug}
                style={styles.actionButton}
                icon="bug"
              >
                Report a Bug
              </Button>
              
              <Button 
                mode="outlined" 
                onPress={() => Alert.alert('Feedback', 'Feedback form coming soon!')}
                style={styles.actionButton}
                icon="message-text"
              >
                Send Feedback
              </Button>
            </Card.Content>
          </Card>
        </View>

        {/* FAQ Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          
          {faqs.map((faq, index) => (
            <Card key={index} style={styles.faqCard}>
              <Card.Content>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Additional Resources</Text>
          
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.resourceItem}>
                <Text style={styles.resourceTitle}>🛡️ Safety Guidelines</Text>
                <Text style={styles.resourceDescription}>
                  Learn how to stay safe while renting and lending items
                </Text>
              </View>
              
              <View style={styles.resourceItem}>
                <Text style={styles.resourceTitle}>📋 Community Rules</Text>
                <Text style={styles.resourceDescription}>
                  Understand our community guidelines and terms of service
                </Text>
              </View>
              
              <View style={styles.resourceItem}>
                <Text style={styles.resourceTitle}>💡 Tips & Tricks</Text>
                <Text style={styles.resourceDescription}>
                  Get the most out of your RenThing experience
                </Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Card style={styles.infoCard}>
            <Card.Content>
              <Text style={styles.infoTitle}>RenThing Mobile</Text>
              <Text style={styles.infoVersion}>Version 1.0.0</Text>
              <Text style={styles.infoDescription}>
                Your trusted platform for renting and lending items in the Philippines
              </Text>
              
              <View style={styles.contactInfo}>
                <Text style={styles.contactInfoText}>📧 support@renthing.com</Text>
                <Text style={styles.contactInfoText}>📞 +1 (555) 123-RENT</Text>
                <Text style={styles.contactInfoText}>🌐 www.renthing.com</Text>
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
  card: {
    elevation: 2,
    marginBottom: 12,
  },
  contactCard: {
    elevation: 2,
    marginBottom: 16,
  },
  faqCard: {
    elevation: 2,
    marginBottom: 12,
  },
  infoCard: {
    elevation: 2,
    backgroundColor: '#F0F9FF',
  },
  contactOption: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  contactDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactButton: {
    width: '100%',
  },
  actionButton: {
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  resourceItem: {
    marginBottom: 16,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 14,
    color: '#666',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  infoVersion: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 8,
  },
  infoDescription: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
  },
  contactInfo: {
    alignItems: 'center',
  },
  contactInfoText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
});