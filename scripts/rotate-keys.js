#!/usr/bin/env node

/**
 * Script to help with rotating exposed keys
 * 
 * This script provides guidance on how to rotate keys that may have been exposed
 * and should be run after a security incident.
 */

console.log('RenThing - Key Rotation Helper');
console.log('==============================\n');

console.log('IMPORTANT: If your keys have been exposed, you should immediately:\n');

console.log('1. Supabase Keys:');
console.log('   - Go to your Supabase project dashboard');
console.log('   - Navigate to Settings > API');
console.log('   - Click "Generate new key" for the exposed key');
console.log('   - Update your environment variables with the new key\n');

console.log('2. Database Credentials:');
console.log('   - If using Supabase, go to Settings > Database');
console.log('   - Reset your database password');
console.log('   - Update your DATABASE_URL environment variable\n');

console.log('3. Authentication Secrets:');
console.log('   - Generate a new NEXTAUTH_SECRET:');
console.log('     openssl rand -base64 32\n');

console.log('4. Payment Keys (Stripe/Xendit):');
console.log('   - Log into your Stripe/Xendit dashboard');
console.log('   - Rotate API keys in the settings section');
console.log('   - Update environment variables with new keys\n');

console.log('5. Update Environment Variables:');
console.log('   - Update your .env.local file with new keys');
console.log('   - For Vercel deployments, use:');
console.log('     vercel env add <environment-variable-name> <environment>');
console.log('   - Or use the Vercel dashboard to update secrets\n');

console.log('6. Revoke Exposed Keys:');
console.log('   - Ensure old keys are revoked in their respective services');
console.log('   - Check logs for any unauthorized usage\n');

console.log('7. Monitor for Unauthorized Activity:');
console.log('   - Check application logs for suspicious activity');
console.log('   - Monitor payment services for unauthorized transactions');
console.log('   - Check database access logs if available\n');

console.log('For more information, see the SECURITY.md file in this repository.');