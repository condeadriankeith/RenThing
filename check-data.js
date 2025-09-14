const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
  try {
    // Check if there are any users
    const users = await prisma.user.findMany();
    console.log('Users:', users);

    // Check if there are any listings
    const listings = await prisma.listing.findMany();
    console.log('Listings:', listings);

    // Check if there are any reviews
    const reviews = await prisma.review.findMany();
    console.log('Reviews:', reviews);

    // Check if there are any bookings
    const bookings = await prisma.booking.findMany();
    console.log('Bookings:', bookings);

    // Check if there are any wishlist items
    const wishlistItems = await prisma.wishlist.findMany();
    console.log('Wishlist Items:', wishlistItems);

    // Check if there are any achievements
    const achievements = await prisma.achievement.findMany();
    console.log('Achievements:', achievements);
  } catch (error) {
    console.error('Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();