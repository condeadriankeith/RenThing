import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Avatar, Button, Card, Text, Divider, IconButton } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    itemsListed: 12,
    itemsRented: 5,
    rating: 4.8,
    totalEarnings: 340,
  });

  const menuItems = [
    { title: 'Edit Profile', icon: 'account-edit' },
    { title: 'My Items', icon: 'package-variant' },
    { title: 'Payment Methods', icon: 'credit-card' },
    { title: 'Settings', icon: 'cog' },
    { title: 'Help & Support', icon: 'help-circle' },
  ];

  const renderStatCard = (title: string, value: string | number, subtitle: string) => (
    <Card style={styles.statCard}>
      <Card.Content style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        <Text style={styles.statSubtitle}>{subtitle}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar.Image 
          size={100} 
          source={{ uri: user?.avatar || 'https://via.placeholder.com/100' }} 
          style={styles.avatar}
        />
        <Text style={styles.name}>{user?.name || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <Text style={styles.joinDate}>Member since 2023</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Your Stats</Text>
        <View style={styles.statsGrid}>
          {renderStatCard('Listed', stats.itemsListed, 'items')}
          {renderStatCard('Rented', stats.itemsRented, 'times')}
          {renderStatCard('Rating', stats.rating, 'stars')}
          {renderStatCard('Earned', `$${stats.totalEarnings}`, 'total')}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          <Button 
            mode="contained" 
            onPress={() => {}}
            style={styles.actionButton}
            icon="plus"
            contentStyle={styles.actionButtonContent}
          >
            List Item
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => {}}
            style={styles.actionButton}
            icon="magnify"
            contentStyle={styles.actionButtonContent}
          >
            Browse
          </Button>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account</Text>
        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.title}>
              <TouchableOpacity onPress={() => {}} style={styles.menuItem}>
                <View style={styles.menuItemContent}>
                  <IconButton 
                    icon={item.icon} 
                    size={24} 
                    style={styles.menuIcon}
                  />
                  <View style={styles.menuTextContainer}>
                    <Text style={styles.menuTitle}>{item.title}</Text>
                    <IconButton 
                      icon="chevron-right" 
                      size={20} 
                      style={styles.menuArrow}
                    />
                  </View>
                </View>
              </TouchableOpacity>
              {index < menuItems.length - 1 && <Divider style={styles.divider} />}
            </React.Fragment>
          ))}
        </Card>
      </View>

      {/* Logout Button */}
      <Button 
        mode="outlined" 
        onPress={logout}
        style={styles.logoutButton}
        contentStyle={styles.logoutButtonContent}
        icon="logout"
      >
        Sign Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3B82F6',
    padding: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  avatar: {
    borderWidth: 3,
    borderColor: 'white',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 16,
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'white',
    opacity: 0.9,
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 14,
    color: 'white',
    opacity: 0.7,
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - 48) / 2,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  quickActions: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonContent: {
    height: 48,
  },
  menuSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuCard: {
    borderRadius: 12,
    elevation: 2,
  },
  menuItem: {
    paddingVertical: 4,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  menuIcon: {
    marginRight: 8,
    marginLeft: 0,
  },
  menuTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  menuArrow: {
    margin: 0,
  },
  divider: {
    marginHorizontal: 16,
  },
  logoutButton: {
    marginHorizontal: 16,
    marginBottom: 32,
  },
  logoutButtonContent: {
    height: 48,
  },
});