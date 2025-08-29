import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'


async function main() {
  console.log('Seeding database...')

  // Check if admin users already exist
  const existingAdmin1 = await prisma.user.findUnique({
    where: { email: 'adriankeithconde@gmail.com' }
  })

  const existingAdmin2 = await prisma.user.findUnique({
    where: { email: 'roelslumauagjr@gmail.com' }
  })

  // Create admin accounts if they don't exist
  if (!existingAdmin1) {
    const hashedPassword1 = await bcrypt.hash('admin123', 10)
    await prisma.user.create({
      data: {
        email: 'adriankeithconde@gmail.com',
        name: 'Admin User 1',
        password: hashedPassword1,
        role: 'ADMIN',


      },
    })
    console.log('Created admin account: adriankeithconde@gmail.com')
  } else {
    console.log('Admin account already exists: adriankeithconde@gmail.com')
  }

  if (!existingAdmin2) {
    const hashedPassword2 = await bcrypt.hash('admin123', 10)
    await prisma.user.create({
      data: {
        email: 'roelslumauagjr@gmail.com',
        name: 'Admin User 2',
        password: hashedPassword2,
        role: 'ADMIN',


      },
    })
    console.log('Created admin account: roelslumauagjr@gmail.com')
  } else {
    console.log('Admin account already exists: roelslumauagjr@gmail.com')
  }

  console.log('Seeding completed!')
  console.log('Admin credentials:')
  console.log('Email: adriankeithconde@gmail.com, Password: admin123')
  console.log('Email: roelslumauagjr@gmail.com, Password: admin123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
