import { csvDatabaseService } from '../csv-service';
import { logger } from '@/lib/logger';

// Define the User interface based on the Prisma schema
export interface User {
  id: string;
  email: string;
  name?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  avatar?: string | null;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  // Note: We're not including relations in the CSV implementation
}

// Define input types for create and update operations
export interface CreateUserInput {
  email: string;
  name?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  avatar?: string | null;
  password: string;
  role?: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  avatar?: string | null;
  password?: string;
  role?: string;
}

export class UserCSVService {
  /**
   * Create a new user
   * @param userData The user data
   * @returns The created user
   */
  async createUser(userData: CreateUserInput): Promise<User> {
    try {
      const defaultRole = userData.role || 'USER';
      
      const user = await csvDatabaseService.create<User>('users', {
        ...userData,
        role: defaultRole
      });
      
      logger.info(`Created user with ID: ${user.id}`);
      return user;
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   * @param id The user ID
   * @returns The user or null if not found
   */
  async getUserById(id: string): Promise<User | null> {
    try {
      const user = await csvDatabaseService.findUnique<User>('users', { id });
      return user;
    } catch (error) {
      logger.error(`Error getting user by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a user by email
   * @param email The user email
   * @returns The user or null if not found
   */
  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const users = await csvDatabaseService.findMany<User>('users', { email });
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      logger.error(`Error getting user by email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Update a user
   * @param id The user ID
   * @param userData The user data to update
   * @returns The updated user
   */
  async updateUser(id: string, userData: UpdateUserInput): Promise<User> {
    try {
      const user = await csvDatabaseService.update<User>('users', { id }, userData);
      logger.info(`Updated user with ID: ${id}`);
      return user;
    } catch (error) {
      logger.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   * @param id The user ID
   * @returns The deleted user
   */
  async deleteUser(id: string): Promise<User> {
    try {
      const user = await csvDatabaseService.delete<User>('users', { id });
      logger.info(`Deleted user with ID: ${id}`);
      return user;
    } catch (error) {
      logger.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all users
   * @returns Array of all users
   */
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await csvDatabaseService.findMany<User>('users');
      return users;
    } catch (error) {
      logger.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Check if a user exists by email
   * @param email The user email
   * @returns True if user exists, false otherwise
   */
  async userExists(email: string): Promise<boolean> {
    try {
      const user = await this.getUserByEmail(email);
      return !!user;
    } catch (error) {
      logger.error(`Error checking if user exists with email ${email}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const userCSVService = new UserCSVService();