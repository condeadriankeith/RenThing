# RenThing Environment Variables Guide

## Overview
This document provides a comprehensive guide to all environment variables required for the RenThing rental marketplace application.

## Required Environment Variables

### Database
- **DATABASE_URL**: Database connection string
  - Development: `file:./dev.db` (SQLite)
  - Production: PostgreSQL connection string (e.g., `postgresql://user:pass@host:port/db`)

### Authentication (NextAuth.js)
- **NEXTAUTH_URL**: Base URL for authentication callbacks
  - Example: `http://localhost:3000` (development), `https://yourdomain.com` (production)
- **NEXTAUTH_SECRET**: 32+ character random string for JWT encryption
  - Generate with: `openssl rand -base64 32`

### Payment Processing (Stripe)
- **STRIPE_SECRET_KEY**: Stripe secret API key
  - Format: `sk_live_...` (production), `sk_test_...` (testing)
- **STRIPE_PUBLISHABLE_KEY**: Stripe publishable API key
  - Format: `pk_live_...` (production), `pk_test_...` (testing)
- **STRIPE_WEBHOOK_SECRET**: Stripe webhook endpoint secret

### Payment Processing (Xendit)
- **XENDIT_SECRET_KEY**: Xendit API secret key
  - Format: Base64 encoded API key
- **XENDIT_API_KEY**: Xendit API key (alternative to secret key)

### Email Service (SMTP)
- **SMTP_HOST**: SMTP server hostname
  - Example: `smtp.gmail.com`, `smtp.sendgrid.net`
- **SMTP_PORT**: SMTP server port
  - Common: `587` (TLS), `465` (SSL), `25` (plain)
- **SMTP_USER**: SMTP authentication username
- **SMTP_PASS**: SMTP authentication password
- **SMTP_SECURE**: SSL/TLS configuration
  - Values: `true` (SSL), `false` (TLS/STARTTLS)
- **FROM_EMAIL**: Default sender email address
  - Example: `noreply@yourdomain.com`

### Image Storage (Cloudinary)
- **CLOUDINARY_CLOUD_NAME**: Cloudinary cloud name
- **CLOUDINARY_API_KEY**: Cloudinary API key
- **CLOUDINARY_API_SECRET**: Cloudinary API secret

### Search Service (MeiliSearch)
- **MEILISEARCH_HOST**: MeiliSearch server URL
  - Default: `http://localhost:7700`
- **MEILISEARCH_API_KEY**: MeiliSearch API key
  - Optional: Empty string for development

### Application Configuration
- **NEXT_PUBLIC_BASE_URL**: Public base URL for the application
  - Example: `http://localhost:3000`, `https://renthing.com`
- **NEXT_PUBLIC_APP_URL**: Alternative public URL variable
  - Used in email templates and redirects
- **NEXT_PUBLIC_SOCKET_URL**: WebSocket server URL
  - Default: `http://localhost:3000`
- **NEXT_PUBLIC_LOG_LEVEL**: Logging level
  - Values: `DEBUG`, `INFO`, `WARN`, `ERROR`

### Node.js Environment
- **NODE_ENV**: Application environment
  - Values: `development`, `production`, `test`

## Optional Environment Variables

### Monitoring & Analytics
- **ANALYTICS_ID**: Google Analytics tracking ID (optional)
- **SENTRY_DSN**: Sentry error tracking DSN (optional)

### Security
- **RATE_LIMIT_WINDOW_MS**: Rate limiting window in milliseconds
  - Default: `900000` (15 minutes)
- **RATE_LIMIT_MAX_REQUESTS**: Max requests per window
  - Default: `100`

### Upload Service (UploadThing)
- **UPLOADTHING_SECRET**: UploadThing API secret
- **UPLOADTHING_APP_ID**: UploadThing app ID

## Environment File Setup

### Development (.env.local)
```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-secret-here"

# Payments - Stripe (test mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Payments - Xendit (test mode)
XENDIT_SECRET_KEY="your-xendit-secret-key"
XENDIT_API_KEY="your-xendit-api-key"

# Email (optional for development)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_SECURE="false"
FROM_EMAIL="noreply@localhost"

# Cloudinary (optional for development)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# MeiliSearch
MEILISEARCH_HOST="http://localhost:7700"
MEILISEARCH_API_KEY=""

# Application
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_SOCKET_URL="http://localhost:3000"
NEXT_PUBLIC_LOG_LEVEL="DEBUG"

# Node.js
NODE_ENV="development"
```

### Production (.env.production)
```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"

# Authentication
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-32-character-secret"

# Payments - Stripe (live mode)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Payments - Xendit (live mode)
XENDIT_SECRET_KEY="your-live-xendit-secret-key"
XENDIT_API_KEY="your-live-xendit-api-key"

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
SMTP_SECURE="false"
FROM_EMAIL="noreply@yourdomain.com"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-production-cloud-name"
CLOUDINARY_API_KEY="your-production-api-key"
CLOUDINARY_API_SECRET="your-production-api-secret"

# MeiliSearch
MEILISEARCH_HOST="https://your-meilisearch-instance"
MEILISEARCH_API_KEY="your-meilisearch-master-key"

# Application
NEXT_PUBLIC_BASE_URL="https://yourdomain.com"
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NEXT_PUBLIC_SOCKET_URL="https://yourdomain.com"
NEXT_PUBLIC_LOG_LEVEL="INFO"

# Node.js
NODE_ENV="production"

# Optional
ANALYTICS_ID="G-XXXXXXXXXX"
SENTRY_DSN="https://xxxxxxxx@xxxxxxx.ingest.sentry.io/xxxxxxx"
```

## Service Setup Instructions

### Stripe
1. Create account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard → Developers → API keys
3. Configure webhooks for payment events

### Xendit
1. Create account at [xendit.co](https://xendit.co)
2. Get API keys from Dashboard → Settings → API Keys
3. Configure webhooks for payment notifications

### Cloudinary
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get credentials from Dashboard → Account Details

### MeiliSearch
1. Install locally or use cloud service
2. Get master key from configuration

### Email Service
Options: SendGrid, Mailgun, Gmail, or any SMTP provider

## Security Notes

- Never commit actual environment variables to version control
- Use different secrets for development and production
- Rotate secrets regularly, especially after team member changes
- Use environment-specific configuration files
- Consider using secret management services for production

## Troubleshooting

### Common Issues
1. **Missing NEXTAUTH_SECRET**: Authentication will fail
2. **Invalid DATABASE_URL**: Database connections will fail
3. **Stripe keys mismatch**: Payment processing will fail
4. **SMTP configuration**: Email delivery will fail

### Validation
Use the health check endpoints to verify services:
- `/api/health` - Application status
- `/api/health/db` - Database connectivity
- `/api/health/payments` - Payment services
- `/api/health/email` - Email service
