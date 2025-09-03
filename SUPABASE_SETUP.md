# Supabase Setup Guide for RenThing

## Overview

This guide explains how to set up Supabase for the RenThing rental marketplace application. Supabase is used for authentication and real-time features.

## Prerequisites

1. A Supabase account (free tier available at [supabase.com](https://supabase.com))
2. A Supabase project created
3. Basic understanding of environment variables

## Setting Up Supabase

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up or log in
2. Click "New Project"
3. Choose an organization or create a new one
4. Enter a project name (e.g., "RenThing")
5. Select a region closest to your users
6. Set a strong database password
7. Click "Create New Project"

### 2. Get Your API Keys

1. After your project is created, go to the project dashboard
2. In the left sidebar, click on "Project Settings" (gear icon)
3. Click on "API" in the settings menu
4. Copy the following values:
   - Project URL (labeled "Project URL")
   - anon key (labeled "Project API keys" → "anon" key)
   - service_role key (labeled "Project API keys" → "service_role" key)

### 3. Configure Environment Variables

Add the following environment variables to your project:

#### For Local Development (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL="your-project-url-here"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key-here"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key-here"
```

#### For Vercel Deployment
In your Vercel project dashboard:
1. Go to Settings → Environment Variables
2. Add the following variables:
   - `supabase_url` with your Project URL
   - `supabase_anon_key` with your anon key
   - `supabase_service_role_key` with your service_role key

### 4. Database Schema Setup

The application uses Prisma for database operations, but Supabase can be used for authentication. You don't need to set up tables in Supabase if you're using the existing Prisma setup.

However, if you want to use Supabase for authentication, you may need to synchronize user data between Prisma and Supabase.

### 5. Authentication Setup

The middleware uses Supabase for authentication. Make sure your Supabase project has authentication enabled:

1. In your Supabase dashboard, go to "Authentication" in the left sidebar
2. Click on "Providers"
3. Enable the authentication providers you want to support (Email, Google, etc.)

### 6. Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000
3. Try to access a protected route like /my-bookings
4. You should be redirected to the login page

## Troubleshooting

### Common Issues

1. **"Your project's URL and Key are required" Error**
   - Make sure all three environment variables are set:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY`

2. **Authentication Not Working**
   - Check that the Supabase project has authentication enabled
   - Verify that the API keys are correct
   - Ensure environment variables are properly loaded

3. **CORS Issues**
   - In your Supabase dashboard, go to "Settings" → "API"
   - Check the "Allowed CORS origins" section
   - Add your domain (e.g., http://localhost:3000 for development)

### Environment Variable Verification

You can verify that your environment variables are loaded correctly by adding temporary logging to your middleware:

```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Supabase Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

**Important:** Remove these logs before deploying to production as they could expose sensitive information.

## Security Best Practices

1. Never commit actual API keys to version control
2. Use different keys for development and production
3. Regularly rotate your API keys
4. Restrict CORS origins to only trusted domains
5. Use the anon key for client-side operations and service_role key only for server-side operations

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Authentication Guide](https://supabase.com/docs/guides/auth)
- [Supabase JavaScript Client Library](https://supabase.com/docs/reference/javascript/introduction)