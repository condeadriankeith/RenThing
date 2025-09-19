# MariaDB Migration Guide for RenThing

This document outlines the steps taken to migrate the RenThing database from the previous setup to MariaDB with phpMyAdmin for local development.

## Migration Summary

The migration involved the following key steps:

1. **Database Configuration Update**
   - Created new `.env` file with MariaDB connection string
   - Updated Prisma schema to use MySQL provider
   - Removed existing SQLite migrations

2. **Database Schema Migration**
   - Created `renthing-db` database in phpMyAdmin
   - Generated new Prisma client for MySQL
   - Applied initial migration to create tables

3. **Data Seeding**
   - Seeded database with initial users and sample data
   - Verified data integrity and relationships

4. **Testing and Validation**
   - Tested database connectivity
   - Verified application functionality with development server

## Configuration Details

### Database Connection
```
DATABASE_URL="mysql://root:@127.0.0.1:3306/renthing-db"
```

### Prisma Schema Changes
- Changed provider from `postgresql` to `mysql`
- Added `@db.DateTime(6)` annotations for datetime fields
- Maintained all existing data models and relationships

## Verification Steps

1. Database connection test passed
2. User and listing data successfully retrieved
3. Next.js development server running without errors

## Next Steps

1. Update any deployment configurations to reflect the new database setup
2. Ensure all team members have the same MariaDB/phpMyAdmin setup
3. Update documentation to reflect the new local development environment

## Troubleshooting

If you encounter issues:

1. Verify MariaDB is running on localhost:3306
2. Check that the `renthing-db` database exists in phpMyAdmin
3. Ensure the root user has access with no password (default XAMPP setup)
4. Run `npx prisma generate` if Prisma client needs regeneration