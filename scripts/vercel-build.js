#!/usr/bin/env node

// This script handles the Vercel build process gracefully
// It generates the Prisma client without requiring a database connection during build

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runBuild() {
  try {
    console.log('Starting build process...');
    
    // Generate Prisma client (this should work without DB connection)
    console.log('Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    // Build Next.js app
    console.log('Building Next.js app...');
    execSync('next build', { stdio: 'inherit' });
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

runBuild();