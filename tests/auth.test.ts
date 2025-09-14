import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

describe('Authentication', () => {
  it('should be able to find the test user', async () => {
    const user = await prisma.user.findUnique({
      where: {
        email: 'test@example.com'
      }
    })
    
    expect(user).not.toBeNull()
    expect(user?.email).toBe('test@example.com')
  })

  it('should have a hashed password', async () => {
    const user = await prisma.user.findUnique({
      where: {
        email: 'test@example.com'
      }
    })
    
    expect(user).not.toBeNull()
    expect(user?.password).not.toBeNull()
    
    // Verify the password is hashed
    const isValid = await bcrypt.compare('password123', user!.password!)
    expect(isValid).toBe(true)
  })
})