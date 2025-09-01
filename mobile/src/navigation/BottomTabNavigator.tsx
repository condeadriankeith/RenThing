import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import BrowseScreen from '../screens/BrowseScreen';
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CreateListingScreen from '../screens/CreateListingScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import BookingScreen from '../screens/BookingScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ChatScreen, { ConversationScreen } from '../screens/ChatScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const BrowseStack = createNativeStackNavigator<BrowseStackParamList>();
const BookingsStack = createNativeStackNavigator<BookingsStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

type HomeStackParamList = {
  HomeMain: undefined;
  ListingDetail: { listingId: string };
  Booking: { listingId: string };
  Payment: { bookingId: string; amount: number };
  CreateListing: undefined;
};

type BrowseStackParamList = {
  BrowseMain: undefined;
  ListingDetail: { listingId: string };
  Booking: { listingId: string };
  Payment: { bookingId: string; amount: number };
};

type BookingsStackParamList = {
  BookingsMain: undefined;
  Chat: { recipientId?: string; listingId?: string };
  Conversation: { conversationId: string; recipient: any };
};

type ProfileStackParamList = {
  ProfileMain: undefined;
  CreateListing: undefined;
  Chat: { recipientId?: string; listingId?: string };
  Conversation: { conversationId: string; recipient: any };
};

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="ListingDetail" component={ListingDetailScreen} />
      <HomeStack.Screen name="Booking" component={BookingScreen} />
      <HomeStack.Screen name="Payment" component={PaymentScreen} />
      <HomeStack.Screen name="CreateListing" component={CreateListingScreen} />
    </HomeStack.Navigator>
  );
}

function BrowseStackNavigator() {
  return (
    <BrowseStack.Navigator screenOptions={{ headerShown: false }}>
      <BrowseStack.Screen name="BrowseMain" component={BrowseScreen} />
      <BrowseStack.Screen name="ListingDetail" component={ListingDetailScreen} />
      <BrowseStack.Screen name="Booking" component={BookingScreen} />
      <BrowseStack.Screen name="Payment" component={PaymentScreen} />
    </BrowseStack.Navigator>
  );
}

function BookingsStackNavigator() {
  return (
    <BookingsStack.Navigator screenOptions={{ headerShown: false }}>
      <BookingsStack.Screen name="BookingsMain" component={BookingsScreen} />
      <BookingsStack.Screen name="Chat" component={ChatScreen} />
      <BookingsStack.Screen name="Conversation" component={ConversationScreen} />
    </BookingsStack.Navigator>
  );
}

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="CreateListing" component={CreateListingScreen} />
      <ProfileStack.Screen name="Chat" component={ChatScreen} />
      <ProfileStack.Screen name="Conversation" component={ConversationScreen} />
    </ProfileStack.Navigator>
  );
}

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Browse':
              iconName = focused ? 'search' : 'search-outline';
              break;
            case 'Bookings':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            case 'Chat':
              iconName = focused ? 'chatbubble' : 'chatbubble-outline';
              break;
            default:
              iconName = 'home';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Browse" component={BrowseStackNavigator} />
      <Tab.Screen name="Bookings" component={BookingsStackNavigator} />
      <Tab.Screen name="Chat">
        {(props) => <ChatScreen route={props.route as any} navigation={props.navigation} />}
      </Tab.Screen>
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}