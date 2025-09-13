const { csvDatabaseService } = require('../lib/csv-database');

async function cleanupCSVDatabase() {
  try {
    console.log('Cleaning up CSV database...');
    await csvDatabaseService.cleanup();
    console.log('CSV database cleaned up successfully!');
  } catch (error) {
    console.error('Failed to cleanup CSV database:', error);
    process.exit(1);
  }
}

// Run cleanup if this script is executed directly
if (require.main === module) {
  cleanupCSVDatabase();
}

module.exports = { cleanupCSVDatabase };