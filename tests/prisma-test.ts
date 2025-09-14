import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  try {
    // Test creating a listing with all the fields
    const listing = await prisma.listing.create({
      data: {
        title: "Test",
        description: "Test description",
        price: 100,
        location: "Test location",
        category: "Test category",
        priceUnit: "per day",
        ownerId: "test-user-id",
      }
    })
    
    console.log("Created listing:", listing)
  } catch (error) {
    console.error("Error:", error)
  } finally {
    await prisma.$disconnect()
  }
}

test()