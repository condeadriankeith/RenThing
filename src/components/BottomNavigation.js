import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// SVG Icons as React components
const HomeIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const AddIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const BookIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const PersonIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ChatIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const BottomNavigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/explore', label: 'Explore', icon: SearchIcon },
    { path: '/add', label: 'Add', icon: AddIcon },
    { path: '/bookings', label: 'Bookings', icon: BookIcon },
    { path: '/chat', label: 'Chat', icon: ChatIcon },
    { path: '/profile', label: 'Profile', icon: PersonIcon },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
      <div className="bg-white rounded-full shadow-xl px-6 py-3 mx-4 flex items-center space-x-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (item.path === '/explore' && location.pathname.startsWith('/search'));

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center px-3 py-2 rounded-full transition-all duration-200 ${
                isActive 
                  ? 'bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-md transform scale-105' 
                  : 'text-gray-500 hover:text-teal-600 hover:bg-gray-100'
              }`}
            >
              <Icon className={`h-5 w-5 mb-0.5 ${isActive ? 'h-6 w-6' : ''}`} />
              <span className={`text-xs font-medium ${isActive ? 'text-sm' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;

// Export all icons for consistent use across the app
export { HomeIcon, SearchIcon, AddIcon, BookIcon, PersonIcon, ChatIcon };
