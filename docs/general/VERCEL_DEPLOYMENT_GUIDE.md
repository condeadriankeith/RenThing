# Vercel Deployment Guide for RenThing

## Environment Variables Configuration

To successfully deploy RenThing to Vercel, you need to configure the following environment variables in your Vercel project dashboard.

### Required Environment Variables

1. **DATABASE_URL** - PostgreSQL connection string
   - Format: `postgresql://username:password@host:port/database_name`
   - Vercel Dashboard Name: `database_url`

2. **NEXTAUTH_SECRET** - Secret for NextAuth.js encryption
   - Generate with: `openssl rand -base64 32`
   - Vercel Dashboard Name: `nextauth_secret`

3. **NEXTAUTH_URL** - Your production URL
   - Format: `https://your-domain.vercel.app`
   - Vercel Dashboard Name: `nextauth_url`

### How to Configure in Vercel Dashboard

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Select "Environment Variables" from the sidebar
4. Add each variable with the following format:
   - Name: (Use the "Vercel Dashboard Name" from above)
   - Value: Your actual value for that variable
   - Environment: Select "Production" (and "Preview" if needed)

## Example Configuration

For a production deployment, you would add:

| Name | Value | Environment |
|------|-------|-------------|
| database_url | postgresql://user:pass@host:5432/renthing | Production |
| nextauth_secret | your-32-character-secret-here | Production |
| nextauth_url | https://your-domain.vercel.app | Production |

## Database Setup Options

### Option 1: Use a Managed PostgreSQL Service
- **Neon** (recommended for Vercel deployments): https://neon.tech

- **Railway**: https://railway.app
- **Render**: https://render.com

### Option 2: Use Vercel Postgres (if available in your plan)
- Vercel offers a Postgres database service that integrates seamlessly
- Check your Vercel dashboard for "Storage" → "Postgres"

## After Configuration

1. After adding all environment variables, redeploy your application
2. The build should now succeed as Prisma will be able to access the DATABASE_URL
3. Monitor the deployment logs to ensure all services initialize correctly

## Troubleshooting

If you still encounter issues:

1. **Verify all required environment variables are set**
   - Make sure you've added `database_url`, `nextauth_secret`, and `nextauth_url`
   - Check that the values are correct and properly formatted

2. **Check that your database URL is correctly formatted**
   - It should follow the pattern: `postgresql://username:password@host:port/database_name`
   - Make sure there are no extra spaces or special characters

3. **Ensure your database is accessible from Vercel**
   - Some database providers require you to whitelist Vercel's IP addresses
   - Check your database provider's documentation for Vercel compatibility

4. **Confirm that the database credentials are correct**
   - Test your database connection locally with the same credentials
   - Make sure the database user has the necessary permissions

## Common Database Providers Setup

### Neon Database Setup
1. Go to https://neon.tech and create an account
2. Create a new project
3. Copy the connection string (it will look like `postgresql://username:password@host.region.neon.tech/database_name`)
4. Add this as your `database_url` environment variable in Vercel

## Post-Deployment Steps

After successful deployment:

1. **Run database migrations** (if needed):
   ```bash
   npm run db:migrate
   ```

2. **Seed the database** with initial data:
   ```bash
   npm run db:seed
   ```

These commands should be run from your local machine or through a Vercel serverless function if you need to initialize your database after deployment.