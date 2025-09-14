import { PrismaClient } from '@prisma/client';
import path from 'path';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Determine the database URL
let databaseUrl = process.env.DATABASE_URL;

// If no DATABASE_URL is set, use the default SQLite path
if (!databaseUrl) {
  const databasePath = path.join(process.cwd(), 'prisma', 'dev.db');
  databaseUrl = `file:${databasePath}`;
}

console.log('Prisma database URL:', databaseUrl);

// Create Prisma client with proper configuration
const client = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export { client as prisma };