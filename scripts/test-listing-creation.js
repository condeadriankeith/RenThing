#!/usr/bin/env node

// This script tests the listing creation functionality

// Load environment variables
require('dotenv').config({ path: '.env.test' });

const { PrismaClient } = require('@prisma/client');

async function testListingCreation() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing listing creation functionality...');
    
    // Find a vendor user to create a listing
    const vendor = await prisma.user.findFirst({
      where: {
        role: 'vendor'
      }
    });
    
    if (!vendor) {
      console.log('❌ No vendor user found');
      return;
    }
    
    console.log('✅ Vendor user found:', vendor.email);
    
    // Create a test listing
    const newListing = await prisma.listing.create({
      data: {
        title: 'Test Listing',
        description: 'This is a test listing created by the test script',
        price: 19.99,
        location: 'Test City, Test Country',
        category: 'Test Category',
        priceUnit: 'per day',
        ownerId: vendor.id,
      }
    });
    
    console.log('✅ Listing created successfully');
    console.log('Listing ID:', newListing.id);
    console.log('Listing Title:', newListing.title);
    
    // Verify the listing was created
    const createdListing = await prisma.listing.findUnique({
      where: {
        id: newListing.id
      }
    });
    
    if (createdListing) {
      console.log('✅ Listing verification successful');
    } else {
      console.log('❌ Listing verification failed');
    }
    
    console.log('Listing creation test completed successfully!');
  } catch (error) {
    console.error('Listing creation test failed:', error.message);
    console.error('Error stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testListingCreation();