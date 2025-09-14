# Vercel Deployment Guide for RenThing

This guide will help you properly configure your Vercel deployment to avoid the "NO_SECRET" error with NextAuth.

## Environment Variables Required

You need to set the following environment variables in your Vercel project settings:

1. `NEXTAUTH_SECRET` - A random string used to hash tokens, sign cookies and generate cryptographic keys
2. `DATABASE_URL` - Your production database connection string
3. `NEXTAUTH_URL` - Your production site URL (e.g., https://your-site.vercel.app)

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to the "Settings" tab
4. Click on "Environment Variables" in the left sidebar
5. Add the following variables:

### NEXTAUTH_SECRET
- Key: `NEXTAUTH_SECRET`
- Value: A long random string (at least 32 characters)
- You can generate one using this command in your terminal:
  ```bash
  openssl rand -hex 32
  ```
- Type: "Production"

### DATABASE_URL
- Key: `DATABASE_URL`
- Value: Your production database connection string
- Type: "Production"

### NEXTAUTH_URL
- Key: `NEXTAUTH_URL`
- Value: Your production URL (e.g., https://your-renthing-app.vercel.app)
- Type: "Production"

## Regenerating Prisma Client

If you make changes to your database schema, you may need to regenerate the Prisma client:

```bash
npx prisma generate
```

## Troubleshooting

If you're still getting the "NO_SECRET" error:

1. Make sure all environment variables are set in Vercel project settings (not just in .env files)
2. Redeploy your application after setting the environment variables
3. Check the deployment logs for any error messages
4. Ensure your NEXTAUTH_SECRET is at least 32 characters long

## Local Development

For local development, make sure your `.env.local` file contains:

```
NEXTAUTH_SECRET=your_long_random_string_here
DATABASE_URL=your_database_connection_string
NEXTAUTH_URL=http://localhost:3000
```