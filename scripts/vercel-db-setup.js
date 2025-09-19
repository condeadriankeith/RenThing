#!/usr/bin/env node

// This script handles database setup for Vercel deployments with Supabase
// It checks if we're using a Supabase database and runs migrations if needed

const { execSync } = require('child_process');

function setupDatabase() {
  try {
    console.log('Setting up database for deployment...');
    
    // Check if DATABASE_URL is set
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.log('No DATABASE_URL found, skipping database setup');
      return;
    }
    
    console.log(`Database URL: ${databaseUrl.substring(0, 50)}...`);
    
    // Check if it's a Supabase/PostgreSQL database
    if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
      console.log('PostgreSQL database detected, running migrations...');
      
      // Run Prisma migrations
      console.log('Running Prisma migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      
      // Seed the database with initial data
      console.log('Seeding database with initial data...');
      execSync('npx prisma db seed', { stdio: 'inherit' });
      
      console.log('Database setup completed successfully!');
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