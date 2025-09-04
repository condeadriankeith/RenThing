const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function exportData() {
  try {
    console.log('Starting data export from Prisma database...')
    
    // Create export directory if it doesn't exist
    const fs = require('fs')
    const path = require('path')
    const exportDir = path.join(__dirname, '..', 'export')
    
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir)
    }
    
    // Export all data
    console.log('Exporting users...')
    const users = await prisma.user.findMany()
    fs.writeFileSync(path.join(exportDir, 'users.json'), JSON.stringify(users, null, 2))
    
    console.log('Exporting accounts...')
    const accounts = await prisma.account.findMany()
    fs.writeFileSync(path.join(exportDir, 'accounts.json'), JSON.stringify(accounts, null, 2))
    
    console.log('Exporting sessions...')
    const sessions = await prisma.session.findMany()
    fs.writeFileSync(path.join(exportDir, 'sessions.json'), JSON.stringify(sessions, null, 2))
    
    console.log('Exporting verification tokens...')
    const verificationTokens = await prisma.verificationToken.findMany()
    fs.writeFileSync(path.join(exportDir, 'verificationTokens.json'), JSON.stringify(verificationTokens, null, 2))
    
    console.log('Exporting listings...')
    const listings = await prisma.listing.findMany()
    fs.writeFileSync(path.join(exportDir, 'listings.json'), JSON.stringify(listings, null, 2))
    
    console.log('Exporting bookings...')
    const bookings = await prisma.booking.findMany()
    fs.writeFileSync(path.join(exportDir, 'bookings.json'), JSON.stringify(bookings, null, 2))
    
    console.log('Exporting wishlists...')
    const wishlists = await prisma.wishlist.findMany()
    fs.writeFileSync(path.join(exportDir, 'wishlists.json'), JSON.stringify(wishlists, null, 2))
    
    console.log('Exporting reviews...')
    const reviews = await prisma.review.findMany()
    fs.writeFileSync(path.join(exportDir, 'reviews.json'), JSON.stringify(reviews, null, 2))
    
    console.log('Exporting transactions...')
    const transactions = await prisma.transaction.findMany()
    fs.writeFileSync(path.join(exportDir, 'transactions.json'), JSON.stringify(transactions, null, 2))
    
    console.log('Exporting chat rooms...')
    const chatRooms = await prisma.chatRoom.findMany()
    fs.writeFileSync(path.join(exportDir, 'chatRooms.json'), JSON.stringify(chatRooms, null, 2))
    
    console.log('Exporting messages...')
    const messages = await prisma.message.findMany()
    fs.writeFileSync(path.join(exportDir, 'messages.json'), JSON.stringify(messages, null, 2))
    
    console.log('Data export completed successfully!')
    console.log('Exported files are located in the /export directory')
    console.log(`Total records exported:
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
  } catch (error) {
    console.error('Error exporting data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

exportData()