# Prisma Database Setup

This directory contains the Prisma schema and migration files for the RenThing application.

## Database Configuration

The application uses MySQL as its database with the following configuration:

- Database URL: `mysql://root:@127.0.0.1:3306/renthing-db`
- Environment file: `.env.local`

## Prisma Commands

### Generate Prisma Client
```bash
npx prisma generate
```

### Create Database Migrations
```bash
npx dotenv-cli -e .env.local npx prisma migrate dev --name migration_name
```

### Reset Database (Development Only)
```bash
npx dotenv-cli -e .env.local npx prisma migrate reset
```

### View Database in Prisma Studio
```bash
npx dotenv-cli -e .env.local npx prisma studio
```

## Seeding the Database

To seed the database with initial data:
```bash
npm run prisma:seed
```

## Database Schema

The database schema includes the following models:

- User
- Listing
- Booking
- Review
- Message
- Transaction
- Wishlist
- Achievement
- Purchase
- UserBadge
- Voucher
- VoucherRedemption

Each model has appropriate relations and constraints defined in the [schema.prisma](schema.prisma) file.