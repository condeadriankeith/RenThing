// Prisma configuration with fallback for build environments
module.exports = {
  getDatabaseUrl: () => {
    // During build time, we might not have DATABASE_URL
    // Return a placeholder that will work for Prisma client generation
    if (process.env.DATABASE_URL) {
      return process.env.DATABASE_URL;
    }
    
    // Fallback for build environments
    if (process.env.NODE_ENV === 'production') {
      // In production, we still need a real database URL
      // This should be set in environment variables
      return process.env.DATABASE_URL || 'postgresql://placeholder:placeholder@localhost:5432/placeholder';
    }
    
    // For development or build processes, use SQLite as fallback
    return 'file:./dev.db';
  }
};