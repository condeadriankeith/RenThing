import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useListings } from '../context/ListingContext';

// SVG Icons as React components
const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const StarIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeartIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ElectronicsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const ToolsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

const FurnitureIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>
);

const ClothingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EventsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();
  const { listings, loading } = useListings();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const categories = [
    { name: 'Electronics', icon: <ElectronicsIcon /> },
    { name: 'Tools', icon: <ToolsIcon /> },
    { name: 'Furniture', icon: <FurnitureIcon /> },
    { name: 'Clothing', icon: <ClothingIcon /> },
    { name: 'Events', icon: <EventsIcon /> },
  ];

  const featuredItems = listings.slice(0, 4);
  const recommendedItems = listings.slice(4, 8);

  const SkeletonCard = ({ isMobile }) => (
  <motion.div
    style={{
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0,128,128,0.18)',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 60%, rgba(0,128,128,0.10) 100%)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      border: '1.5px solid rgba(255,255,255,0.35)',
      overflow: 'hidden',
    }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className={`${isMobile ? 'h-40' : 'h-56'} w-full bg-gray-200 animate-pulse`}></div>
    <div className={isMobile ? 'p-4' : 'p-5'}>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
    </div>
  </motion.div>
  );

  const ItemCard = ({ item, isMobile }) => (
  <motion.div
    style={{
      borderRadius: '20px',
      boxShadow: '0 8px 32px rgba(0,128,128,0.18)',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 60%, rgba(0,128,128,0.10) 100%)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
      border: '1.5px solid rgba(255,255,255,0.35)',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'all 0.3s',
    }}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    onClick={() => navigate(`/listings/${item.id}`)}
  >
    <div className="bg-gray-200 relative">
      <div className={`${isMobile ? 'h-40' : 'h-56'} w-full bg-gray-200 rounded-t-xl`}>
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          background: 'rgba(255,255,255,0.6)',
          borderRadius: '50%',
          padding: 8,
          boxShadow: '0 2px 8px rgba(0,128,128,0.10)',
          backdropFilter: 'blur(8px)',
        }}>
          <HeartIcon className="h-5 w-5 text-gray-400 hover:text-red-500 transition" />
        </div>
      </div>
    </div>
    <div className={isMobile ? 'p-4' : 'p-5'}>
      <h3 style={{ fontWeight: 600, fontSize: isMobile ? '1rem' : '1.25rem', color: '#222', marginBottom: 8 }}>{item.title}</h3>
      <p style={{ color: '#008080', fontWeight: 700, fontSize: '1.1rem', marginBottom: 12 }}>{item.price_per_day}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: '#555', marginLeft: 4 }}>/day</span></p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <StarIcon className="h-4 w-4 text-yellow-400" />
          <span style={{ fontSize: '0.95rem', color: '#555', marginLeft: 6 }}>{item.rating || '4.5'}</span>
        </div>
        <span style={{ fontSize: '0.95rem', color: '#555' }}>{item.location || '1.2km'}</span>
      </div>
    </div>
  </motion.div>
  );

  if (isMobile) {
    return (
      <motion.div
        className="md:hidden pb-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } }
          }}
        >
          {/* Search Bar */}
          <div className="px-4 pt-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search for items or services..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent shadow-sm"
                onClick={() => navigate('/search')}
              />
              <SearchIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
              <div className="absolute right-3 top-3.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="px-4 mt-8">
            <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
            <div className="flex overflow-x-auto space-x-4 py-4 hide-scrollbar">
              {categories.map((category) => (
                <div key={category.name} className="flex-shrink-0 flex flex-col items-center group cursor-pointer">
                  <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                    {category.icon}
                  </div>
                  <p className="text-sm text-center mt-2 text-gray-700 group-hover:text-teal-600 transition-colors duration-300">{category.name}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Promo Banner */}
          <div className="px-4 mt-6">
            <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl p-6 text-white">
              <h3 className="font-bold text-xl text-white">Summer Special!</h3>
              <p className="text-base text-white opacity-90 mt-2">Get 20% off on all outdoor equipment</p>
              <button className="mt-4 bg-glass text-teal-600 px-4 py-2 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">Rent Now</button>
            </div>
          </div>

          {/* Recommended */}
          <div className="px-4 mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Recommended For You</h2>
              <button className="text-teal-600 font-medium">See all</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {loading ? (
                [1, 2, 3, 4].map(i => <SkeletonCard key={i} isMobile={true} />)
              ) : (
                recommendedItems.map((item) => (
                  <ItemCard key={item.id} item={item} isMobile={true} />
                ))
              )}
            </div>
          </div>

          {/* Nearby Rentals */}
          <div className="px-4 mt-8 mb-8">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Nearby Rentals</h2>
              <button className="text-teal-600 font-medium">See all</button>
            </div>
            <div className="mt-4">
              <div className="bg-glass rounded-xl overflow-hidden shadow-md">
                <div className="h-48 bg-gray-200 relative">
                  <div className="absolute bottom-4 left-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-lg text-sm">
                    <span>2.1km away</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">Party Sound System</h3>
                      <p className="text-teal-600 font-bold text-base mt-1">₱2,500/day</p>
                    </div>
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm text-gray-600 ml-1">4.8 (12)</span>
                    </div>
                  </div>
                  <button className="w-full mt-4 bg-teal-600 text-white py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl">Rent Now</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
}

  return (
    <motion.div
      className="hidden md:block container mx-auto px-4 py-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } }
        }}
      >
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-xl p-12 text-white">
          <div className="flex items-center">
            <div className="w-1/2">
              <h1 className="text-4xl font-bold text-white mb-4">Rent Anything, Anytime</h1>
              <p className="text-lg text-white opacity-90 mb-8">From cameras to camping gear, find what you need for your next adventure</p>
              <button 
                className="bg-glass text-teal-600 px-8 py-3 rounded-full font-semibold hover:bg-teal-100 transition shadow-lg"
                onClick={() => navigate('/search')}
                sx={{
                  color: '#fff', // Make text white
                  textShadow: '0 2px 8px rgba(0,0,0,0.18)',
                  fontWeight: 700,
                }}
              >
                Browse Items
              </button>
            </div>
            <div className="w-1/2 flex justify-end">
              <div className="w-80 h-80 bg-glass rounded-2xl"></div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Popular Categories</h2>
          <div className="grid grid-cols-5 gap-6">
            {categories.map((category) => (
              <div 
                  key={category.name}
              className="bg-glass rounded-xl p-6 text-center shadow-sm hover:shadow-lg transition cursor-pointer hover:bg-teal-50 transform hover:-translate-y-1 hover:shadow-teal-100/50"
                  onClick={() => navigate(`/search?category=${category.name}`)}
                >
                  <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto hover:bg-teal-200 transition">
                    {category.icon}
                  </div>
                  <p className="mt-3 font-semibold text-gray-800">{category.name}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Featured Items */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Rentals</h2>
            <button className="text-teal-600 font-semibold text-lg">View all</button>
          </div>
          <div className="grid grid-cols-4 gap-8">
            {loading ? (
              [1, 2, 3, 4].map(i => <SkeletonCard key={i} isMobile={false} />)
            ) : (
              featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} isMobile={false} />
              ))
            )}
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">How RenThing Works</h2>
          <div className="grid grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto hover:bg-teal-200 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-800">1. Find What You Need</h3>
              <p className="mt-3 text-gray-600 text-lg">Browse thousands of items available for rent in your area</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto hover:bg-teal-200 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-800">2. Book & Pay Securely</h3>
              <p className="mt-3 text-gray-600 text-lg">Choose your dates and pay through our secure payment system</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto hover:bg-teal-200 transition">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-gray-800">3. Enjoy & Return</h3>
              <p className="mt-3 text-gray-600 text-lg">Pick up or get it delivered, use it, then return when done</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Home;
