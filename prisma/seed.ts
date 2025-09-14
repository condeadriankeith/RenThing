import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@renthing.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'admin',
      isVerified: true,
    },
  });

  // Create vendor user
  const vendorPassword = await bcrypt.hash('vendor123', 10);
  const vendor = await prisma.user.create({
    data: {
      email: 'vendor@renthing.com',
      name: 'Vendor User',
      password: vendorPassword,
      role: 'vendor',
      isVerified: true,
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'user@renthing.com',
      name: 'Regular User',
      password: userPassword,
      role: 'user',
    },
  });

  // Create a sample listing
  const listing = await prisma.listing.create({
    data: {
      title: 'Mountain Bike',
      description: 'Great condition mountain bike perfect for trails',
      price: 25.99,
      location: 'Manila, Philippines',
      category: 'Sports & Outdoors',
      priceUnit: 'per day',
      ownerId: vendor.id,
    },
  });

  console.log('Seed data created successfully!');
  console.log({ admin: admin.email, vendor: vendor.email, user: user.email, listing: listing.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });