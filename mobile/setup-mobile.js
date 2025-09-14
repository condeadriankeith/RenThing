#!/usr/bin/env node

// Mobile App Setup Script
// This script helps set up the mobile app dependencies

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 RenThing Mobile App Setup Script');
console.log('=====================================\n');

// Check if we're in the mobile directory
const currentDir = process.cwd();
const mobileDir = path.join(__dirname);

if (currentDir !== mobileDir) {
  console.log('Please run this script from the mobile directory:');
  console.log(`cd ${mobileDir}`);
  process.exit(1);
}

// Function to run a command
function runCommand(command, description) {
  try {
    console.log(`⏳ ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completed successfully!\n`);
  } catch (error) {
    console.error(`❌ Failed to ${description.toLowerCase()}:`, error.message);
    process.exit(1);
  }
}

// Check if node_modules exists
const nodeModulesExists = fs.existsSync(path.join(mobileDir, 'node_modules'));

if (nodeModulesExists) {
  console.log('📁 node_modules directory found');
  console.log('💡 You might want to reinstall dependencies to ensure everything is up to date\n');
  
  const answer = require('readline-sync').question('Do you want to reinstall dependencies? (y/N): ');
  if (answer.toLowerCase() === 'y') {
    console.log('\n🗑️  Removing existing node_modules and package-lock.json...');
    try {
      if (process.platform === 'win32') {
        execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
        execSync('del package-lock.json', { stdio: 'inherit' });
      } else {
        execSync('rm -rf node_modules package-lock.json', { stdio: 'inherit' });
      }
      console.log('✅ Cleanup completed!\n');
    } catch (error) {
      console.error('❌ Failed to clean up:', error.message);
    }
  }
} else {
  console.log('📁 node_modules directory not found');
  console.log('🔧 Proceeding with fresh installation\n');
}

// Install dependencies
runCommand('npm install', 'Installing dependencies');

// Check if Expo CLI is installed
try {
  execSync('expo --version', { stdio: 'ignore' });
  console.log('✅ Expo CLI is already installed\n');
} catch (error) {
  console.log(' Expo CLI not found, installing...');
  runCommand('npm install -g expo-cli', 'Installing Expo CLI globally');
}

console.log('🎉 Mobile app setup completed successfully!');
console.log('\nTo start the development server, run:');
console.log('npm start\n');
console.log('Or for specific platforms:');
console.log('npm run android  # For Android');
console.log('npm run ios      # For iOS');
console.log('npm run web      # For Web');