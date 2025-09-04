#!/usr/bin/env node

console.log('=== API Key Rotation Helper ===\n');

console.log('1. Cloudinary Keys:');
console.log('   - Log into your Cloudinary dashboard');
console.log('   - Navigate to Settings > Account');
console.log('   - Generate new API Key and Secret');
console.log('   - Update environment variables:\n');
console.log('     CLOUDINARY_CLOUD_NAME=your-new-cloud-name');
console.log('     CLOUDINARY_API_KEY=your-new-api-key');
console.log('     CLOUDINARY_API_SECRET=your-new-api-secret\n');

console.log('2. Meilisearch Keys:');
console.log('   - Access your Meilisearch instance');
console.log('   - Generate new master key');
console.log('   - Update environment variable:\n');
console.log('     MEILISEARCH_MASTER_KEY=your-new-master-key\n');

console.log('3. NextAuth Secret:');
console.log('   - Generate new secret:\n');
console.log('     openssl rand -base64 32\n');
console.log('   - Update environment variable:\n');
console.log('     NEXTAUTH_SECRET=your-new-secret\n');

console.log('4. Payment Keys:');
console.log('   - Set up your preferred payment provider');
console.log('   - Update environment variables as needed\n');

console.log('5. Database Credentials:');
console.log('   - Rotate database password');
console.log('   - Update environment variable:\n');
console.log('     DATABASE_URL=your-new-database-url\n');

console.log('After updating keys, restart your application to apply changes.');