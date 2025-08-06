const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Pexels API configuration
const PEXELS_API_KEY = 'S6YsEWf484ZrbOFrIVqU92AGsBlpMX8MomXebcBPmzUw9Wk8lhc1kKOV';
const PEXELS_BASE_URL = 'https://api.pexels.com/v1';

// Sample listing data
const categories = [
  'Electronics', 'Vehicles', 'Home & Garden', 'Sports & Outdoors', 
  'Tools & Equipment', 'Party & Events', 'Fashion', 'Books & Media',
  'Toys & Games', 'Musical Instruments', 'Photography', 'Travel'
];

const locations = [
  'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX',
  'Phoenix, AZ', 'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA',
  'Dallas, TX', 'San Jose, CA', 'Austin, TX', 'Jacksonville, FL'
];

const features = [
  'Free delivery', 'Insurance included', '24/7 support', 'Flexible pickup',
  'Discount for long-term', 'Professional setup', 'Cleaning included',
  'Technical support', 'Same-day delivery'
];

const descriptions = {
  Electronics: [
    'Latest model with advanced features and excellent condition',
    'Professional-grade equipment perfect for content creators',
    'High-performance device with extended battery life',
    'Premium quality with all accessories included'
  ],
  Vehicles: [
    'Well-maintained vehicle with comprehensive insurance',
    'Fuel-efficient and reliable transportation option',
    'Luxury features with advanced safety systems',
    'Perfect for city driving and long trips'
  ],
  'Home & Garden': [
    'Professional-grade tools for all your gardening needs',
    'Beautiful furniture pieces to enhance any space',
    'Complete setup for outdoor entertaining',
    'Energy-efficient appliances in excellent condition'
  ]
};

const generateListings = async () => {
  const listings = [];
  
  for (let i = 0; i < 60; i++) {
    const category = categories[i % categories.length];
    const location = locations[i % locations.length];
    const price = Math.floor(Math.random() * 500) + 20;
    const rating = (Math.random() * 2 + 3).toFixed(1);
    
    // Generate realistic listing data
    const listing = {
      id: i + 1,
      title: `${category} Rental - ${generateTitle(category)}`,
      description: generateDescription(category),
      category,
      location,
      price_per_day: price,
      price_per_week: price * 6,
      price_per_month: price * 25,
      images: [`https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=300&fit=crop`],
      thumbnail: `https://images.unsplash.com/photo-${1500000000000 + i}?w=400&h=300&fit=crop`,
      rating: parseFloat(rating),
      reviews_count: Math.floor(Math.random() * 50) + 5,
      features: getRandomFeatures(),
      availability: true,
      owner_id: Math.floor(Math.random() * 20) + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    listings.push(listing);
  }
  
  return listings;
};

const generateTitle = (category) => {
  const titles = {
    Electronics: ['Premium Camera', 'Gaming Laptop', 'Smartphone', 'Tablet', 'Drone', 'Headphones'],
    Vehicles: ['Sedan', 'SUV', 'Motorcycle', 'Electric Scooter', 'Bicycle', 'Van'],
    'Home & Garden': ['Lawn Mower', 'Power Tools', 'Furniture Set', 'BBQ Grill', 'Garden Tools', 'Appliances']
  };
  
  const categoryTitles = titles[category] || ['Rental Item'];
  return categoryTitles[Math.floor(Math.random() * categoryTitles.length)];
};

const generateDescription = (category) => {
  const descs = descriptions[category] || ['High-quality rental item in excellent condition'];
  return descs[Math.floor(Math.random() * descs.length)];
};

const getRandomFeatures = () => {
  const shuffled = [...features].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * 4) + 2);
};

// Main execution
const main = async () => {
  console.log('Generating sample listings...');
  const listings = await generateListings();
  
  // Save to file
  const outputPath = path.join(__dirname, '../src/data/sampleListings.json');
  fs.writeFileSync(outputPath, JSON.stringify(listings, null, 2));
  
  console.log(`✅ Generated ${listings.length} sample listings`);
  console.log(`📁 Saved to ${outputPath}`);
};

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateListings };
