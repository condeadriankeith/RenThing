#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing MariaDB connection...');
    
    // Test database connection by fetching users
    const users = await prisma.user.findMany({
      take: 5,
    });
    
    console.log(`✅ Successfully connected to MariaDB database`);
    console.log(`✅ Found ${users.length} users in the database`);
    
    if (users.length > 0) {
      console.log('Sample users:');
      users.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }
    
    // Test fetching listings
    const listings = await prisma.listing.findMany({
      take: 5,
    });
    
    console.log(`✅ Found ${listings.length} listings in the database`);
    
    if (listings.length > 0) {
      console.log('Sample listings:');
      listings.forEach(listing => {
        console.log(`  - ${listing.title} (${listing.category}) - $${listing.price}/${listing.priceUnit}`);
      });
    }
    
    console.log('\n🎉 All tests passed! Database connection is working properly.');
  } catch (error) {
    console.error('❌ Error connecting to database:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();