import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ListingContext = createContext();

export const useListings = () => {
  return useContext(ListingContext);
};

const PEXELS_API_KEY = 'S6YsEWf484ZrbOFrIVqU92AGsBlpMX8MomXebcBPmzUw9Wk8lhc1kKOV';

export const ListingProvider = ({ children }) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImagesAndListings = async () => {
      try {
        const queries = ['electronics', 'sports', 'tools', 'fashion', 'home', 'vehicles', 'books', 'music', 'art', 'garden'];
        const fetchedListings = [];

        for (let i = 0; i < 20; i++) { // Fetch 20 listings
          const query = queries[Math.floor(Math.random() * queries.length)];
          const response = await axios.get(`https://api.pexels.com/v1/search?query=${query}&per_page=1`, {
            headers: {
              Authorization: PEXELS_API_KEY,
            },
          });

          const photo = response.data.photos[0];
          if (photo) {
            fetchedListings.push({
              id: Date.now() + i,
              title: `Sample ${query} Item ${i + 1}`,
              description: `This is a high-quality ${query} item available for rent. It's perfect for your needs.`,
              price_per_day: Math.floor(Math.random() * 50) + 10,
              category: query.charAt(0).toUpperCase() + query.slice(1),
              image: photo.src.medium,
              owner: `User ${String.fromCharCode(65 + i)}.`,
              rating: (Math.random() * (5.0 - 3.5) + 3.5).toFixed(1),
              location: `City ${String.fromCharCode(65 + i)}`,
              reviews: Math.floor(Math.random() * 100) + 5
            });
          }
        }
        setListings(fetchedListings);
      } catch (error) {
        console.error('Error fetching images from Pexels:', error);
        // Fallback to mock data if API fails
        const mockListings = [
          {
            id: 1,
            title: 'Canon EOS R5 Camera',
            description: 'Professional mirrorless camera with 45MP sensor',
            price_per_day: 45,
            category: 'Electronics',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&h=300',
            owner: 'John D.',
            rating: 4.9,
            location: 'New York',
            reviews: 87
          },
          {
            id: 2,
            title: 'Mountain Bike',
            description: 'Full suspension mountain bike, perfect for trails',
            price_per_day: 25,
            category: 'Sports',
            image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=400&h=300',
            owner: 'Sarah M.',
            rating: 4.7,
            location: 'Los Angeles',
            reviews: 123
          },
          {
            id: 3,
            title: 'Power Drill Set',
            description: 'Cordless drill with multiple bits and attachments',
            price_per_day: 15,
            category: 'Tools',
            image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=400&h=300',
            owner: 'Mike T.',
            rating: 4.8,
            location: 'Chicago',
            reviews: 55
          },
          {
            id: 4,
            title: 'Designer Handbag',
            description: 'Genuine leather handbag from a premium brand',
            price_per_day: 35,
            category: 'Fashion',
            image: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?auto=format&fit=crop&w=400&h=300',
            owner: 'Emma L.',
            rating: 5.0,
            location: 'Houston',
            reviews: 200
          }
        ];
        setListings(mockListings);
      }
      setLoading(false);
    };

    fetchImagesAndListings();
  }, []);

  const addListing = (newListing) => {
    const listing = {
      ...newListing,
      id: Date.now(),
      image: newListing.image || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&h=300",
      owner: newListing.owner || "You",
      rating: newListing.rating || 5.0,
      location: newListing.location || 'Unknown',
      reviews: newListing.reviews || 0
    };
    setListings(prev => [...prev, listing]);
  };

  const updateListing = (id, updatedListing) => {
    setListings(prev => 
      prev.map(listing => 
        listing.id === id ? { ...listing, ...updatedListing } : listing
      )
    );
  };

  const deleteListing = (id) => {
    setListings(prev => prev.filter(listing => listing.id !== id));
  };

  const value = {
    listings,
    loading,
    addListing,
    updateListing,
    deleteListing
  };

  return (
    <ListingContext.Provider value={value}>
      {children}
    </ListingContext.Provider>
  );
};
