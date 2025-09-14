#!/usr/bin/env node

// Migration script to convert CSV data to Edge Config format
// This script can be used to populate Edge Config with initial data

const { edgeConfigDB } = require('../lib/edge-config/edge-config-db');

async function migrateData() {
  try {
    console.log('Starting migration to Edge Config...');
    
    // Sample users data
    const users = [
      {
        id: 'user_1',
        email: 'adriankeithconde@gmail.com',
        name: 'Adrian Conde',
        password: '$2a$10$example_hashed_password', // This should be properly hashed
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'user_2',
        email: 'roelslumauagjr@gmail.com',
        name: 'Roel Slumauag',
        password: '$2a$10$example_hashed_password', // This should be properly hashed
        role: 'ADMIN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'user_3',
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: '$2a$10$example_hashed_password', // This should be properly hashed
        role: 'USER',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Sample listings data
    const listings = [
      {
        id: 'listing_1',
        title: 'MacBook Pro 16-inch',
        description: '2023 MacBook Pro with M2 Max chip, 32GB RAM, 1TB SSD. Perfect for video editing and software development.',
        price: 150.00,
        location: 'Makati City',
        images: JSON.stringify([
          'https://example.com/macbook-1.jpg',
          'https://example.com/macbook-2.jpg'
        ]),
        features: JSON.stringify([
          'M2 Max Chip',
          '32GB RAM',
          '1TB SSD',
          '16-inch Display'
        ]),
        ownerId: 'user_1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'listing_2',
        title: 'Tesla Model 3',
        description: '2022 Tesla Model 3 Long Range. Electric vehicle with autopilot features. Perfect for eco-friendly transportation.',
        price: 2500.00,
        location: 'Taguig City',
        images: JSON.stringify([
          'https://example.com/tesla-1.jpg',
          'https://example.com/tesla-2.jpg'
        ]),
        features: JSON.stringify([
          'Electric Vehicle',
          'Autopilot',
          'Long Range',
          'Premium Interior'
        ]),
        ownerId: 'user_2',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'listing_3',
        title: 'Professional Camera Kit',
        description: 'Canon EOS R5 with 24-70mm lens, tripod, and lighting kit. Perfect for professional photography.',
        price: 200.00,
        location: 'Quezon City',
        images: JSON.stringify([
          'https://example.com/camera-1.jpg',
          'https://example.com/camera-2.jpg'
        ]),
        features: JSON.stringify([
          '45MP Sensor',
          '8K Video',
          'In-body Stabilization',
          'Professional Lens'
        ]),
        ownerId: 'user_3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    
    // Insert users
    console.log('Migrating users...');
    for (const user of users) {
      await edgeConfigDB.create('user', user);
    }
    
    // Insert listings
    console.log('Migrating listings...');
    for (const listing of listings) {
      await edgeConfigDB.create('listing', listing);
    }
    
    console.log('Migration completed successfully!');
    console.log(`Migrated ${users.length} users and ${listings.length} listings.`);
    
    // Verify migration
    const userCount = await edgeConfigDB.count('user');
    const listingCount = await edgeConfigDB.count('listing');
    
    console.log(`Verification: ${userCount} users and ${listingCount} listings in Edge Config.`);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if script is called directly
if (require.main === module) {
  migrateData();
}

module.exports = { migrateData };