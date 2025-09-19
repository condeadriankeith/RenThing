#!/usr/bin/env node

// Seed script to populate the database with initial data

require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

// Sample data for listings
const categories = [
  'Electronics', 'Furniture', 'Sports & Outdoors', 'Tools', 'Clothing',
  'Books', 'Toys & Games', 'Home & Garden', 'Automotive', 'Music & Instruments',
  'Appliances', 'Health & Beauty', 'Office Supplies', 'Baby & Kids', 'Pet Supplies'
];

const locations = [
  'Bacolod City', 'Silay City', 'Talisay City', 'Bago City', 'Cadiz City',
  'Escalante City', 'Himamaylan City', 'Kabankalan City', 'La Carlota City', 'Sipalay City',
  'Victorias City', 'Binalbagan', 'Calatrava', 'Candoni', 'Cauayan', 'Enrique B. Magalona',
  'Hinigaran', 'Hinoba-an', 'Ilog', 'Isabela', 'La Castellana', 'Manapla', 'Moises Padilla',
  'Murcia', 'Pontevedra', 'Pulupandan', 'Salvador Benedicto', 'San Enrique', 'Toboso', 'Valladolid'
];

const itemTitles = [
  // Electronics
  'Smartphone', 'Laptop', 'Tablet', 'Smart TV', 'Bluetooth Speaker', 'Gaming Console', 'Camera', 'Headphones',
  'Smart Watch', 'Power Bank', 'Wireless Earbuds', 'Projector', 'Drone', 'VR Headset', 'Action Camera',
  
  // Furniture
  'Sofa Set', 'Dining Table', 'Office Chair', 'Bookshelf', 'Wardrobe', 'Bed Frame', 'Mattress', 'Desk',
  'Coffee Table', 'TV Stand', 'Dresser', 'Nightstand', 'Recliner', 'Armchair', 'Cabinet',
  
  // Sports & Outdoors
  'Mountain Bike', 'Treadmill', 'Yoga Mat', 'Dumbbell Set', 'Tennis Racket', 'Basketball', 'Soccer Ball',
  'Swimming Goggles', 'Camping Tent', 'Sleeping Bag', 'Backpack', 'Hiking Boots', 'Fishing Rod', 'Golf Clubs',
  'Skateboard',
  
  // Tools
  'Power Drill', 'Circular Saw', 'Toolbox', 'Ladder', 'Generator', 'Pressure Washer', 'Leaf Blower', 'Chainsaw',
  'Welding Machine', 'Air Compressor', 'Angle Grinder', 'Rotary Tool', 'Impact Driver', 'Reciprocating Saw',
  'Table Saw',
  
  // Clothing
  'Designer Jacket', 'Formal Suit', 'Wedding Dress', 'Evening Gown', 'Leather Boots', 'Winter Coat', 'Sunglasses',
  'Handbag', 'Watch', 'Jewelry Set', 'Costume', 'Uniform', 'Sports Jersey', 'Hiking Gear', 'Raincoat',
  
  // Books
  'Textbook Set', 'Fiction Collection', 'Cookbook', 'Art Book', 'Biography Collection', 'Children\'s Books',
  'Science Books', 'History Books', 'Philosophy Books', 'Poetry Collection', 'Magazine Bundle', 'Comic Books',
  'Religious Books', 'Self-Help Books', 'Language Learning Books',
  
  // Toys & Games
  'Board Game Collection', 'Video Game Console', 'RC Car', 'Dollhouse', 'LEGO Set', 'Puzzle Collection',
  'Action Figures', 'Stuffed Animals', 'Musical Instruments for Kids', 'Educational Toys', 'Outdoor Toys',
  'Building Blocks', 'Art Supplies', 'Science Kit', 'Robot Kit',
  
  // Home & Garden
  'Lawn Mower', 'Garden Tools', 'Patio Furniture', 'Grill', 'Hot Tub', 'Swing Set', 'Greenhouse', 'Fountain',
  'Solar Lights', 'Garden Decor', 'Planters', 'Hammock', 'Fire Pit', 'Outdoor Heater', 'Umbrella',
  
  // Automotive
  'Car Jack', 'Tool Kit', 'Jump Starter', 'Car Vacuum', 'Seat Covers', 'Floor Mats', 'Car Stereo', 'GPS Navigator',
  'Dash Cam', 'Tire Inflator', 'Car Wash Kit', 'Emergency Kit', 'Roof Rack', 'Bike Rack', 'Trailer',
  
  // Music & Instruments
  'Acoustic Guitar', 'Electric Guitar', 'Keyboard', 'Drum Set', 'Violin', 'Saxophone', 'Microphone', 'Amplifier',
  'DJ Equipment', 'Karaoke Machine', 'Turntable', 'Studio Monitors', 'Audio Interface', 'MIDI Controller',
  'Digital Piano'
];

const itemDescriptions = [
  'Brand new and in excellent condition',
  'Like new with minimal use',
  'Good condition, minor wear and tear',
  'Well-maintained with original packaging',
  'High-quality item perfect for your needs',
  'Durable and reliable for long-term use',
  'Perfect for beginners and experienced users',
  'Professional grade equipment',
  'Latest model with all accessories included',
  'Gently used but functions perfectly',
  'Great value for money',
  'Ideal for home or commercial use',
  'Comes with warranty and user manual',
  'Energy efficient and eco-friendly',
  'Compact and easy to store'
];

async function main() {
  console.log('Seeding database...');
  
  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@renthing.com' },
    update: {},
    create: {
      email: 'admin@renthing.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'admin'
    }
  });
  console.log('✅ Created/updated admin user:', adminUser.email);
  
  // Create vendor user
  const vendorUser = await prisma.user.upsert({
    where: { email: 'vendor@renthing.com' },
    update: {},
    create: {
      email: 'vendor@renthing.com',
      password: await bcrypt.hash('vendor123', 10),
      name: 'Vendor User',
      role: 'vendor'
    }
  });
  console.log('✅ Created/updated vendor user:', vendorUser.email);
  
  // Create regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@renthing.com' },
    update: {},
    create: {
      email: 'user@renthing.com',
      password: await bcrypt.hash('user123', 10),
      name: 'Regular User',
      role: 'user'
    }
  });
  console.log('✅ Created/updated regular user:', regularUser.email);
  
  // Create 100 listings
  console.log('Creating 100 listings...');
  for (let i = 0; i < 100; i++) {
    // Randomly select category, location, title, and description
    const category = categories[Math.floor(Math.random() * categories.length)];
    const location = locations[Math.floor(Math.random() * locations.length)];
    const title = itemTitles[Math.floor(Math.random() * itemTitles.length)];
    const description = itemDescriptions[Math.floor(Math.random() * itemDescriptions.length)];
    
    // Generate random price in PHP (₱100 - ₱5000)
    const price = Math.floor(Math.random() * 4900) + 100;
    
    // Random price unit
    const priceUnits = ['per day', 'per week', 'per month', 'fixed price'];
    const priceUnit = priceUnits[Math.floor(Math.random() * priceUnits.length)];
    
    const listing = await prisma.listing.create({
      data: {
        title: `${title} #${i + 1}`,
        description: `${description} - ${title} for rent in ${location}, Negros Occidental. Perfect for your needs!`,
        price: parseFloat(price.toFixed(2)),
        location: location,
        category: category,
        priceUnit: priceUnit,
        ownerId: vendorUser.id
      }
    });
    
    if ((i + 1) % 20 === 0) {
      console.log(`✅ Created ${i + 1} listings so far...`);
    }
  }
  
  console.log('✅ Created 100 listings');
  
  // Verify the listings were created
  const listingCount = await prisma.listing.count();
  console.log(`📊 Total listings in database: ${listingCount}`);
  
  // Verify there are 0 bookings, reviews, and wishlists
  const bookingCount = await prisma.booking.count();
  const reviewCount = await prisma.review.count();
  const wishlistCount = await prisma.wishlist.count();
  
  console.log(`📊 Current bookings: ${bookingCount}`);
  console.log(`📊 Current reviews: ${reviewCount}`);
  console.log(`📊 Current wishlists: ${wishlistCount}`);
  
  console.log('Database seeding completed!');
  console.log('✅ 1 admin user created');
  console.log('✅ 1 vendor user created');
  console.log('✅ 1 regular user created');
  console.log('✅ 100 listings created (all in Bacolod City/Negros Occidental)');
  console.log('✅ All prices in Philippine Pesos (₱)');
  console.log('✅ 0 bookings, 0 reviews, 0 wishlists (as requested)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });