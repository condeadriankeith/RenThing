import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, useEffect } from 'react-native';
import axios from 'axios';
import { ActivityIndicator, Card, Title, Paragraph, Button, List, Badge } from 'react-native-paper';
import MapView from 'react-native-maps';
import io from 'socket.io-client';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Custom theme
const theme = {
  ...DefaultTheme,
  colors: {
    primary: '#008080',
    accent: '#FFD369',
    background: '#F5F5F5',
  },
};

// Set the base URL for the backend API
// Replace with your computer's local IP address
axios.defaults.baseURL = 'http://192.168.254.106:5000';

// Login Screen
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('/api/users/login', { email, password });
      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('userId', response.data.userId.toString());
      navigation.navigate('Main');
    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.switchText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

// Registration Screen
const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post('/api/users/register', { username, email, password, user_type: 'renter' });
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Registration Failed', 'Could not create account');
    }
  };

  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.switchText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

// Home Screen
// Update HomeScreen
const HomeScreen = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/api/listings');
        setListings(response.data.listings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);
  return (
    <View style={styles.screen}>
      {loading ? <ActivityIndicator /> : (
        <List.Section>
          <List.Subheader>Curated Rentals</List.Subheader>
          {listings.map(item => (
            <Card key={item.id}>
              <Card.Title title={item.title} />
              <Card.Content>
                <Paragraph>{item.description}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </List.Section>
      )}
    </View>
  );
};

// Update SearchScreen
const SearchScreen = () => {
  const [region, setRegion] = useState({ latitude: 37.78825, longitude: -122.4324, latitudeDelta: 0.0922, longitudeDelta: 0.0421 });
  return (
    <View style={styles.screen}>
      <MapView style={{ flex: 1 }} region={region} onRegionChangeComplete={setRegion} />
    </View>
  );
};

// Update AddScreen
const AddScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      // upload to backend
    }
  };
  const handleSubmit = async () => {
    // post to /api/listings
  };
  return (
    <View style={styles.screen}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} />
      // ... form fields
      <Button onPress={pickImage}>Pick Image</Button>
      <Button onPress={handleSubmit}>Create Listing</Button>
    </View>
  );
};

// Update ListingsScreen similar to Home but full list
// Update BookingsScreen to fetch /api/bookings/user/:userId, show with badges
// Update ProfileScreen to fetch user data, show trust score etc.
// Add ChatScreen with socket.io similar to web
const ListingsScreen = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('/api/listings');
        setListings(response.data.listings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);
  return (
    <View style={styles.screen}>
      {loading ? <ActivityIndicator /> : (
        <List.Section>
          <List.Subheader>All Listings</List.Subheader>
          {listings.map(item => (
            <Card key={item.id}>
              <Card.Title title={item.title} subtitle={`$${item.price_per_day}/day`} />
              <Card.Content>
                <Paragraph>{item.description}</Paragraph>
              </Card.Content>
            </Card>
          ))}
        </List.Section>
      )}
    </View>
  );
};

// Bookings Screen
const BookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBookings = async () => {
      const userId = await AsyncStorage.getItem('userId');
      try {
        const response = await axios.get(`/api/bookings/user/${userId}`);
        setBookings(response.data.bookings);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);
  return (
    <View style={styles.screen}>
      {loading ? <ActivityIndicator /> : (
        <List.Section>
          <List.Subheader>My Bookings</List.Subheader>
          {bookings.map(booking => (
            <List.Item key={booking.id} title={booking.listing_title} description={`Status: ${booking.status}`} right={() => <Badge>{booking.status}</Badge>} />
          ))}
        </List.Section>
      )}
    </View>
  );
};

// Profile Screen
const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUser = async () => {
      const userId = await AsyncStorage.getItem('userId');
      try {
        const response = await axios.get(`/api/users/${userId}`);
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
  return (
    <View style={styles.screen}>
      {loading ? <ActivityIndicator /> : (
        <Card>
          <Card.Title title={user.username} subtitle={`Trust Score: ${user.trust_score}`} />
          <Card.Content>
            <Paragraph>Email: {user.email}</Paragraph>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Add" component={AddScreen} />
    <Tab.Screen name="Listings" component={ListingsScreen} />
    <Tab.Screen name="Bookings" component={BookingsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
  </Tab.Navigator>
);

const App = () => (
  <PaperProvider theme={theme}>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  </PaperProvider>
);

export default App;

const glassStyles = {
  backgroundColor: 'rgba(255,255,255,0.2)',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.3)',
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 30,
  elevation: 8,
  backdropFilter: 'blur(10px)', // For web, ignored on native
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    ...glassStyles,
  },
  authContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    ...glassStyles,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#008080',
    marginBottom: 16,
    ...glassStyles,
  },
  input: {
    width: '80%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#008080',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  button: {
    backgroundColor: '#008080',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginBottom: 16,
    ...glassStyles,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#008080',
    textDecorationLine: 'underline',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 16,
    ...glassStyles,
  },
  pickerButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#008080',
    borderRadius: 8,
    ...glassStyles,
  },
  pickerText: {
    color: '#008080',
  },
  pickerTextSelected: {
    color: '#FFD369',
    fontWeight: 'bold',
  },
});


const ChatScreen = ({ route }) => {
  const { bookingId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/chat/${bookingId}`);
        setMessages(response.data.messages);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMessages();
    socket.on('newMessage', (msg) => setMessages(prev => [...prev, msg]));
    return () => socket.off('newMessage');
  }, [bookingId]);
  const sendMessage = () => {
    socket.emit('sendMessage', { bookingId, content: newMessage, senderId: AsyncStorage.getItem('userId') });
    setNewMessage('');
  };
  return (
    <View style={styles.screen}>
      <List.Section>
        {messages.map((msg, idx) => <List.Item key={idx} title={msg.content} description={msg.sender_username} />)}
      </List.Section>
      <TextInput value={newMessage} onChangeText={setNewMessage} />
      <Button onClick={sendMessage}>Send</Button>
    </View>
  );
};
