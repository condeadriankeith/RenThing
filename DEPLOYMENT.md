# RenThing Deployment Guide

## Environment Variables Required

### Database
- `DATABASE_URL` - PostgreSQL connection string (production)
  - Example: `postgresql://username:password@host:port/database_name`
  - **IMPORTANT**: This must be configured in your Vercel dashboard as a secret named `database_url`

### Authentication
- `NEXTAUTH_URL` - Base URL for NextAuth.js (e.g., `https://yourapp.com`)
- `NEXTAUTH_SECRET` - 32+ character random string for JWT encryption
  - **IMPORTANT**: This must be configured in your Vercel dashboard as a secret named `nextauth_secret`

### Payment Processing
- `STRIPE_SECRET_KEY` - Stripe secret key (sk_live...)
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (pk_live...)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook endpoint secret

### Email Service
- `EMAIL_FROM` - Default sender email address
- `EMAIL_SERVER_HOST` - SMTP server hostname
- `EMAIL_SERVER_PORT` - SMTP server port (587, 465, or 25)
- `EMAIL_SERVER_USER` - SMTP username
- `EMAIL_SERVER_PASSWORD` - SMTP password

### Image Storage
- `UPLOADTHING_SECRET` - UploadThing API secret
- `UPLOADTHING_APP_ID` - UploadThing app ID

### Monitoring & Analytics
- `ANALYTICS_ID` - Google Analytics tracking ID (optional)
- `SENTRY_DSN` - Sentry error tracking DSN (optional)

### Security
- `RATE_LIMIT_WINDOW_MS` - Rate limiting window in milliseconds (default: 900000)
- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window (default: 100)

## Vercel-Specific Configuration

### Setting Up Environment Variables in Vercel

The `vercel.json` file references environment variables using the `@` syntax:
- `@database_url` refers to a Vercel secret named `database_url`
- `@nextauth_secret` refers to a Vercel secret named `nextauth_secret`
- `@nextauth_url` refers to a Vercel secret named `nextauth_url`

To configure these in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add the following secrets:
   - Name: `database_url`, Value: Your PostgreSQL connection string
   - Name: `nextauth_secret`, Value: A 32+ character random string
   - Name: `nextauth_url`, Value: Your production URL (e.g., https://your-project.vercel.app)

### Database Setup Options

#### Option 1: Neon (Recommended)
1. Visit https://neon.tech and create a free account
2. Create a new project
3. Copy the connection string from the dashboard
4. Use this as your `database_url` secret in Vercel

#### Option 2: Supabase (Database Only)
1. Visit https://supabase.com and create a project
2. Go to "Settings" → "Database"
3. Copy the connection string
4. Use this as your `database_url` secret in Vercel

## Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured in Vercel dashboard
- [ ] Database migrations run (`npx prisma migrate deploy`)
- [ ] Prisma client generated (`npx prisma generate`)
- [ ] Environment-specific build configuration
- [ ] SSL certificate configured

### Build Process
```bash
npm ci --production=false
npm run build
npm run test
```

### Post-deployment
- [ ] Health check endpoint tested
- [ ] Payment webhooks configured
- [ ] Email delivery verified
- [ ] Database backup scheduled
- [ ] Monitoring alerts configured

### Security Headers
- [ ] Content-Security-Policy configured
- [ ] X-Frame-Options set to DENY
- [ ] X-Content-Type-Options set to nosniff
- [ ] Strict-Transport-Security enabled
- [ ] Referrer-Policy configured

## Infrastructure Requirements

### Minimum Specifications
- **CPU**: 2 vCPUs
- **Memory**: 4GB RAM
- **Storage**: 20GB SSD
- **Network**: 1GB bandwidth

### Recommended Specifications
- **CPU**: 4 vCPUs
- **Memory**: 8GB RAM
- **Storage**: 50GB SSD
- **Network**: 10GB bandwidth

### Database Requirements
- **PostgreSQL**: 13+ (recommended 15+)
- **Connection Pool**: 20-50 connections
- **Backup**: Daily automated backups
- **Monitoring**: Query performance monitoring

## Health Check Endpoints

- `/api/health` - Basic application health
- `/api/health/db` - Database connectivity
- `/api/health/payments` - Payment service status
- `/api/health/email` - Email service status

## Monitoring & Alerts

### Key Metrics
- Response time < 500ms
- Error rate < 1%
- Database connection pool usage < 80%
- Payment success rate > 95%

### Alert Channels
- Email notifications for critical errors
- Slack/Discord for deployment notifications
- SMS alerts for payment processing failures