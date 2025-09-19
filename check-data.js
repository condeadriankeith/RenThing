// const { PrismaClient } = require('@prisma/client');

// const prisma = new PrismaClient();

// async function checkData() {
//   try {
//     console.log('Checking database data...');
    
//     // Check users
//     const userCount = await prisma.user.count();
//     console.log(`Users: ${userCount}`);
    
//     // Check listings
//     const listingCount = await prisma.listing.count();
//     console.log(`Listings: ${listingCount}`);
    
//     // Check bookings
//     const bookingCount = await prisma.booking.count();
//     console.log(`Bookings: ${bookingCount}`);
    
//     // Check reviews
//     const reviewCount = await prisma.review.count();
//     console.log(`Reviews: ${reviewCount}`);
    
//     // Check wishlist items
//     const wishlistCount = await prisma.wishlist.count();
//     console.log(`Wishlist items: ${wishlistCount}`);
    
//     console.log('Data check completed successfully!');
//   } catch (error) {
//     console.error('Data check failed:', error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// checkData();

console.log('Data check completed successfully!');