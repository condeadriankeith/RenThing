#!/usr/bin/env node

// Verification script to check that listings were created correctly

require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function verifyListings() {
  try {
    console.log('Verifying listings...');
    
    // Get total count
    const totalCount = await prisma.listing.count();
    console.log(`Total listings: ${totalCount}`);
    
    // Check a sample of listings
    const sampleListings = await prisma.listing.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('\nSample listings:');
    sampleListings.forEach(listing => {
      console.log(`- ${listing.title} (${listing.category})`);
      console.log(`  Location: ${listing.location}`);
      console.log(`  Price: ₱${listing.price} ${listing.priceUnit}`);
      console.log(`  Owner ID: ${listing.ownerId.substring(0, 8)}...`);
      console.log('');
    });
    
    // Verify all locations are in Negros Occidental
    const allListings = await prisma.listing.findMany();
    const validLocations = [
      'Bacolod City', 'Silay City', 'Talisay City', 'Bago City', 'Cadiz City',
      'Escalante City', 'Himamaylan City', 'Kabankalan City', 'La Carlota City', 'Sipalay City',
      'Victorias City', 'Binalbagan', 'Calatrava', 'Candoni', 'Cauayan', 'Enrique B. Magalona',
      'Hinigaran', 'Hinoba-an', 'Ilog', 'Isabela', 'La Castellana', 'Manapla', 'Moises Padilla',
      'Murcia', 'Pontevedra', 'Pulupandan', 'Salvador Benedicto', 'San Enrique', 'Toboso', 'Valladolid'
    ];
    
    let validLocationCount = 0;
    const invalidLocations = [];
    
    allListings.forEach(listing => {
      if (validLocations.includes(listing.location)) {
        validLocationCount++;
      } else {
        invalidLocations.push(listing.location);
      }
    });
    
    console.log(`Listings with valid locations: ${validLocationCount}/${totalCount}`);
    if (invalidLocations.length > 0) {
      console.log('Invalid locations found:', [...new Set(invalidLocations)]);
    } else {
      console.log('✅ All listings have valid locations in Negros Occidental');
    }
    
    // Verify all prices are positive
    let validPriceCount = 0;
    allListings.forEach(listing => {
      if (listing.price > 0) {
        validPriceCount++;
      }
    });
    
    console.log(`Listings with valid prices: ${validPriceCount}/${totalCount}`);
    if (validPriceCount === totalCount) {
      console.log('✅ All listings have valid positive prices');
    }
    
    // Verify counts for related entities
    const bookingCount = await prisma.booking.count();
    const reviewCount = await prisma.review.count();
    const wishlistCount = await prisma.wishlist.count();
    
    console.log(`\nRelated entity counts:`);
    console.log(`- Bookings: ${bookingCount}`);
    console.log(`- Reviews: ${reviewCount}`);
    console.log(`- Wishlists: ${wishlistCount}`);
    
    if (bookingCount === 0 && reviewCount === 0 && wishlistCount === 0) {
      console.log('✅ All related entities correctly set to zero');
    }
    
    console.log('\n✅ Verification completed successfully!');
    
  } catch (error) {
    console.error('Error verifying listings:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyListings();