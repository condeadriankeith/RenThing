import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

// SVG Icons
const PlusIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EditIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const listings = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max',
    price: 25,
    image: 'https://images.pexels.com/photos/5053740/pexels-photo-5053740.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'Active',
    views: 234,
    bookings: 5,
    earnings: 125,
    lastUpdated: '2 hours ago',
  },
  {
    id: 2,
    title: 'Canon EOS R5',
    price: 45,
    image: 'https://images.pexels.com/photos/243757/pexels-photo-243757.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'Pending',
    views: 156,
    bookings: 2,
    earnings: 90,
    lastUpdated: '1 day ago',
  },
  {
    id: 3,
    title: 'DJI Mini 3 Drone',
    price: 35,
    image: 'https://images.pexels.com/photos/336232/pexels-photo-336232.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'Active',
    views: 189,
    bookings: 8,
    earnings: 280,
    lastUpdated: '3 hours ago',
  },
  {
    id: 4,
    title: 'Gaming Laptop MSI',
    price: 55,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'Inactive',
    views: 89,
    bookings: 1,
    earnings: 55,
    lastUpdated: '1 week ago',
  },
];

const MyListings = () => {
  const [activeTab, setActiveTab] = useState('active');
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

  const tabs = [
    { id: 'active', label: 'Active', count: 12 },
    { id: 'pending', label: 'Pending', count: 3 },
    { id: 'booked', label: 'Booked', count: 8 },
    { id: 'inactive', label: 'Inactive', count: 5 },
  ];

  const filteredListings = listings.filter(listing => {
    if (activeTab === 'active') return listing.status === 'Active';
    if (activeTab === 'pending') return listing.status === 'Pending';
    if (activeTab === 'booked') return listing.status === 'Booked';
    if (activeTab === 'inactive') return listing.status === 'Inactive';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Booked': return 'text-blue-600 bg-blue-100';
      case 'Inactive': return 'text-gray-600 bg-glass';
      default: return 'text-gray-600 bg-glass';
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-glass"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="bg-glass shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
            <Link
              to="/add"
              className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-teal-700 hover:to-teal-600 transition flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex space-x-1 bg-glass p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2 rounded-md font-medium transition ${
                activeTab === tab.id
                  ? 'bg-glass text-teal-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
              <span className="ml-2 text-sm text-gray-500">({tab.count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No listings found</h3>
            <p className="text-gray-500 mb-4">You don't have any listings in this category yet.</p>
            <Link
              to="/add"
              className="bg-gradient-to-r from-teal-600 to-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:from-teal-700 hover:to-teal-600 transition"
            >
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <div key={listing.id} className="bg-glass rounded-lg shadow-sm hover:shadow-md transition">
                <div className="aspect-w-16 aspect-h-9">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{listing.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(listing.status)}`}> 
                      {listing.status}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-teal-600 mb-2">
                    ₱{listing.price}<span className="text-sm font-normal text-gray-500">/day</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-gray-600 mb-4">
                    <div className="text-center">
                      <div className="font-semibold">{listing.views}</div>
                      <div className="text-xs">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{listing.bookings}</div>
                      <div className="text-xs">Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">₱{listing.earnings}</div>
                      <div className="text-xs">Earnings</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">Updated {listing.lastUpdated}</div>
                  <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-glass transition">
                      View
                    </button>
                    <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-glass transition">
                      <EditIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button className="flex items-center justify-center px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition">
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MyListings;