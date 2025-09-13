import { csvDatabaseService } from '../csv-service';
import { logger } from '@/lib/logger';

// Define the Booking interface based on the Prisma schema
export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define input types for create and update operations
export interface CreateBookingInput {
  listingId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status?: string;
}

export interface UpdateBookingInput {
  listingId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  totalPrice?: number;
  status?: string;
}

export class BookingCSVService {
  /**
   * Create a new booking
   * @param bookingData The booking data
   * @returns The created booking
   */
  async createBooking(bookingData: CreateBookingInput): Promise<Booking> {
    try {
      const defaultStatus = bookingData.status || 'pending';
      
      const booking = await csvDatabaseService.create<Booking>('bookings', {
        ...bookingData,
        status: defaultStatus
      });
      
      logger.info(`Created booking with ID: ${booking.id}`);
      return booking;
    } catch (error) {
      logger.error('Error creating booking:', error);
      throw error;
    }
  }

  /**
   * Get a booking by ID
   * @param id The booking ID
   * @returns The booking or null if not found
   */
  async getBookingById(id: string): Promise<Booking | null> {
    try {
      const booking = await csvDatabaseService.findUnique<Booking>('bookings', { id });
      return booking;
    } catch (error) {
      logger.error(`Error getting booking by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get bookings by user ID
   * @param userId The user ID
   * @returns Array of bookings
   */
  async getBookingsByUserId(userId: string): Promise<Booking[]> {
    try {
      const bookings = await csvDatabaseService.findMany<Booking>('bookings', { userId });
      return bookings;
    } catch (error) {
      logger.error(`Error getting bookings by user ID ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get bookings by listing ID
   * @param listingId The listing ID
   * @returns Array of bookings
   */
  async getBookingsByListingId(listingId: string): Promise<Booking[]> {
    try {
      const bookings = await csvDatabaseService.findMany<Booking>('bookings', { listingId });
      return bookings;
    } catch (error) {
      logger.error(`Error getting bookings by listing ID ${listingId}:`, error);
      throw error;
    }
  }

  /**
   * Update a booking
   * @param id The booking ID
   * @param bookingData The booking data to update
   * @returns The updated booking
   */
  async updateBooking(id: string, bookingData: UpdateBookingInput): Promise<Booking> {
    try {
      const booking = await csvDatabaseService.update<Booking>('bookings', { id }, bookingData);
      logger.info(`Updated booking with ID: ${id}`);
      return booking;
    } catch (error) {
      logger.error(`Error updating booking with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a booking
   * @param id The booking ID
   * @returns The deleted booking
   */
  async deleteBooking(id: string): Promise<Booking> {
    try {
      const booking = await csvDatabaseService.delete<Booking>('bookings', { id });
      logger.info(`Deleted booking with ID: ${id}`);
      return booking;
    } catch (error) {
      logger.error(`Error deleting booking with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all bookings
   * @returns Array of all bookings
   */
  async getAllBookings(): Promise<Booking[]> {
    try {
      const bookings = await csvDatabaseService.findMany<Booking>('bookings');
      return bookings;
    } catch (error) {
      logger.error('Error getting all bookings:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const bookingCSVService = new BookingCSVService();