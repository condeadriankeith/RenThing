import { PrismaClient } from '@prisma/client'

// Create a stable Prisma client instance that handles missing environment variables gracefully
const createPrismaClient = () => {
  try {
    // Attempt to create Prisma client normally
    return new PrismaClient()
  } catch (error) {
    console.warn('Failed to create Prisma client:', error.message)
    // Return a mock client or null if we can't create one
    return null
  }
}

// Create the Prisma client instance
const prismaClient = createPrismaClient()

// Export the client or a mock implementation
export const prisma = prismaClient

// Fallback functions for when Prisma is not available
export const getPrismaClient = () => {
  if (prismaClient) {
    return prismaClient
  }
  
  // Return mock implementation for build time
  return {
    $connect: async () => {},
    $disconnect: async () => {},
    user: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    // Add other model mocks as needed
    listing: {
      findUnique: async () => null,
      findMany: async () => [],
      create: async () => ({}),
      update: async () => ({}),
      delete: async () => ({}),
    },
    // ... add other models as needed
  }
}