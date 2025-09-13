import { csvDatabaseService } from '../../lib/csv-database';
import { userCSVService } from '../../lib/csv-database/models/user-csv';
import { listingCSVService } from '../../lib/csv-database/models/listing-csv';
import { bookingCSVService } from '../../lib/csv-database/models/booking-csv';
import fs from 'fs';
import path from 'path';

describe('CSV Database Integration', () => {
  beforeAll(async () => {
    // Initialize the CSV database
    await csvDatabaseService.initialize();
  });

  afterAll(async () => {
    // Clean up the CSV database
    await csvDatabaseService.cleanup();
  });

  it('should handle a complete user-listing-booking flow', async () => {
    // Create an owner user
    const owner = await userCSVService.createUser({
      email: 'owner@test.com',
      password: 'password123',
      name: 'Test Owner'
    });
    
    // Create a renter user
    const renter = await userCSVService.createUser({
      email: 'renter@test.com',
      password: 'password123',
      name: 'Test Renter'
    });
    
    // Create a listing
    const listing = await listingCSVService.createListing({
      title: 'Beautiful Apartment',
      description: 'A lovely apartment in the city center',
      price: 100,
      location: 'City Center',
      ownerId: owner.id,
      images: ['apartment1.jpg', 'apartment2.jpg'],
      features: ['WiFi', 'Parking', 'Balcony']
    });
    
    // Create a booking
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + 7);
    
    const booking = await bookingCSVService.createBooking({
      listingId: listing.id,
      userId: renter.id,
      startDate: startDate,
      endDate: endDate,
      totalPrice: 700,
      status: 'confirmed'
    });
    
    // Verify the data flow
    // Check that the owner has a listing
    const ownerListings = await listingCSVService.getListingsByOwnerId(owner.id);
    expect(ownerListings.length).toBe(1);
    expect(ownerListings[0].id).toBe(listing.id);
    
    // Check that the renter has a booking
    const renterBookings = await bookingCSVService.getBookingsByUserId(renter.id);
    expect(renterBookings.length).toBe(1);
    expect(renterBookings[0].id).toBe(booking.id);
    
    // Check that the listing has a booking
    const listingBookings = await bookingCSVService.getBookingsByListingId(listing.id);
    expect(listingBookings.length).toBe(1);
    expect(listingBookings[0].id).toBe(booking.id);
    
    // Update the booking status
    const updatedBooking = await bookingCSVService.updateBooking(booking.id, {
      status: 'completed'
    });
    expect(updatedBooking.status).toBe('completed');
    
    // Verify data is persisted in CSV files
    const dataDir = path.join(process.cwd(), 'data');
    const bookingsFile = path.join(dataDir, 'bookings.csv');
    const bookingsContent = fs.readFileSync(bookingsFile, 'utf8');
    expect(bookingsContent).toContain('completed');
    
    // Clean up
    await bookingCSVService.deleteBooking(booking.id);
    await listingCSVService.deleteListing(listing.id);
    await userCSVService.deleteUser(owner.id);
    await userCSVService.deleteUser(renter.id);
  });

  it('should handle concurrent operations', async () => {
    // Create multiple users concurrently
    const userPromises = [];
    for (let i = 0; i < 5; i++) {
      userPromises.push(
        userCSVService.createUser({
          email: `user${i}@test.com`,
          password: 'password123',
          name: `Test User ${i}`
        })
      );
    }
    
    const users = await Promise.all(userPromises);
    
    // Create multiple listings concurrently
    const listingPromises = [];
    for (let i = 0; i < 5; i++) {
      listingPromises.push(
        listingCSVService.createListing({
          title: `Listing ${i}`,
          description: `Description for listing ${i}`,
          price: 100 + i * 10,
          location: `Location ${i}`,
          ownerId: users[i].id
        })
      );
    }
    
    const listings = await Promise.all(listingPromises);
    
    // Verify all data was created
    expect(users.length).toBe(5);
    expect(listings.length).toBe(5);
    
    // Clean up
    for (const listing of listings) {
      await listingCSVService.deleteListing(listing.id);
    }
    
    for (const user of users) {
      await userCSVService.deleteUser(user.id);
    }
  });
});