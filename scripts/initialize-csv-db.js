const { csvDatabaseService } = require('../lib/csv-database');

async function initializeCSVDatabase() {
  try {
    console.log('Initializing CSV database...');
    await csvDatabaseService.initialize();
    console.log('CSV database initialized successfully!');
  } catch (error) {
    console.error('Failed to initialize CSV database:', error);
    process.exit(1);
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeCSVDatabase();
}

module.exports = { initializeCSVDatabase };