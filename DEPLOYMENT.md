# RenThing Deployment Guide

## Environment Variables

For deployment, you'll need to set the following environment variables in your Vercel dashboard:

### Required Variables

- `DATABASE_URL` - PostgreSQL database connection string
- `NEXTAUTH_SECRET` - NextAuth secret key (generate with `openssl rand -base64 32`)
- `NEXTAUTH_URL` - Your deployed URL (e.g., `https://your-app.vercel.app`)

### Optional Variables

- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for image storage
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `MEILISEARCH_HOST` - Meilisearch host URL
- `MEILISEARCH_MASTER_KEY` - Meilisearch master key

## Vercel Deployment

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set the environment variables in the Vercel dashboard
4. Deploy!

## Database Setup

1. Create a PostgreSQL database (we recommend using a service like Supabase or Neon)
2. Run the Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```
3. Seed the database with initial data:
   ```bash
   npm run db:seed
   ```

## Post-Deployment

After deployment, you may want to:

1. Set up custom domain in Vercel dashboard
2. Configure analytics (Google Analytics, etc.)
3. Set up monitoring and error tracking (Sentry, etc.)
4. Configure CI/CD if not using Vercel's automatic deployments
