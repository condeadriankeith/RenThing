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

### Optional Environment Variables

4. **STRIPE_SECRET_KEY** - Stripe secret API key
   - Vercel Dashboard Name: `stripe_secret_key`

5. **STRIPE_PUBLISHABLE_KEY** - Stripe publishable API key
   - Vercel Dashboard Name: `stripe_publishable_key`

6. **STRIPE_WEBHOOK_SECRET** - Stripe webhook secret
   - Vercel Dashboard Name: `stripe_webhook_secret`

7. **XENDIT_SECRET_KEY** - Xendit API secret key
   - Vercel Dashboard Name: `xendit_secret_key`

8. **SMTP_HOST** - SMTP server hostname
   - Vercel Dashboard Name: `smtp_host`

9. **SMTP_PORT** - SMTP server port
   - Vercel Dashboard Name: `smtp_port`

10. **SMTP_USER** - SMTP username
    - Vercel Dashboard Name: `smtp_user`

11. **SMTP_PASS** - SMTP password
    - Vercel Dashboard Name: `smtp_pass`

12. **FROM_EMAIL** - Default sender email
    - Vercel Dashboard Name: `from_email`

## How to Configure in Vercel Dashboard

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

## After Configuration

1. After adding all environment variables, redeploy your application
2. The build should now succeed as Prisma will be able to access the DATABASE_URL
3. Monitor the deployment logs to ensure all services initialize correctly

## Troubleshooting

If you still encounter issues:

1. Verify all required environment variables are set
2. Check that your database URL is correctly formatted
3. Ensure your database is accessible from Vercel (check firewall settings)
4. Confirm that the database credentials are correct