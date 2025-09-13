import { csvDatabaseService } from '../csv-service';
import { logger } from '@/lib/logger';

// Define the Listing interface based on the Prisma schema
export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  images: string[]; // JSON array of image URLs
  features: string[]; // JSON array of features
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define input types for create and update operations
export interface CreateListingInput {
  title: string;
  description: string;
  price: number;
  location: string;
  images?: string[];
  features?: string[];
  ownerId: string;
}

export interface UpdateListingInput {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  images?: string[];
  features?: string[];
}

export class ListingCSVService {
  /**
   * Create a new listing
   * @param listingData The listing data
   * @returns The created listing
   */
  async createListing(listingData: CreateListingInput): Promise<Listing> {
    try {
      // Default empty arrays for images and features if not provided
      const images = listingData.images || [];
      const features = listingData.features || [];
      
      const listing = await csvDatabaseService.create<Listing>('listings', {
        ...listingData,
        images,
        features
      });
      
      logger.info(`Created listing with ID: ${listing.id}`);
      return listing;
    } catch (error) {
      logger.error('Error creating listing:', error);
      throw error;
    }
  }

  /**
   * Get a listing by ID
   * @param id The listing ID
   * @returns The listing or null if not found
   */
  async getListingById(id: string): Promise<Listing | null> {
    try {
      const listing = await csvDatabaseService.findUnique<Listing>('listings', { id });
      return listing;
    } catch (error) {
      logger.error(`Error getting listing by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get listings by owner ID
   * @param ownerId The owner ID
   * @returns Array of listings
   */
  async getListingsByOwnerId(ownerId: string): Promise<Listing[]> {
    try {
      const listings = await csvDatabaseService.findMany<Listing>('listings', { ownerId });
      return listings;
    } catch (error) {
      logger.error(`Error getting listings by owner ID ${ownerId}:`, error);
      throw error;
    }
  }

  /**
   * Update a listing
   * @param id The listing ID
   * @param listingData The listing data to update
   * @returns The updated listing
   */
  async updateListing(id: string, listingData: UpdateListingInput): Promise<Listing> {
    try {
      const listing = await csvDatabaseService.update<Listing>('listings', { id }, listingData);
      logger.info(`Updated listing with ID: ${id}`);
      return listing;
    } catch (error) {
      logger.error(`Error updating listing with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a listing
   * @param id The listing ID
   * @returns The deleted listing
   */
  async deleteListing(id: string): Promise<Listing> {
    try {
      const listing = await csvDatabaseService.delete<Listing>('listings', { id });
      logger.info(`Deleted listing with ID: ${id}`);
      return listing;
    } catch (error) {
      logger.error(`Error deleting listing with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all listings
   * @returns Array of all listings
   */
  async getAllListings(): Promise<Listing[]> {
    try {
      const listings = await csvDatabaseService.findMany<Listing>('listings');
      return listings;
    } catch (error) {
      logger.error('Error getting all listings:', error);
      throw error;
    }
  }

  /**
   * Search listings by location
   * @param location The location to search for
   * @returns Array of matching listings
   */
  async searchListingsByLocation(location: string): Promise<Listing[]> {
    try {
      // For CSV implementation, we'll do a simple string match
      const allListings = await this.getAllListings();
      const matchingListings = allListings.filter(listing => 
        listing.location.toLowerCase().includes(location.toLowerCase())
      );
      return matchingListings;
    } catch (error) {
      logger.error(`Error searching listings by location ${location}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const listingCSVService = new ListingCSVService();