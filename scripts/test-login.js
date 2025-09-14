#!/usr/bin/env node

// This script tests the login functionality with the admin credentials

// Load environment variables
require('dotenv').config({ path: '.env.test' });

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function testLogin() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing login functionality...');
    
    const email = 'admin@renthing.com';
    const password = 'admin123';
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user || !user.password) {
      console.log('❌ User not found or password not set');
      return;
    }
    
    console.log('✅ User found:', user.email);
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return;
    }
    
    console.log('✅ Password verification successful');
    
    // Generate JWT token (simulating login)
    const secret = process.env.NEXTAUTH_SECRET || 'test_secret_key_for_testing';
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        role: user.role 
      },
      secret,
      { expiresIn: '7d' }
    );
    
    console.log('✅ JWT token generated successfully');
    console.log('Token:', token.substring(0, 50) + '...');
    
    console.log('Login test completed successfully!');
  } catch (error) {
    console.error('Login test failed:', error.message);
    console.error('Error stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();