#!/usr/bin/env node

// This script tests the database connection and verifies that the admin user exists

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Set PRISMA_SCHEMA environment variable to use local schema
process.env.PRISMA_SCHEMA = './prisma/schema.prisma';

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

async function testDatabaseConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing database connection...');
    
    // Test connection by querying the database
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Check if admin user exists
    const adminUser = await prisma.user.findUnique({
      where: {
        email: 'admin@renthing.com'
      }
    });
    
    if (adminUser) {
      console.log('✅ Admin user found:', adminUser.email);
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare('admin123', adminUser.password);
      if (isPasswordValid) {
        console.log('✅ Admin password verification successful');
      } else {
        console.log('❌ Admin password verification failed');
      }
    } else {
      console.log('❌ Admin user not found');
    }
    
    // Check if vendor user exists
    const vendorUser = await prisma.user.findUnique({
      where: {
        email: 'vendor@renthing.com'
      }
    });
    
    if (vendorUser) {
      console.log('✅ Vendor user found:', vendorUser.email);
    } else {
      console.log('❌ Vendor user not found');
    }
    
    // Check if regular user exists
    const regularUser = await prisma.user.findUnique({
      where: {
        email: 'user@renthing.com'
      }
    });
    
    if (regularUser) {
      console.log('✅ Regular user found:', regularUser.email);
    } else {
      console.log('❌ Regular user not found');
    }
    
    console.log('Database test completed successfully!');
  } catch (error) {
    console.error('Database test failed:', error.message);
    console.error('Error stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();