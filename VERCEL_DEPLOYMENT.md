# Vercel Deployment Guide

This guide explains how to properly deploy RenThing to Vercel with working authentication.

## Prerequisites

1. A GitHub repository with your RenThing code
2. A Vercel account
3. A PostgreSQL database (Vercel Postgres or external provider)

## Environment Variables Configuration

You must set the following environment variables in your Vercel project settings:

### Required Variables

1. `DATABASE_URL` - Your PostgreSQL database connection string
2. `NEXTAUTH_SECRET` - A strong secret key for NextAuth
3. `NEXTAUTH_URL` - Your deployed application URL

### Generating NEXTAUTH_SECRET

Generate a strong secret key using this command in your terminal:

```bash
openssl rand -hex 32
```

Or use this online generator: https://generate-secret.vercel.app/32

### Database Options

#### Option 1: Vercel Postgres (Recommended)

1. In your Vercel project, go to the "Storage" tab
2. Create a new PostgreSQL database
3. Vercel will automatically set the `DATABASE_URL` environment variable

#### Option 2: External PostgreSQL Provider

If using an external provider (Supabase, Render, AWS RDS, etc.):

1. Create a PostgreSQL database with your provider
2. Get the connection string
3. Add it as `DATABASE_URL` in your Vercel environment variables

## Deployment Steps

1. Push your code to GitHub
2. Create a new project on Vercel
3. Import your GitHub repository
4. Configure the environment variables in Vercel project settings:
   - `DATABASE_URL` (set by Vercel Postgres or your external provider)
   - `NEXTAUTH_SECRET` (your generated secret)
   - `NEXTAUTH_URL` (your Vercel deployment URL, e.g., https://your-app.vercel.app)
5. Deploy the project

## Troubleshooting

### Authentication Issues

If you're having authentication issues:

1. Verify all required environment variables are set in Vercel
2. Check that `NEXTAUTH_SECRET` is the same in both local and Vercel environments
3. Ensure `NEXTAUTH_URL` matches your deployed URL
4. Check the deployment logs for any error messages

### Database Issues

If you're having database issues:

1. Verify `DATABASE_URL` is correctly set
2. Check that your PostgreSQL database is accessible
3. Ensure Prisma migrations have run successfully

## Testing Your Deployment

After deployment:

1. Visit your deployed URL
2. Try to sign up for a new account
3. Try to log in with existing accounts
4. Verify that both operations work correctly

## Admin Accounts

The following admin accounts should work after deployment:

- Email: admin@renthing.com
- Password: (your existing password)

If you need to reset the password, you can do so through the application interface or by updating the database directly.