import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, Card, Switch, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const [settings, setSettings] = useState({
    notifications: {
      bookingUpdates: true,
      newMessages: true,
      paymentAlerts: true,
      marketingEmails: false,
    },
    privacy: {
      showOnlineStatus: true,
      allowDirectMessages: true,
      showProfileToPublic: true,
      shareActivityStatus: false,
    },
    preferences: {
      darkMode: false,
      language: 'English',
      currency: 'PHP',
      autoSaveListings: true,
    }
  });

  const updateNotificationSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const updatePrivacySetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value
      }
    }));
  };

  const updatePreferenceSetting = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleLanguageChange = () => {
    Alert.alert(
      'Language Settings',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => {} },
        { text: 'Filipino', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleCurrencyChange = () => {
    Alert.alert(
      'Currency Settings',
      'Choose your preferred currency',
      [
        { text: 'PHP (₱)', onPress: () => {} },
        { text: 'USD ($)', onPress: () => {} },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data and may improve app performance. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          onPress: () => {
            Alert.alert('Success', 'Cache cleared successfully');
          }
        }
      ]
    );
  };

  const handleReportBug = () => {
    Alert.alert(
      'Report a Bug',
      'Would you like to report a bug or provide feedback?',
      [
        { text: 'Report Bug', onPress: () => Alert.alert('Bug Report', 'Bug reporting coming soon!') },
        { text: 'Send Feedback', onPress: () => Alert.alert('Feedback', 'Feedback form coming soon!') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Account Deletion', 'Account deletion process will be initiated. Please contact support for assistance.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Settings" showBack />
      
      <ScrollView style={styles.content}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{user?.name || 'User'}</Text>
                <Text style={styles.accountEmail}>{user?.email}</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Booking Updates</Text>
                  <Text style={styles.settingDescription}>Get notified about booking confirmations and changes</Text>
                </View>
                <Switch 
                  value={settings.notifications.bookingUpdates} 
                  onValueChange={(value) => updateNotificationSetting('bookingUpdates', value)}
                />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>New Messages</Text>
                  <Text style={styles.settingDescription}>Get notified when you receive new messages</Text>
                </View>
                <Switch 
                  value={settings.notifications.newMessages} 
                  onValueChange={(value) => updateNotificationSetting('newMessages', value)}
                />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Payment Alerts</Text>
                  <Text style={styles.settingDescription}>Get notified about payment confirmations and receipts</Text>
                </View>
                <Switch 
                  value={settings.notifications.paymentAlerts} 
                  onValueChange={(value) => updateNotificationSetting('paymentAlerts', value)}
                />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Marketing Emails</Text>
                  <Text style={styles.settingDescription}>Receive updates about new features and promotions</Text>
                </View>
                <Switch 
                  value={settings.notifications.marketingEmails} 
                  onValueChange={(value) => updateNotificationSetting('marketingEmails', value)}
                />
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy</Text>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Show Online Status</Text>
                  <Text style={styles.settingDescription}>Let others know when you're online</Text>
                </View>
                <Switch 
                  value={settings.privacy.showOnlineStatus} 
                  onValueChange={(value) => updatePrivacySetting('showOnlineStatus', value)}
                />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Allow Direct Messages</Text>
                  <Text style={styles.settingDescription}>Allow other users to send you direct messages</Text>
                </View>
                <Switch 
                  value={settings.privacy.allowDirectMessages} 
                  onValueChange={(value) => updatePrivacySetting('allowDirectMessages', value)}
                />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Public Profile</Text>
                  <Text style={styles.settingDescription}>Make your profile visible to other users</Text>
                </View>
                <Switch 
                  value={settings.privacy.showProfileToPublic} 
                  onValueChange={(value) => updatePrivacySetting('showProfileToPublic', value)}
                />
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Use dark theme for the app</Text>
                </View>
                <Switch 
                  value={settings.preferences.darkMode} 
                  onValueChange={(value) => updatePreferenceSetting('darkMode', value)}
                />
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Language</Text>
                  <Text style={styles.settingDescription}>English</Text>
                </View>
                <Button mode="outlined" onPress={handleLanguageChange} compact>
                  Change
                </Button>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Currency</Text>
                  <Text style={styles.settingDescription}>PHP (₱)</Text>
                </View>
                <Button mode="outlined" onPress={handleCurrencyChange} compact>
                  Change
                </Button>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Auto-save Listings</Text>
                  <Text style={styles.settingDescription}>Automatically save draft listings</Text>
                </View>
                <Switch 
                  value={settings.preferences.autoSaveListings} 
                  onValueChange={(value) => updatePreferenceSetting('autoSaveListings', value)}
                />
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* App Info & Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App</Text>
          <Card style={styles.card}>
            <Card.Content>
              <Button 
                mode="outlined" 
                onPress={handleClearCache}
                style={styles.actionButton}
                icon="delete-sweep"
              >
                Clear Cache
              </Button>
              
              <Button 
                mode="outlined" 
                onPress={handleReportBug}
                style={styles.actionButton}
                icon="bug"
              >
                Report Bug / Feedback
              </Button>
              
              <View style={styles.appVersion}>
                <Text style={styles.versionText}>Version 1.0.0</Text>
                <Text style={styles.versionSubtext}>RenThing Mobile</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={styles.dangerTitle}>Danger Zone</Text>
          <Card style={[styles.card, styles.dangerCard]}>
            <Card.Content>
              <Button 
                mode="outlined" 
                onPress={logout}
                style={[styles.actionButton, styles.logoutButton]}
                icon="logout"
                textColor="#EF4444"
              >
                Sign Out
              </Button>
              
              <Button 
                mode="outlined" 
                onPress={handleDeleteAccount}
                style={[styles.actionButton, styles.deleteButton]}
                icon="account-remove"
                textColor="#DC2626"
              >
                Delete Account
              </Button>
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
    marginBottom: 12,
    color: '#333',
  },
  dangerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#DC2626',
  },
  card: {
    elevation: 2,
  },
  dangerCard: {
    borderColor: '#FEE2E2',
    borderWidth: 1,
  },
  accountInfo: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  accountName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  accountEmail: {
    fontSize: 14,
    color: '#666',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
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
  divider: {
    marginVertical: 8,
  },
  actionButton: {
    marginBottom: 12,
  },
  logoutButton: {
    borderColor: '#EF4444',
  },
  deleteButton: {
    borderColor: '#DC2626',
  },
  appVersion: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  versionText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  versionSubtext: {
    fontSize: 14,
    color: '#666',
  },
});