const { csvDatabaseService } = require('../csv-service.js');

// Define input types for create and update operations
// In JavaScript, we'll just use objects

class UserCSVService {
  /**
   * Create a new user
   * @param userData The user data
   * @returns The created user
   */
  async createUser(userData) {
    try {
      const defaultRole = userData.role || 'USER';
      
      const user = await csvDatabaseService.create('users', {
        ...userData,
        role: defaultRole
      });
      
      console.log(`Created user with ID: ${user.id}`);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  /**
   * Get a user by ID
   * @param id The user ID
   * @returns The user or null if not found
   */
  async getUserById(id) {
    try {
      const user = await csvDatabaseService.findUnique('users', { id });
      return user;
    } catch (error) {
      console.error(`Error getting user by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get a user by email
   * @param email The user email
   * @returns The user or null if not found
   */
  async getUserByEmail(email) {
    try {
      const users = await csvDatabaseService.findMany('users', { email });
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error(`Error getting user by email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Update a user
   * @param id The user ID
   * @param userData The user data to update
   * @returns The updated user
   */
  async updateUser(id, userData) {
    try {
      const user = await csvDatabaseService.update('users', { id }, userData);
      console.log(`Updated user with ID: ${id}`);
      return user;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a user
   * @param id The user ID
   * @returns The deleted user
   */
  async deleteUser(id) {
    try {
      const user = await csvDatabaseService.delete('users', { id });
      console.log(`Deleted user with ID: ${id}`);
      return user;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get all users
   * @returns Array of all users
   */
  async getAllUsers() {
    try {
      const users = await csvDatabaseService.findMany('users');
      return users;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  }

  /**
   * Check if a user exists by email
   * @param email The user email
   * @returns True if user exists, false otherwise
   */
  async userExists(email) {
    try {
      const user = await this.getUserByEmail(email);
      return !!user;
    } catch (error) {
      console.error(`Error checking if user exists with email ${email}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
module.exports = { UserCSVService, userCSVService: new UserCSVService() };