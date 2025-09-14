import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function test() {
  try {
    // First, get a user ID to use as the owner
    const user = await prisma.user.findFirst()
    if (!user) {
      console.log("No user found in database")
      return
    }
    
    console.log("Using user ID:", user.id)
    
    // Test creating a listing with all the fields
    const listing = await prisma.listing.create({
      data: {
        title: "Test Listing",
        description: "Test description",
        price: 100,
        location: "Test location",
        category: "Electronics",
        priceUnit: "per day",
        ownerId: user.id,
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