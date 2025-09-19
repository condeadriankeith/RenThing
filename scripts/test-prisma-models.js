#!/usr/bin/env node

// This script tests that all Prisma models are working correctly

require('dotenv').config({ path: '.env.local' });

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrismaModels() {
  try {
    console.log('Testing Prisma models...');
    
    // Test creating a user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      }
    });
    console.log('✅ Created user:', user.email);
    
    // Test creating a listing
    const listing = await prisma.listing.create({
      data: {
        title: 'Test Item',
        description: 'This is a test item',
        price: 100.0,
        location: 'Test City',
        category: 'Electronics',
        priceUnit: 'per day',
        ownerId: user.id
      }
    });
    console.log('✅ Created listing:', listing.title);
    
    // Test creating a booking
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        listingId: listing.id,
        startDate: tomorrow,
        endDate: nextWeek,
        status: 'pending'
      }
    });
    console.log('✅ Created booking:', booking.id);
    
    // Test creating a review
    const review = await prisma.review.create({
      data: {
        userId: user.id,
        listingId: listing.id,
        rating: 5,
        comment: 'Great item!'
      }
    });
    console.log('✅ Created review with rating:', review.rating);
    
    // Test creating a wishlist item
    const wishlist = await prisma.wishlist.create({
      data: {
        userId: user.id,
        listingId: listing.id
      }
    });
    console.log('✅ Created wishlist item:', wishlist.id);
    
    // Test querying with relations
    const userWithListings = await prisma.user.findUnique({
      where: { id: user.id },
      include: { listings: true }
    });
    console.log('✅ User with listings:', userWithListings.listings.length, 'listings');
    
    console.log('All Prisma models are working correctly!');
  } catch (error) {
    console.error('Error testing Prisma models:', error.message);
    console.error('Error stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testPrismaModels();