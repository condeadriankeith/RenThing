# Supabase Setup Guide for RenThing

This guide will help you set up Supabase for your RenThing application deployment on Vercel.

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login to your account
3. Click "New Project"
4. Fill in your project details:
   - **Name**: `renthing` (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select the closest region to your users

### 2. Get Your Supabase Credentials

After your project is created (takes ~2 minutes), go to Settings → API:

- **Project URL**: `https://your-project-id.supabase.co`
- **anon/public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **service_role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. Get Your Database Connection String

Go to Settings → Database:

- **Connection string**: `postgresql://postgres:[password]@db.your-project-id.supabase.co:5432/postgres`

## 🔧 Vercel Environment Variables Setup

### Option A: Using Vercel Dashboard (Recommended)

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
DATABASE_URL = postgresql://postgres:[password]@db.your-project-id.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Option B: Using Vercel CLI

If you have Vercel CLI installed:

```bash
# Set environment variables for production
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Set environment variables for preview deployments (optional)
vercel env add DATABASE_URL --environment preview
vercel env add NEXT_PUBLIC_SUPABASE_URL --environment preview
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY --environment preview
vercel env add SUPABASE_SERVICE_ROLE_KEY --environment preview
```

## 🗄️ Database Setup

After setting environment variables, run database migrations:

### Option A: Using Vercel Build Hooks

The database will be automatically set up during deployment.

### Option B: Manual Setup

If you need to run migrations manually:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Seed the database (optional)
npm run db:seed
```

## 🔐 Supabase Configuration

### Enable Row Level Security (RLS)

Go to your Supabase dashboard → SQL Editor and run:

```sql
-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Listing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Wishlist" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ChatRoom" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
```

### Create Database Policies

You'll need to create appropriate RLS policies for your tables. This is crucial for security.

## 🚀 Deploy to Vercel

1. Push your changes to GitHub
2. Vercel will automatically trigger a new deployment
3. The build should now succeed with Supabase integration

## 🧪 Testing Your Setup

After deployment:

1. Visit your deployed application
2. Try creating a user account
3. Test authentication flows
4. Verify database operations work

## 🔍 Troubleshooting

### Build Still Failing?

If you still get DATABASE_URL errors:

1. Check that all environment variables are set correctly in Vercel
2. Ensure the DATABASE_URL format is correct
3. Try redeploying manually from Vercel dashboard

### Authentication Issues?

1. Verify your Supabase keys are correct
2. Check that your Supabase project is active
3. Ensure RLS policies are configured properly

### Database Connection Issues?

1. Confirm your Supabase project is not paused
2. Check database password in connection string
3. Verify network connectivity

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review Supabase dashboard for errors
3. Verify all environment variables are set
4. Test database connection locally first

## 🎯 Next Steps

After successful setup:

1. Configure email authentication in Supabase
2. Set up file storage for images
3. Configure real-time subscriptions for chat
4. Set up monitoring and analytics

---

**Note**: Keep your service role key secure and never expose it in client-side code!
