#!/usr/bin/env node

// This script handles database setup for Vercel deployments
// It checks if we're using a PostgreSQL database and runs migrations if needed

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function setupDatabase() {
  try {
    console.log('Setting up database for Vercel deployment...');
    
    // Check if DATABASE_URL is set
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.log('No DATABASE_URL found, skipping database setup');
      return;
    }
    
    console.log(`Database URL: ${databaseUrl.substring(0, 50)}...`);
    
    // Check if it's a PostgreSQL database
    if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
      console.log('PostgreSQL database detected, running migrations...');
      
      // Run Prisma migrations
      console.log('Running Prisma migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      
      console.log('Database setup completed successfully!');
    } else if (databaseUrl.startsWith('file:')) {
      console.log('SQLite database detected, no migrations needed');
    } else {
      console.log('Unknown database type, skipping migrations');
    }
  } catch (error) {
    console.error('Database setup failed:', error.message);
    console.error('Error stack:', error.stack);
    // Don't exit with error code as this might break the build
  }
}

setupDatabase();