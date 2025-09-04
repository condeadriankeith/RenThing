// scripts/import-to-supabase.js
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key are required. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function importData() {
  try {
    console.log('Starting data import to Supabase...')
    
    // Check if export directory exists
    const exportDir = path.join(__dirname, '..', 'export')
    if (!fs.existsSync(exportDir)) {
      console.error('Export directory not found. Please run the export script first.')
      process.exit(1)
    }
    
    // Read exported data
    console.log('Reading exported data...')
    const users = JSON.parse(fs.readFileSync(path.join(exportDir, 'users.json'), 'utf8'))
    const accounts = JSON.parse(fs.readFileSync(path.join(exportDir, 'accounts.json'), 'utf8'))
    const sessions = JSON.parse(fs.readFileSync(path.join(exportDir, 'sessions.json'), 'utf8'))
    const verificationTokens = JSON.parse(fs.readFileSync(path.join(exportDir, 'verificationTokens.json'), 'utf8'))
    const listings = JSON.parse(fs.readFileSync(path.join(exportDir, 'listings.json'), 'utf8'))
    const bookings = JSON.parse(fs.readFileSync(path.join(exportDir, 'bookings.json'), 'utf8'))
    const wishlists = JSON.parse(fs.readFileSync(path.join(exportDir, 'wishlists.json'), 'utf8'))
    const reviews = JSON.parse(fs.readFileSync(path.join(exportDir, 'reviews.json'), 'utf8'))
    const transactions = JSON.parse(fs.readFileSync(path.join(exportDir, 'transactions.json'), 'utf8'))
    const chatRooms = JSON.parse(fs.readFileSync(path.join(exportDir, 'chatRooms.json'), 'utf8'))
    const messages = JSON.parse(fs.readFileSync(path.join(exportDir, 'messages.json'), 'utf8'))
    
    console.log(`Data loaded:
      - Users: ${users.length}
      - Accounts: ${accounts.length}
      - Sessions: ${sessions.length}
      - Verification Tokens: ${verificationTokens.length}
      - Listings: ${listings.length}
      - Bookings: ${bookings.length}
      - Wishlists: ${wishlists.length}
      - Reviews: ${reviews.length}
      - Transactions: ${transactions.length}
      - Chat Rooms: ${chatRooms.length}
      - Messages: ${messages.length}
    `)
    
    // Import data (in the correct order to respect foreign key constraints)
    console.log('Importing users...')
    if (users.length > 0) {
      const { error: userError } = await supabase.from('User').insert(users)
      if (userError) throw new Error(`Error importing users: ${userError.message}`)
    }
    
    console.log('Importing accounts...')
    if (accounts.length > 0) {
      const { error: accountError } = await supabase.from('Account').insert(accounts)
      if (accountError) throw new Error(`Error importing accounts: ${accountError.message}`)
    }
    
    console.log('Importing sessions...')
    if (sessions.length > 0) {
      const { error: sessionError } = await supabase.from('Session').insert(sessions)
      if (sessionError) throw new Error(`Error importing sessions: ${sessionError.message}`)
    }
    
    console.log('Importing verification tokens...')
    if (verificationTokens.length > 0) {
      const { error: vtError } = await supabase.from('VerificationToken').insert(verificationTokens)
      if (vtError) throw new Error(`Error importing verification tokens: ${vtError.message}`)
    }
    
    console.log('Importing listings...')
    if (listings.length > 0) {
      const { error: listingError } = await supabase.from('Listing').insert(listings)
      if (listingError) throw new Error(`Error importing listings: ${listingError.message}`)
    }
    
    console.log('Importing bookings...')
    if (bookings.length > 0) {
      const { error: bookingError } = await supabase.from('Booking').insert(bookings)
      if (bookingError) throw new Error(`Error importing bookings: ${bookingError.message}`)
    }
    
    console.log('Importing wishlists...')
    if (wishlists.length > 0) {
      const { error: wishlistError } = await supabase.from('Wishlist').insert(wishlists)
      if (wishlistError) throw new Error(`Error importing wishlists: ${wishlistError.message}`)
    }
    
    console.log('Importing reviews...')
    if (reviews.length > 0) {
      const { error: reviewError } = await supabase.from('Review').insert(reviews)
      if (reviewError) throw new Error(`Error importing reviews: ${reviewError.message}`)
    }
    
    console.log('Importing transactions...')
    if (transactions.length > 0) {
      const { error: transactionError } = await supabase.from('Transaction').insert(transactions)
      if (transactionError) throw new Error(`Error importing transactions: ${transactionError.message}`)
    }
    
    console.log('Importing chat rooms...')
    if (chatRooms.length > 0) {
      const { error: chatRoomError } = await supabase.from('ChatRoom').insert(chatRooms)
      if (chatRoomError) throw new Error(`Error importing chat rooms: ${chatRoomError.message}`)
    }
    
    console.log('Importing messages...')
    if (messages.length > 0) {
      const { error: messageError } = await supabase.from('Message').insert(messages)
      if (messageError) throw new Error(`Error importing messages: ${messageError.message}`)
    }
    
    console.log('Data imported successfully!')
    console.log('Migration completed. You can now update your application to use Supabase instead of Prisma.')
  } catch (error) {
    console.error('Error importing data:', error.message)
    process.exit(1)
  }
}

// Run the import function
importData()