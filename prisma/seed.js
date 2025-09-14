const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const path = require('path');

// Use absolute path to the database file
const databasePath = path.join(__dirname, 'dev.db');
const databaseUrl = `file:${databasePath}`;

// Create Prisma client with direct database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

async function main() {
  try {
    // Clear non-essential data
    await prisma.booking.deleteMany();
    await prisma.review.deleteMany();
    await prisma.wishlist.deleteMany();
    await prisma.listing.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    
    // Delete non-admin users (vendor and regular users)
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        role: { not: 'admin' }
      }
    });
    
    console.log(`Deleted ${deletedUsers.count} non-admin users`);
    
    // Check if main admin account exists, create if not
    let adminUser = await prisma.user.findUnique({
      where: { email: 'admin@renthing.com' }
    });
    
    if (!adminUser) {
      const adminPassword = await bcrypt.hash('admin123', 10);
      adminUser = await prisma.user.create({
        data: {
          email: 'admin@renthing.com',
          name: 'Admin User',
          password: adminPassword,
          role: 'admin',
          isVerified: true,
        },
      });
      console.log('Created main admin account');
    } else {
      console.log('Main admin account already exists');
    }

    console.log('Database cleanup completed successfully!');
    console.log({ admin: adminUser.email });
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();