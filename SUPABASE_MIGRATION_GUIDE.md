# Supabase Migration Guide for RenThing

This guide explains how to migrate your existing Prisma/PostgreSQL database to Supabase for the RenThing application.

## Overview

The RenThing application currently uses:
- Prisma ORM with PostgreSQL as the database
- NextAuth.js for authentication
- A complex schema with Users, Listings, Bookings, Chat, and more

To migrate to Supabase, you'll need to:
1. Set up equivalent tables in Supabase
2. Migrate existing data from PostgreSQL to Supabase
3. Update the application code to use Supabase instead of Prisma

## Step 1: Create Supabase Tables

First, create the equivalent tables in your Supabase project. Here's the SQL schema that matches your Prisma schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE "User" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  emailVerified TIMESTAMP WITH TIME ZONE,
  image TEXT,
  avatar TEXT,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'USER',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Accounts table (for NextAuth)
CREATE TABLE "Account" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  providerAccountId TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  UNIQUE(provider, providerAccountId)
);

-- Sessions table (for NextAuth)
CREATE TABLE "Session" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sessionToken TEXT UNIQUE NOT NULL,
  userId UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Verification Tokens table (for NextAuth)
CREATE TABLE "VerificationToken" (
  identifier TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY(identifier, token)
);

-- Listings table
CREATE TABLE "Listing" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price REAL NOT NULL,
  location TEXT NOT NULL,
  images TEXT, -- JSON array of image URLs
  features TEXT, -- JSON array of features
  ownerId UUID NOT NULL REFERENCES "User"(id),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE "Booking" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listingId UUID NOT NULL REFERENCES "Listing"(id),
  userId UUID NOT NULL REFERENCES "User"(id),
  startDate TIMESTAMP WITH TIME ZONE NOT NULL,
  endDate TIMESTAMP WITH TIME ZONE NOT NULL,
  totalPrice REAL NOT NULL,
  status TEXT DEFAULT 'pending',
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Wishlist table
CREATE TABLE "Wishlist" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  userId UUID NOT NULL REFERENCES "User"(id),
  listingId UUID NOT NULL REFERENCES "Listing"(id),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(userId, listingId)
);

-- Reviews table
CREATE TABLE "Review" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listingId UUID NOT NULL REFERENCES "Listing"(id),
  userId UUID NOT NULL REFERENCES "User"(id),
  rating INTEGER NOT NULL,
  comment TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE "Transaction" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bookingId UUID UNIQUE NOT NULL REFERENCES "Booking"(id),
  userId UUID NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  paymentMethod TEXT NOT NULL,
  status TEXT NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Rooms table
CREATE TABLE "ChatRoom" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listingId UUID NOT NULL REFERENCES "Listing"(id),
  customerId UUID NOT NULL,
  ownerId UUID NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table
CREATE TABLE "Message" (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  senderId UUID NOT NULL REFERENCES "User"(id),
  receiverId UUID NOT NULL REFERENCES "User"(id),
  roomId UUID NOT NULL REFERENCES "ChatRoom"(id),
  listingId UUID NOT NULL,
  read BOOLEAN DEFAULT false,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_listing_owner ON "Listing"(ownerId);
CREATE INDEX idx_booking_listing ON "Booking"(listingId);
CREATE INDEX idx_booking_user ON "Booking"(userId);
CREATE INDEX idx_wishlist_user ON "Wishlist"(userId);
CREATE INDEX idx_review_listing ON "Review"(listingId);
CREATE INDEX idx_review_user ON "Review"(userId);
CREATE INDEX idx_chatroom_listing ON "ChatRoom"(listingId);
CREATE INDEX idx_message_room ON "Message"(roomId);
CREATE INDEX idx_message_sender ON "Message"(senderId);
```

## Step 2: Install Supabase Client

Install the Supabase JavaScript client:

```bash
npm install @supabase/supabase-js
```

## Step 3: Configure Supabase Client

Create a new file `lib/supabaseClient.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!)
```

## Step 4: Export Data from PostgreSQL

To export data from your current PostgreSQL database, you can use a script like this:

```javascript
// scripts/export-data.js
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function exportData() {
  try {
    // Export all data
    const users = await prisma.user.findMany()
    const accounts = await prisma.account.findMany()
    const sessions = await prisma.session.findMany()
    const verificationTokens = await prisma.verificationToken.findMany()
    const listings = await prisma.listing.findMany()
    const bookings = await prisma.booking.findMany()
    const wishlists = await prisma.wishlist.findMany()
    const reviews = await prisma.review.findMany()
    const transactions = await prisma.transaction.findMany()
    const chatRooms = await prisma.chatRoom.findMany()
    const messages = await prisma.message.findMany()

    // Save to JSON files
    const fs = require('fs')
    fs.writeFileSync('export/users.json', JSON.stringify(users, null, 2))
    fs.writeFileSync('export/accounts.json', JSON.stringify(accounts, null, 2))
    fs.writeFileSync('export/sessions.json', JSON.stringify(sessions, null, 2))
    fs.writeFileSync('export/verificationTokens.json', JSON.stringify(verificationTokens, null, 2))
    fs.writeFileSync('export/listings.json', JSON.stringify(listings, null, 2))
    fs.writeFileSync('export/bookings.json', JSON.stringify(bookings, null, 2))
    fs.writeFileSync('export/wishlists.json', JSON.stringify(wishlists, null, 2))
    fs.writeFileSync('export/reviews.json', JSON.stringify(reviews, null, 2))
    fs.writeFileSync('export/transactions.json', JSON.stringify(transactions, null, 2))
    fs.writeFileSync('export/chatRooms.json', JSON.stringify(chatRooms, null, 2))
    fs.writeFileSync('export/messages.json', JSON.stringify(messages, null, 2))

    console.log('Data exported successfully!')
  } catch (error) {
    console.error('Error exporting data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()
```

Run this script with:
```bash
node scripts/export-data.js
```

## Step 5: Import Data to Supabase

Create a script to import the data into Supabase:

```javascript
// scripts/import-to-supabase.js
const { supabase } = require('../lib/supabaseClient')
const fs = require('fs')

async function importData() {
  try {
    // Read exported data
    const users = JSON.parse(fs.readFileSync('export/users.json', 'utf8'))
    const accounts = JSON.parse(fs.readFileSync('export/accounts.json', 'utf8'))
    const sessions = JSON.parse(fs.readFileSync('export/sessions.json', 'utf8'))
    const verificationTokens = JSON.parse(fs.readFileSync('export/verificationTokens.json', 'utf8'))
    const listings = JSON.parse(fs.readFileSync('export/listings.json', 'utf8'))
    const bookings = JSON.parse(fs.readFileSync('export/bookings.json', 'utf8'))
    const wishlists = JSON.parse(fs.readFileSync('export/wishlists.json', 'utf8'))
    const reviews = JSON.parse(fs.readFileSync('export/reviews.json', 'utf8'))
    const transactions = JSON.parse(fs.readFileSync('export/transactions.json', 'utf8'))
    const chatRooms = JSON.parse(fs.readFileSync('export/chatRooms.json', 'utf8'))
    const messages = JSON.parse(fs.readFileSync('export/messages.json', 'utf8'))

    // Import data (in the correct order to respect foreign key constraints)
    console.log('Importing users...')
    const { error: userError } = await supabase.from('User').insert(users)
    if (userError) throw userError

    console.log('Importing accounts...')
    const { error: accountError } = await supabase.from('Account').insert(accounts)
    if (accountError) throw accountError

    console.log('Importing sessions...')
    const { error: sessionError } = await supabase.from('Session').insert(sessions)
    if (sessionError) throw sessionError

    console.log('Importing verification tokens...')
    const { error: vtError } = await supabase.from('VerificationToken').insert(verificationTokens)
    if (vtError) throw vtError

    console.log('Importing listings...')
    const { error: listingError } = await supabase.from('Listing').insert(listings)
    if (listingError) throw listingError

    console.log('Importing bookings...')
    const { error: bookingError } = await supabase.from('Booking').insert(bookings)
    if (bookingError) throw bookingError

    console.log('Importing wishlists...')
    const { error: wishlistError } = await supabase.from('Wishlist').insert(wishlists)
    if (wishlistError) throw wishlistError

    console.log('Importing reviews...')
    const { error: reviewError } = await supabase.from('Review').insert(reviews)
    if (reviewError) throw reviewError

    console.log('Importing transactions...')
    const { error: transactionError } = await supabase.from('Transaction').insert(transactions)
    if (transactionError) throw transactionError

    console.log('Importing chat rooms...')
    const { error: chatRoomError } = await supabase.from('ChatRoom').insert(chatRooms)
    if (chatRoomError) throw chatRoomError

    console.log('Importing messages...')
    const { error: messageError } = await supabase.from('Message').insert(messages)
    if (messageError) throw messageError

    console.log('Data imported successfully!')
  } catch (error) {
    console.error('Error importing data:', error)
  }
}

importData()
```

## Step 6: Update Application Code

You'll need to replace all Prisma calls with Supabase calls throughout your application. Here's an example of how to convert a Prisma query to Supabase:

**Prisma version:**
```typescript
const listings = await prisma.listing.findMany({
  where: {
    ownerId: userId
  },
  include: {
    owner: true
  }
})
```

**Supabase version:**
```typescript
const { data: listings, error } = await supabase
  .from('Listing')
  .select('*, owner:User(*)')
  .eq('ownerId', userId)
```

## Important Considerations

1. **Authentication**: NextAuth.js is configured to work with Prisma. You'll need to either:
   - Configure NextAuth to work with Supabase, or
   - Replace NextAuth with Supabase Auth

2. **Real-time Features**: Supabase provides real-time capabilities that you can leverage for chat functionality.

3. **Row Level Security**: Consider implementing RLS policies in Supabase for data security.

4. **Performance**: Review and optimize queries as Supabase and Prisma have different performance characteristics.

## Testing

After migration:
1. Test all CRUD operations
2. Verify authentication works
3. Test chat functionality
4. Check booking and payment flows
5. Validate data integrity

## Rollback Plan

Keep your PostgreSQL database as a backup until you're confident the Supabase migration is successful.