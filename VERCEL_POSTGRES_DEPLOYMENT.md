# Vercel Deployment Guide with PostgreSQL for RenThing

This guide will help you properly configure your Vercel deployment to use PostgreSQL instead of SQLite, which resolves the database connection issues.

## Prerequisites

1. A Vercel account
2. A PostgreSQL database (you can use Vercel Postgres integration)

## Step 1: Set Up Vercel Postgres

1. Go to your Vercel dashboard
2. Select your project or create a new one
3. Go to the "Storage" tab
4. Click "Create Database"
5. Select "PostgreSQL"
6. Choose your region and create the database

## Step 2: Configure Environment Variables

In your Vercel project settings, go to "Environment Variables" and add the following:

### Required Variables

1. `DATABASE_URL` - Your PostgreSQL connection string (provided by Vercel Postgres)
2. `NEXTAUTH_SECRET` - A random string used to hash tokens, sign cookies and generate cryptographic keys
3. `NEXTAUTH_URL` - Your production site URL (e.g., https://your-site.vercel.app)

### Generate NEXTAUTH_SECRET

You can generate a strong secret using this command in your terminal:
```bash
openssl rand -hex 32
```

Or use this online generator: https://generate-secret.vercel.app/32

### Example Configuration

```
DATABASE_URL=postgresql://default:your_password@your_host:5432/verceldb
NEXTAUTH_SECRET=your_64_character_hexadecimal_key_here
NEXTAUTH_URL=https://your-renthing-app.vercel.app
```

## Step 3: Update Your Code (Already Done)

The code in this repository has been updated to work with PostgreSQL. The key changes include:

1. Updated database setup scripts to run migrations and seed data
2. Improved error handling for database connections
3. Enhanced seeding script that checks for existing data

## Step 4: Deploy Your Application

1. Push your code to your Git repository
2. Vercel will automatically deploy your application
3. The deployment process will:
   - Install dependencies
   - Generate Prisma client
   - Run database migrations
   - Seed the database with initial data

## Admin Credentials

After deployment, you can log in using these credentials:
- Email: admin@renthing.com
- Password: admin123

## Vendor Credentials

For testing item listing functionality:
- Email: vendor@renthing.com
- Password: vendor123

## User Credentials

For regular user functionality:
- Email: user@renthing.com
- Password: user123

## Troubleshooting

### Database Connection Issues

If you're still getting database connection errors:

1. Ensure your DATABASE_URL is correctly set in Vercel environment variables
2. Check that your PostgreSQL database is properly configured
3. Verify that your Vercel Postgres integration is active

### Authentication Issues

If you're having trouble logging in:

1. Make sure NEXTAUTH_SECRET is set and is at least 32 characters long
2. Ensure NEXTAUTH_URL matches your deployed URL
3. Check the deployment logs for any authentication-related errors

### Seeding Issues

If the initial data is not being created:

1. Check the deployment logs for seeding errors
2. You can manually run the seed script with:
   ```bash
   npx prisma db seed
   ```

## Local Development with PostgreSQL (Optional)

If you want to use PostgreSQL for local development as well:

1. Install PostgreSQL locally or use a cloud PostgreSQL service
2. Update your `.env.local` file:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/renthing
   NEXTAUTH_SECRET=your_long_random_string_here
   NEXTAUTH_URL=http://localhost:3000
   ```
3. Run the database setup:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

## Additional Notes

- SQLite is not recommended for production deployments due to its file-based nature
- PostgreSQL provides better performance and reliability for production applications
- The seeding script is designed to be idempotent - it won't create duplicate data