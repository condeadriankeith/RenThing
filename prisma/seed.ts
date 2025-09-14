import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create a test user
  const email = 'test@example.com'
  const password = 'password123'
  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Test User',
      password: hashedPassword,
      role: 'user',
    },
  })

  console.log(`Created/Updated user with email: ${user.email}`)

  // Create admin accounts as requested
  const admin1Email = 'adriankeithconde@gmail.com'
  const admin1Password = 'admin123'
  const admin1HashedPassword = await bcrypt.hash(admin1Password, 10)

  const admin1 = await prisma.user.upsert({
    where: { email: admin1Email },
    update: {},
    create: {
      email: admin1Email,
      name: 'Adrian Keith Conde',
      password: admin1HashedPassword,
      role: 'admin',
    },
  })

  console.log(`Created/Updated admin account with email: ${admin1.email}`)

  // Create second admin account
  const admin2Email = 'roelslumauagjr@gmail.com'
  const admin2Password = 'admin123'
  const admin2HashedPassword = await bcrypt.hash(admin2Password, 10)

  const admin2 = await prisma.user.upsert({
    where: { email: admin2Email },
    update: {},
    create: {
      email: admin2Email,
      name: 'Roel Jr. Lumauag',
      password: admin2HashedPassword,
      role: 'admin',
    },
  })

  console.log(`Created/Updated admin account with email: ${admin2.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })