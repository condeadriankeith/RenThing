const { csvDatabaseService } = require('../csv-service.js');

class ListingCSVService {
  /**
   * Create a new listing
   * @param listingData The listing data
   * @returns The created listing
   */
  async createListing(listingData) {
    try {
      // Default empty arrays for images and features if not provided
      const images = listingData.images || [];
      const features = listingData.features || [];
      
      const listing = await csvDatabaseService.create('listings', {
        ...listingData,
        images,
        features
      });
      
      console.log(`Created listing with ID: ${listing.id}`);
      return listing;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw error;
    }
  }

  /**
   * Get a listing by ID
   * @param id The listing ID
   * @returns The listing or null if not found
   */
  async getListingById(id) {
    try {
      const listing = await csvDatabaseService.findUnique('listings', { id });
      return listing;
    } catch (error) {
      console.error(`Error getting listing by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get listings by owner ID
   * @param ownerId The owner ID
   * @returns Array of listings
   */
  async getListingsByOwnerId(ownerId) {
    try {
      const listings = await csvDatabaseService.findMany('listings', { ownerId });
      return listings;
    } catch (error) {
      console.error(`Error getting listings by owner ID ${ownerId}:`, error);
      throw error;
    }
  }

  /**
   * Update a listing
   * @param id The listing ID
   * @param listingData The listing data to update
   * @returns The updated listing
   */
  async updateListing(id, listingData) {
    try {
      const listing = await csvDatabaseService.update('listings', { id }, listingData);
      console.log(`Updated listing with ID: ${id}`);
      return listing;
    } catch (error) {
      console.error(`Error updating listing with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a listing
   * @param id The listing ID
   * @returns The deleted listing
   */
  async deleteListing(id) {
    try {
      const listing = await csvDatabaseService.delete('listings', { id });
      console.log(`Deleted listing with ID: ${id}`);
      return listing;
    } catch (error) {
      console.error(`Error deleting listing with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all listings
   * @returns Array of all listings
   */
  async getAllListings() {
    try {
      const listings = await csvDatabaseService.findMany('listings');
      return listings;
    } catch (error) {
      console.error('Error getting all listings:', error);
      throw error;
    }
  }

  /**
   * Search listings by location
   * @param location The location to search for
   * @returns Array of matching listings
   */
  async searchListingsByLocation(location) {
    try {
      // For CSV implementation, we'll do a simple string match
      const allListings = await this.getAllListings();
      const matchingListings = allListings.filter(listing => 
        listing.location.toLowerCase().includes(location.toLowerCase())
      );
      return matchingListings;
    } catch (error) {
      console.error(`Error searching listings by location ${location}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = { ListingCSVService, listingCSVService: new ListingCSVService() };