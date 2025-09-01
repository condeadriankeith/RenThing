import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RenThingLogo from '../components/RenThingLogo';
import GradientText from '../components/GradientText';

const { width, height } = Dimensions.get('window');

export default function LandingScreen() {
  const navigation = useNavigation();

  const features = [
    {
      icon: 'search',
      title: 'Smart Search',
      description: 'Find exactly what you need with our intelligent search and filtering system.',
      color: '#2563eb',
    },
    {
      icon: 'event',
      title: 'Easy Booking',
      description: 'Schedule rentals and services with our intuitive booking calendar.',
      color: '#16a34a',
    },
    {
      icon: 'chat',
      title: 'Real-time Chat',
      description: 'Connect instantly with providers through our built-in messaging system.',
      color: '#9333ea',
    },
    {
      icon: 'shopping-bag',
      title: 'Secure Payments',
      description: 'Multiple payment options with secure processing and buyer protection.',
      color: '#ea580c',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Find or List',
      description: 'Browse our marketplace or easily list your own items for rent with our simple form.',
      color: '#2563eb',
    },
    {
      number: '2',
      title: 'Connect & Book',
      description: 'Message the owner, agree on terms, and book your rental with our secure system.',
      color: '#16a34a',
    },
    {
      number: '3',
      title: 'Enjoy & Return',
      description: 'Use the item as agreed, then return it and leave a review for future users.',
      color: '#9333ea',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.heroSection}>
        <View style={styles.heroContent}>
          <View style={styles.logoContainer}>
            <RenThingLogo width={40} height={40} />
            <Text style={styles.logoText}>RenThing</Text>
          </View>
          
          <Text style={styles.heroTitle}>
            Rent <GradientText style={styles.heroAccent} animated={true}>Anything</GradientText>, Anytime
          </Text>
          
          <Text style={styles.heroSubtitle}>
            Your one-stop marketplace for rentals and services. From equipment to experiences, 
            find what you need or offer what you have.
          </Text>
          
          <View style={styles.heroButtons}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Auth' as never)}
              style={[styles.heroButton, styles.primaryButton]}
              contentStyle={styles.heroButtonContent}
              labelStyle={styles.heroButtonText}
            >
              Get Started
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('Browse' as never)}
              style={[styles.heroButton, styles.secondaryButton]}
              contentStyle={styles.heroButtonContent}
              labelStyle={styles.heroButtonTextSecondary}
            >
              Browse Items
            </Button>
          </View>
        </View>
      </View>

      {/* Features Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Choose RenThing?</Text>
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => {
            return (
              <Card key={index} style={styles.featureCard}>
                <Card.Content style={styles.featureContent}>
                  <View style={[styles.featureIconContainer, { backgroundColor: `${feature.color}20` }]}>
                    <Icon name={feature.icon} size={24} color={feature.color} />
                  </View>
                  <Text style={styles.featureTitle}>{feature.title}</Text>
                  <Text style={styles.featureDescription}>{feature.description}</Text>
                </Card.Content>
              </Card>
            );
          })}
        </View>
      </View>

      {/* How It Works Section */}
      <View style={[styles.section, styles.howItWorksSection]}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <Text style={styles.sectionSubtitle}>Simple steps to rent or list items on our platform</Text>
        
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.step}>
              <View style={[styles.stepNumber, { backgroundColor: step.color }]}>
                <Text style={styles.stepNumberText}>{step.number}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Testimonials Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What Our Users Say</Text>
        <Text style={styles.sectionSubtitle}>Trusted by thousands of renters and owners in the Philippines</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.testimonialsScroll}>
          <Card style={styles.testimonialCard}>
            <Card.Content>
              <View style={styles.testimonialHeader}>
                <Image
                  source={{ uri: 'https://randomuser.me/api/portraits/women/43.jpg' }}
                  style={styles.testimonialAvatar}
                />
                <View>
                  <Text style={styles.testimonialName}>Sarah J.</Text>
                  <Text style={styles.testimonialStars}>⭐⭐⭐⭐⭐</Text>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "I've rented camera equipment multiple times for my photography projects. The process is so easy and the owners are always professional."
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.testimonialCard}>
            <Card.Content>
              <View style={styles.testimonialHeader}>
                <Image
                  source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                  style={styles.testimonialAvatar}
                />
                <View>
                  <Text style={styles.testimonialName}>Michael T.</Text>
                  <Text style={styles.testimonialStars}>⭐⭐⭐⭐⭐</Text>
                </View>
              </View>
              <Text style={styles.testimonialText}>
                "As a small business owner, renting tools and equipment through RenThing has been a game-changer for my operations."
              </Text>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaSection}>
        <View style={styles.ctaGradient}>
          <Text style={styles.ctaTitle}>Ready to Join the Rental Revolution?</Text>
          <Text style={styles.ctaSubtitle}>
            Whether you're looking to rent or list items, we've got you covered.
          </Text>
          <View style={styles.ctaButtons}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('Auth' as never)}
              style={[styles.ctaButton, styles.ctaPrimaryButton]}
              contentStyle={styles.ctaButtonContent}
              labelStyle={styles.ctaButtonText}
            >
              Sign Up to Rent
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate('CreateListing' as never)}
              style={[styles.ctaButton, styles.ctaSecondaryButton]}
              contentStyle={styles.ctaButtonContent}
              labelStyle={styles.ctaButtonTextSecondary}
            >
              List Your Items
            </Button>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerLogoContainer}>
          <RenThingLogo width={32} height={32} color="white" />
          <Text style={styles.footerLogoText}>RenThing</Text>
        </View>
        <Text style={styles.footerDescription}>
          The best place to rent items from your community in the Philippines.
        </Text>
        
        {/* Footer Links */}
        <View style={styles.footerLinksContainer}>
          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Browse</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Browse' as never)}>
              <Text style={styles.footerLink}>Browse Items</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CreateListing' as never)}>
              <Text style={styles.footerLink}>List Item</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Support</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://renthing.com/help')}>
              <Text style={styles.footerLink}>Help Center</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://renthing.com/contact')}>
              <Text style={styles.footerLink}>Contact Us</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.footerSection}>
            <Text style={styles.footerSectionTitle}>Company</Text>
            <TouchableOpacity onPress={() => Linking.openURL('https://renthing.com/about')}>
              <Text style={styles.footerLink}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL('https://renthing.com/privacy')}>
              <Text style={styles.footerLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.footerDivider} />
        <Text style={styles.footerCopyright}>© 2025 RenThing. All rights reserved.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  heroSection: {
    backgroundColor: '#dbeafe',
    minHeight: height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  heroContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 48,
    fontFamily: 'System',
  },
  heroAccent: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  heroButtons: {
    width: '100%',
  },
  heroButton: {
    marginBottom: 12,
    borderRadius: 12,
  },
  primaryButton: {
    backgroundColor: '#2563eb',
  },
  secondaryButton: {
    borderColor: '#2563eb',
    backgroundColor: 'white',
  },
  heroButtonContent: {
    height: 52,
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  heroButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  section: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    elevation: 2,
  },
  featureContent: {
    alignItems: 'center',
    padding: 20,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 16,
  },
  howItWorksSection: {
    backgroundColor: '#f9fafb',
  },
  stepsContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    elevation: 2,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  testimonialsScroll: {
    marginTop: 8,
  },
  testimonialCard: {
    width: 280,
    marginRight: 16,
    borderRadius: 16,
    elevation: 2,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  testimonialAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  testimonialName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  testimonialStars: {
    fontSize: 14,
    marginTop: 2,
  },
  testimonialText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  ctaSection: {
    marginHorizontal: 24,
    marginVertical: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  ctaGradient: {
    backgroundColor: '#2563eb',
    padding: 32,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaSubtitle: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.9,
    lineHeight: 24,
  },
  ctaButtons: {
    width: '100%',
  },
  ctaButton: {
    marginBottom: 12,
    borderRadius: 12,
  },
  ctaPrimaryButton: {
    backgroundColor: 'white',
  },
  ctaSecondaryButton: {
    borderColor: 'white',
    backgroundColor: 'transparent',
  },
  ctaButtonContent: {
    height: 52,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  ctaButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  footer: {
    backgroundColor: '#1f2937',
    padding: 32,
    alignItems: 'center',
  },
  footerLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  footerLogoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  footerDescription: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  footerLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  footerSection: {
    alignItems: 'center',
    flex: 1,
  },
  footerSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 12,
  },
  footerLink: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 8,
    textAlign: 'center',
  },
  footerDivider: {
    height: 1,
    backgroundColor: '#374151',
    width: '100%',
    marginBottom: 16,
  },
  footerCopyright: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
});