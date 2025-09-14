#!/usr/bin/env node

// Migration script to sync data from Prisma to Edge Config
// This script can be used to populate Edge Config with initial data

const { edgeConfigSyncService } = require('../lib/edge-config/sync-service');

async function migrateData() {
  try {
    console.log('Starting migration to Edge Config...');
    
    // Perform full synchronization
    await edgeConfigSyncService.syncAllModels();
    
    console.log('Migration completed successfully!');
    
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