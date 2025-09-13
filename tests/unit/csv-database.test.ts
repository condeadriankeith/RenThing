import { csvDatabaseService } from '../../lib/csv-database';
import { userCSVService, User } from '../../lib/csv-database/models/user-csv';
import { listingCSVService, Listing } from '../../lib/csv-database/models/listing-csv';
import fs from 'fs';
import path from 'path';

describe('CSV Database', () => {
  beforeAll(async () => {
    // Initialize the CSV database
    await csvDatabaseService.initialize();
  });

  afterAll(async () => {
    // Clean up the CSV database
    await csvDatabaseService.cleanup();
  });

  describe('CSV Database Service', () => {
    it('should initialize and create CSV files', async () => {
      const dataDir = path.join(process.cwd(), 'data');
      const usersFile = path.join(dataDir, 'users.csv');
      const listingsFile = path.join(dataDir, 'listings.csv');
      
      // Check that CSV files were created
      expect(fs.existsSync(usersFile)).toBe(true);
      expect(fs.existsSync(listingsFile)).toBe(true);
      
      // Check that files have headers
      const usersContent = fs.readFileSync(usersFile, 'utf8');
      const listingsContent = fs.readFileSync(listingsFile, 'utf8');
      
      expect(usersContent).toContain('id,email,name,emailVerified,image,avatar,password,role,createdAt,updatedAt');
      expect(listingsContent).toContain('id,title,description,price,location,images,features,ownerId,createdAt,updatedAt');
    });

    it('should perform CRUD operations', async () => {
      // Create a test record
      const testData = {
        id: 'test-id',
        name: 'Test Record',
        value: 42
      };
      
      const created = await csvDatabaseService.create('test', testData);
      expect(created.id).toBe('test-id');
      expect(created.name).toBe('Test Record');
      expect(created.value).toBe(42);
      
      // Read the test record
      const found = await csvDatabaseService.findUnique('test', { id: 'test-id' });
      expect(found).toEqual(created);
      
      // Update the test record
      const updated = await csvDatabaseService.update('test', { id: 'test-id' }, { name: 'Updated Record' });
      expect(updated.name).toBe('Updated Record');
      expect(updated.value).toBe(42);
      
      // Find multiple records
      const allRecords = await csvDatabaseService.findMany('test');
      expect(allRecords.length).toBeGreaterThan(0);
      
      // Count records
      const count = await csvDatabaseService.count('test');
      expect(count).toBeGreaterThan(0);
      
      // Delete the test record
      const deleted = await csvDatabaseService.delete('test', { id: 'test-id' });
      expect(deleted.id).toBe('test-id');
    });
  });

  describe('User CSV Service', () => {
    it('should create and retrieve users', async () => {
      // Create a user
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };
      
      const user = await userCSVService.createUser(userData);
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.role).toBe('USER');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
      
      // Retrieve the user by ID
      const userById = await userCSVService.getUserById(user.id);
      expect(userById).toEqual(user);
      
      // Retrieve the user by email
      const userByEmail = await userCSVService.getUserByEmail('test@example.com');
      expect(userByEmail).toEqual(user);
      
      // Check if user exists
      const userExists = await userCSVService.userExists('test@example.com');
      expect(userExists).toBe(true);
      
      // Get all users
      const allUsers = await userCSVService.getAllUsers();
      expect(allUsers.length).toBeGreaterThan(0);
      
      // Update the user
      const updatedUser = await userCSVService.updateUser(user.id, { name: 'Updated User' });
      expect(updatedUser.name).toBe('Updated User');
      
      // Delete the user
      const deletedUser = await userCSVService.deleteUser(user.id);
      expect(deletedUser.id).toBe(user.id);
    });
  });

  describe('Listing CSV Service', () => {
    let ownerId: string;
    
    beforeAll(async () => {
      // Create a user to be the owner
      const owner = await userCSVService.createUser({
        email: 'owner@example.com',
        password: 'password123',
        name: 'Listing Owner'
      });
      ownerId = owner.id;
    });
    
    afterAll(async () => {
      // Clean up the owner user
      await userCSVService.deleteUser(ownerId);
    });

    it('should create and retrieve listings', async () => {
      // Create a listing
      const listingData = {
        title: 'Test Listing',
        description: 'A test listing',
        price: 100,
        location: 'Test City',
        ownerId: ownerId,
        images: ['image1.jpg', 'image2.jpg'],
        features: ['feature1', 'feature2']
      };
      
      const listing = await listingCSVService.createListing(listingData);
      expect(listing.title).toBe('Test Listing');
      expect(listing.description).toBe('A test listing');
      expect(listing.price).toBe(100);
      expect(listing.location).toBe('Test City');
      expect(listing.ownerId).toBe(ownerId);
      expect(listing.images).toEqual(['image1.jpg', 'image2.jpg']);
      expect(listing.features).toEqual(['feature1', 'feature2']);
      expect(listing.id).toBeDefined();
      expect(listing.createdAt).toBeDefined();
      expect(listing.updatedAt).toBeDefined();
      
      // Retrieve the listing by ID
      const listingById = await listingCSVService.getListingById(listing.id);
      expect(listingById).toEqual(listing);
      
      // Retrieve listings by owner ID
      const listingsByOwner = await listingCSVService.getListingsByOwnerId(ownerId);
      expect(listingsByOwner.length).toBe(1);
      expect(listingsByOwner[0]).toEqual(listing);
      
      // Get all listings
      const allListings = await listingCSVService.getAllListings();
      expect(allListings.length).toBeGreaterThan(0);
      
      // Search listings by location
      const searchResults = await listingCSVService.searchListingsByLocation('Test');
      expect(searchResults.length).toBeGreaterThan(0);
      
      // Update the listing
      const updatedListing = await listingCSVService.updateListing(listing.id, { 
        title: 'Updated Listing',
        price: 150
      });
      expect(updatedListing.title).toBe('Updated Listing');
      expect(updatedListing.price).toBe(150);
      
      // Delete the listing
      const deletedListing = await listingCSVService.deleteListing(listing.id);
      expect(deletedListing.id).toBe(listing.id);
    });
  });
});