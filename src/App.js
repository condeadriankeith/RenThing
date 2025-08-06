import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link, useNavigate } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Add from './pages/Add';
import Bookings from './pages/Bookings';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Register from './pages/Register';
import Login from './pages/Login';
import Listings from './pages/Listings';
import ListingDetails from './pages/ListingDetails';
import Explore from './pages/Explore';
import MyListings from './pages/MyListings';
import Wallet from './pages/Wallet';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';
import BottomNavigation from './components/BottomNavigation';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ListingProvider } from './context/ListingContext';
import { BookingProvider } from './context/BookingContext';
import { ChatProvider } from './context/ChatContext';

// Import icons from BottomNavigation to avoid duplication
import { HomeIcon, SearchIcon, AddIcon, BookIcon, PersonIcon, ChatIcon } from './components/BottomNavigation';

const AppContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Desktop Navigation */}
      {!isMobile && (
        <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-white shadow-md sticky top-0 z-40">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold rounded-lg px-3 py-2 mr-6">
              RenThing
            </div>
            <div className="relative pt-4 md:pt-0">
              <input 
                type="text" 
                placeholder="Search for items or services..." 
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    navigate('/search');
                  }
                }}
              />
              <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/explore" className="text-gray-600 hover:text-teal-600">Explore</Link>
            <Link to="/chat" className="text-gray-600 hover:text-teal-600 flex items-center">
              <ChatIcon className="h-5 w-5 mr-1" />
              Chat
            </Link>
            <button 
              onClick={() => navigate('/add')}
              className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-2 rounded-full font-medium hover:from-teal-500 hover:to-teal-600 transition"
            >
              Rent Out
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                <PersonIcon className="h-5 w-5 text-teal-600" />
              </div>
              <span className="text-gray-700">{user?.name || 'Guest'}</span>
            </div>
          </div>
        </nav>
      )}

      {/* Main Content */}
      <div className="relative pt-4 md:pt-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/add" element={<Add />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listings/:id" element={<ListingDetails />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/settings" element={<Settings />} />
          <Route path="/profile/wallet" element={<Wallet />} />
          <Route path="/profile/help" element={<HelpCenter />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />


    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ListingProvider>
        <BookingProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </BookingProvider>
      </ListingProvider>
    </AuthProvider>
  );
};

export default App;
