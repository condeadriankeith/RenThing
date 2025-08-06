import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// SVG Icons
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const LocationIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const categories = [
  { name: 'Electronics', icon: '📱', count: 1234 },
  { name: 'Vehicles', icon: '🚗', count: 856 },
  { name: 'Home & Garden', icon: '🏠', count: 2341 },
  { name: 'Sports & Outdoors', icon: '⚽', count: 567 },
  { name: 'Tools & Equipment', icon: '🔧', count: 789 },
  { name: 'Events & Party', icon: '🎉', count: 432 },
  { name: 'Fashion & Accessories', icon: '👗', count: 1567 },
  { name: 'Books & Media', icon: '📚', count: 890 },
  { name: 'Music & Instruments', icon: '🎸', count: 345 },
  { name: 'Baby & Kids', icon: '👶', count: 678 },
  { name: 'Office & Business', icon: '💼', count: 901 },
  { name: 'Art & Crafts', icon: '🎨', count: 234 },
];

const popularItems = [
  { id: 1, name: 'iPhone 15 Pro', price: 25, image: 'https://images.pexels.com/photos/5053740/pexels-photo-5053740.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.8, location: 'Manila' },
  { id: 2, name: 'Canon EOS R5', price: 45, image: 'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.9, location: 'Quezon City' },
  { id: 3, name: 'DJI Mini 3', price: 35, image: 'https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.7, location: 'Makati' },
  { id: 4, name: 'Gaming Laptop', price: 55, image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800', rating: 4.6, location: 'Taguig' },
];

const Explore = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const PEXELS_API_KEY = 'S6YsEWf484ZrbOFrIVqU92AGsBlpMX8MomXebcBPmzUw9Wk8lhc1kKOV';
  
  const fetchPexelsImage = async (query) => {
    try {
      const response = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      });
      const photo = response.data.photos[0];
      return photo ? photo.src.medium : null;
    } catch (error) {
      console.error('Error fetching image from Pexels:', error);
      return null;
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, rgba(255,255,255,0.18) 60%, rgba(0,128,128,0.10) 100%)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        boxShadow: '0 8px 32px 0 rgba(0,128,128,0.18), 0 1.5px 8px 0 rgba(0,0,0,0.08) inset',
        border: '2px solid rgba(255,255,255,0.25)',
        borderRadius: '32px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div className="bg-glass shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Explore Categories</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories
            .filter(cat => 
              cat.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((category) => (
            <Link
              key={category.name}
              to={`/search?category=${category.name}`}
              className="bg-glass rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 text-center group"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.32) 60%, rgba(0,128,128,0.14) 100%)',
                backdropFilter: 'blur(18px)',
                WebkitBackdropFilter: 'blur(18px)',
                border: '2px solid rgba(255,255,255,0.25)',
                borderRadius: '18px',
                boxShadow: '0 4px 16px rgba(0,128,128,0.12)',
                color: '#008080',
                fontWeight: 600,
                padding: '12px 24px',
                margin: '8px',
                transition: 'all 0.3s',
              }}
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                {category.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">{category.name}</h3>
              <p className="text-xs text-gray-500">{category.count} items</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Popular Items */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Popular Rentals</h2>
          <Link to="/search" className="text-teal-600 hover:text-teal-700 text-sm font-medium">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularItems.map((item) => (
            <Link
              key={item.id}
              to={`/listings/${item.id}`}
              className="bg-glass rounded-lg shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden group"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-bold text-teal-600">₱{item.price}/day</span>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>★</span>
                    <span className="ml-1">{item.rating}</span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <LocationIcon className="h-4 w-4 mr-1" />
                  <span>{item.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Location-based Recommendations */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl p-6 text-white">
          <div className="flex items-center mb-4">
            <LocationIcon className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">Rentals near you</h3>
          </div>
          <p className="text-sm opacity-90 mb-4">
            Discover amazing items available for rent in your area
          </p>
          <button className="bg-glass text-teal-600 px-4 py-2 rounded-full font-medium hover:bg-glass transition">
            Browse Nearby
          </button>
        </div>
      </div>
    </div>
  );
};

export default Explore;