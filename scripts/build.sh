# Build script for Vercel deployment
echo "Starting build process..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push database schema (for SQLite this creates the db file if it doesn't exist)
echo "Setting up database..."
npx prisma db push --accept-data-loss

# Seed the database with initial data
echo "Seeding database..."
npm run db:seed

echo "Build process completed!"