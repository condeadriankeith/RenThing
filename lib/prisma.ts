import { PrismaClient } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClient | undefined;
}

// Determine the database URL
let databaseUrl = process.env.DATABASE_URL;

// If no DATABASE_URL is set, use the default SQLite path
if (!databaseUrl) {
  // Use absolute path to ensure consistency
  const databasePath = path.join(__dirname, '..', 'prisma', 'dev.db');
  databaseUrl = `file:${databasePath}`;
} else if (databaseUrl.startsWith('file:./') || databaseUrl.startsWith('file:.\\')) {
  // If it's a relative path, convert it to absolute
  const relativePath = databaseUrl.replace('file:', '');
  const absolutePath = path.join(process.cwd(), relativePath);
  databaseUrl = `file:${absolutePath}`;
}

// Ensure the database file exists and is writable
if (databaseUrl.startsWith('file:')) {
  const dbPath = databaseUrl.replace('file:', '');
  try {
    // Check if file exists
    if (!fs.existsSync(dbPath)) {
      console.warn(`Database file does not exist at ${dbPath}, Prisma will create it`);
    } else {
      // Check if file is writable
      try {
        fs.accessSync(dbPath, fs.constants.W_OK);
        console.log(`Database file is writable at ${dbPath}`);
      } catch (accessError) {
        console.error(`Database file is not writable at ${dbPath}:`, accessError);
      }
    }
  } catch (error) {
    console.error(`Error checking database file at ${dbPath}:`, error);
  }
}

console.log('Prisma database URL:', databaseUrl);

// Create Prisma client with proper configuration
const client = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  },
  log: ['query', 'info', 'warn', 'error'] // Add logging for debugging
});

if (process.env.NODE_ENV !== 'production') globalThis.prisma = client;

export { client as prisma };