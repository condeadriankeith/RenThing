#!/usr/bin/env node

// This script handles database setup for Vercel deployments
// It checks if we're using a PostgreSQL database and runs migrations if needed

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function setupDatabase() {
  try {
    console.log('Setting up database for deployment...');
    
    // Check if DATABASE_URL is set
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.log('No DATABASE_URL found, using default SQLite configuration');
      return;
    }
    
    console.log(`Database URL: ${databaseUrl.substring(0, 50)}...`);
    
    // Check if it's a PostgreSQL database
    if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
      console.log('PostgreSQL database detected, running migrations...');
      
      // Run Prisma migrations
      console.log('Running Prisma migrations...');
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      
      // Seed the database with initial data
      console.log('Seeding database with initial data...');
      execSync('npx prisma db seed', { stdio: 'inherit' });
      
      console.log('Database setup completed successfully!');
    } else if (databaseUrl.startsWith('file:')) {
      console.log('SQLite database detected');
      console.log('Note: SQLite is not recommended for production deployments');
      
      // For Vercel deployments with SQLite, we need to ensure the file exists
      // but migrations are not needed as the schema is embedded
      const filePath = databaseUrl.replace('file:', '');
      console.log(`Checking SQLite file: ${filePath}`);
      
      // Create directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
      
      console.log('SQLite setup completed!');
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