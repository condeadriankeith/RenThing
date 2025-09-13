const { csvDatabaseService, userCSVService, listingCSVService } = require('../lib/csv-database');

async function runDemo() {
  try {
    console.log('CSV Database Demo');
    console.log('=================');
    
    // Initialize the CSV database
    console.log('Initializing CSV database...');
    await csvDatabaseService.initialize();
    console.log('CSV database initialized!');
    
    // Create a user
    console.log('\nCreating a user...');
    const user = await userCSVService.createUser({
      email: 'demo@example.com',
      password: 'demopassword',
      name: 'Demo User'
    });
    console.log('Created user:', user);
    
    // Create a listing
    console.log('\nCreating a listing...');
    const listing = await listingCSVService.createListing({
      title: 'Demo Listing',
      description: 'This is a demo listing',
      price: 50,
      location: 'Demo City',
      ownerId: user.id,
      images: ['image1.jpg', 'image2.jpg'],
      features: ['feature1', 'feature2']
    });
    console.log('Created listing:', listing);
    
    // Retrieve the user
    console.log('\nRetrieving user by ID...');
    const retrievedUser = await userCSVService.getUserById(user.id);
    console.log('Retrieved user:', retrievedUser);
    
    // Retrieve the listing
    console.log('\nRetrieving listing by ID...');
    const retrievedListing = await listingCSVService.getListingById(listing.id);
    console.log('Retrieved listing:', retrievedListing);
    
    // Update the user
    console.log('\nUpdating user...');
    const updatedUser = await userCSVService.updateUser(user.id, {
      name: 'Updated Demo User'
    });
    console.log('Updated user:', updatedUser);
    
    // Get all users
    console.log('\nGetting all users...');
    const allUsers = await userCSVService.getAllUsers();
    console.log(`Found ${allUsers.length} users`);
    
    // Get all listings
    console.log('\nGetting all listings...');
    const allListings = await listingCSVService.getAllListings();
    console.log(`Found ${allListings.length} listings`);
    
    // Search listings by location
    console.log('\nSearching listings by location...');
    const searchResults = await listingCSVService.searchListingsByLocation('Demo');
    console.log(`Found ${searchResults.length} listings matching "Demo"`);
    
    console.log('\nDemo completed successfully!');
    
  } catch (error) {
    console.error('Demo failed:', error);
  }
}

// Run the demo if this script is executed directly
if (require.main === module) {
  runDemo();
}

module.exports = { runDemo };