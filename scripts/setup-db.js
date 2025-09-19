#!/usr/bin/env node

// This script is no longer needed as we're using Supabase directly
console.log('✅ Database setup is handled by Supabase');
console.log('📍 Using Supabase as the database provider');
console.log('🔗 Connection configured through DATABASE_URL environment variable');

const fs = require('fs');
const path = require('path');

// Load the Prisma config
const configPath = path.join(__dirname, '..', 'prisma', 'config.js');
const config = require(configPath);

// Get the database URL based on environment
const databaseUrl = config.getDatabaseUrl();

// Write to .env file
const envPath = path.join(__dirname, '..', '.env');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
}

// Check if DATABASE_URL is already set
if (envContent.includes('DATABASE_URL=')) {
  // Replace existing DATABASE_URL
  envContent = envContent.replace(/DATABASE_URL=.*/, `DATABASE_URL="${databaseUrl}"`);
} else {
  // Add DATABASE_URL
  envContent += `\nDATABASE_URL="${databaseUrl}"`;
}

// Write back to .env file
fs.writeFileSync(envPath, envContent.trim());

console.log('✅ Database URL set successfully!');
console.log(`📍 Using: ${process.env.NODE_ENV === 'production' ? 'Supabase (Production)' : 'SQLite (Development)'}`);
console.log(`🔗 URL: ${databaseUrl}`);
