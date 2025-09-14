import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seeding...');
    
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@renthing.com'
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists, skipping creation');
    } else {
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
      console.log('Created admin user:', admin.email);
    }

    // Check if vendor user already exists
    const existingVendor = await prisma.user.findUnique({
      where: {
        email: 'vendor@renthing.com'
      }
    });

    if (existingVendor) {
      console.log('Vendor user already exists, skipping creation');
    } else {
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
      console.log('Created vendor user:', vendor.email);
    }

    // Check if regular user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'user@renthing.com'
      }
    });

    if (existingUser) {
      console.log('Regular user already exists, skipping creation');
    } else {
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
      console.log('Created regular user:', user.email);
    }

    // Check if sample listing already exists
    const existingListing = await prisma.listing.findFirst({
      where: {
        title: 'Mountain Bike'
      }
    });

    if (existingListing) {
      console.log('Sample listing already exists, skipping creation');
    } else {
      // Find the vendor user to create a listing
      const vendor = await prisma.user.findFirst({
        where: {
          role: 'vendor'
        }
      });

      if (vendor) {
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
        console.log('Created sample listing:', listing.title);
      } else {
        console.log('No vendor user found, skipping listing creation');
      }
    }

    console.log('Seed data process completed successfully!');
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });