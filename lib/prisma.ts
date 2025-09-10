import { PrismaClient } from '@prisma/client'

// Create a stable Prisma client instance that handles missing environment variables gracefully
const createPrismaClient = () => {
  try {
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.warn('DATABASE_URL environment variable is not set. Using in-memory SQLite database for development.')
      // Set a default database URL for development
      process.env.DATABASE_URL = 'file:./dev.db'
    }
    
    // Attempt to create Prisma client normally
    const client = new PrismaClient()
    return client
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    // Throw the error to make it clear that Prisma is not working
    throw new Error(`Prisma client initialization failed: ${error.message}`)
  }
}

// Create the Prisma client instance
let prismaClient: PrismaClient | null = null

try {
  prismaClient = createPrismaClient()
} catch (error) {
  console.error('Prisma initialization error:', error)
  // In production, we should not continue without a working database
  // In development, we might want to provide a mock client
  if (process.env.NODE_ENV === 'production') {
    throw error
  } else {
    console.warn('Using mock Prisma client for development')
    // Create a minimal mock client for development
    prismaClient = {
      $connect: async () => {},
      $disconnect: async () => {},
      user: {
        findUnique: async () => null,
        findMany: async () => [],
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      listing: {
        findUnique: async () => null,
        findMany: async () => [],
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
        count: async () => 0,
      },
      booking: {
        findUnique: async () => null,
        findMany: async () => [],
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      review: {
        findUnique: async () => null,
        findMany: async () => [],
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      wishlist: {
        findUnique: async () => null,
        findMany: async () => [],
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
      message: {
        findUnique: async () => null,
        findMany: async () => [],
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
        count: async () => 0,
      },
      interaction: {
        findUnique: async () => null,
        findMany: async () => [],
        create: async () => ({}),
        update: async () => ({}),
        delete: async () => ({}),
      },
    } as any
  }
}

// Export the client
export const prisma = prismaClient

// Fallback functions for when Prisma is not available
export const getPrismaClient = () => {
  return prismaClient
}