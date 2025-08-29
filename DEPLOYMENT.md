# RenThing Deployment Guide

## Environment Variables Required

### Database
- `DATABASE_URL` - PostgreSQL connection string (production)
- `DATABASE_URL` - SQLite path (development: `file:./dev.db`)

### Authentication
- `NEXTAUTH_URL` - Base URL for NextAuth.js (e.g., `https://yourapp.com`)
- `NEXTAUTH_SECRET` - 32+ character random string for JWT encryption

### Payment Processing
- `STRIPE_SECRET_KEY` - Stripe secret key (sk_live_...)
- `STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (pk_live_...)
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

## Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
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