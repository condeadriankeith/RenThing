import React, { createContext, useState, useContext, useEffect } from 'react';

const BookingContext = createContext();

export const useBookings = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching bookings from backend
    const fetchBookings = () => {
      // Mock data - in a real app, you would fetch from your backend
      const mockBookings = [
        {
          id: 1,
          title: 'Canon EOS R5 Camera',
          description: 'Professional mirrorless camera with 45MP sensor',
          start_date: '2023-06-15',
          end_date: '2023-06-20',
          price: 45,
          status: 'active',
          image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&h=300',
          owner: 'John D.'
        },
        {
          id: 2,
          title: 'Mountain Bike',
          description: 'Full suspension mountain bike, perfect for trails',
          start_date: '2023-05-10',
          end_date: '2023-05-15',
          price: 25,
          status: 'completed',
          image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=400&h=300',
          owner: 'Sarah M.'
        },
        {
          id: 3,
          title: 'Power Drill Set',
          description: 'Cordless drill with multiple bits and attachments',
          start_date: '2023-07-01',
          end_date: '2023-07-05',
          price: 15,
          status: 'pending',
          image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=400&h=300',
          owner: 'Mike T.'
        }
      ];
      
      setBookings(mockBookings);
      setLoading(false);
    };

    setTimeout(() => {
      fetchBookings();
    }, 1000); // Simulate network delay
  }, []);

  const getActiveBookings = () => {
    return bookings.filter(booking => booking.status === 'active');
  };

  const getPastBookings = () => {
    return bookings.filter(booking => booking.status === 'completed');
  };

  const getIncomingBookings = () => {
    return bookings.filter(booking => booking.status === 'pending');
  };

  const addBooking = (newBooking) => {
    const booking = {
      ...newBooking,
      id: Date.now()
    };
    setBookings(prev => [...prev, booking]);
  };

  const updateBookingStatus = (id, status) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status } : booking
      )
    );
  };

  const value = {
    bookings,
    loading,
    getActiveBookings,
    getPastBookings,
    getIncomingBookings,
    addBooking,
    updateBookingStatus
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};
