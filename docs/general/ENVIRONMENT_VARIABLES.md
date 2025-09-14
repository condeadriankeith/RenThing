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
  - Example: `http://localhost:3000` (development), `https://renthing.vercel.app` (production)
- **NEXTAUTH_SECRET**: 32+ character random string for JWT encryption
  - Generate with: `openssl rand -base64 32`

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
  - Example: `noreply@renthing.vercel.app`

### Image Storage (Cloudinary)
- **CLOUDINARY_CLOUD_NAME**: Cloudinary cloud name
- **CLOUDINARY_API_KEY**: Cloudinary API key
- **CLOUDINARY_API_SECRET**: Cloudinary API secret

### Application Configuration
- **NEXT_PUBLIC_BASE_URL**: Public base URL for the application
  - Example: `http://localhost:3000`, `https://renthing.vercel.app`
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
NEXTAUTH_URL="https://renthing.vercel.app"
NEXTAUTH_SECRET="Zx9g6O1soOptee9sTnB3ubh+oxfrvWLB2H2jWGsQuFk="

# Email (optional for development)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_SECURE="false"
FROM_EMAIL="noreply@localhost"

# Cloudinary (configured with your credentials)
CLOUDINARY_CLOUD_NAME="Root"
CLOUDINARY_API_KEY="338114178816117"
CLOUDINARY_API_SECRET="SHtjXMsHfCGM7ghUlvO_pJ_t95I"

# Application
NEXT_PUBLIC_BASE_URL="https://renthing.vercel.app"
NEXT_PUBLIC_APP_URL="https://renthing.vercel.app"
NEXT_PUBLIC_SOCKET_URL="https://renthing.vercel.app"
NEXT_PUBLIC_LOG_LEVEL="DEBUG"

# Node.js
NODE_ENV="development"
```

### Production (.env.production)
```env
# Database
DATABASE_URL="postgresql://user:pass@host:port/db"

# Authentication
NEXTAUTH_URL="https://renthing.vercel.app"
NEXTAUTH_SECRET="Zx9g6O1soOptee9sTnB3ubh+oxfrvWLB2H2jWGsQuFk="

# Email
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASS="your-sendgrid-api-key"
SMTP_SECURE="false"
FROM_EMAIL="noreply@renthing.vercel.app"

# Cloudinary (configured with your credentials)
CLOUDINARY_CLOUD_NAME="Root"
CLOUDINARY_API_KEY="338114178816117"
CLOUDINARY_API_SECRET="SHtjXMsHfCGM7ghUlvO_pJ_t95I"

# Application
NEXT_PUBLIC_BASE_URL="https://renthing.vercel.app"
NEXT_PUBLIC_APP_URL="https://renthing.vercel.app"
NEXT_PUBLIC_SOCKET_URL="https://renthing.vercel.app"
NEXT_PUBLIC_LOG_LEVEL="INFO"

# Node.js
NODE_ENV="production"

# Optional
ANALYTICS_ID="G-XXXXXXXXXX"
SENTRY_DSN="https://xxxxxxxx@xxxxxxx.ingest.sentry.io/xxxxxxx"
```

## Service Setup Instructions

### Cloudinary
1. Account already configured with provided credentials:
   - Cloud Name: `Root`
   - API Key: `338114178816117`
   - API Secret: `SHtjXMsHfCGM7ghUlvO_pJ_t95I`
2. Images will be stored in folders based on usage (e.g., `renthing/listings`)

### Ollama AI Service (Local AI Model)

For local AI functionality, Ollama can be used to run models on your machine:

- **OLLAMA_ENABLED**: Enable/disable Ollama integration
  - Values: `true`, `false`
  - Default: `false`
- **OLLAMA_HOST**: Ollama API endpoint
  - Default: `http://localhost:11434`
- **OLLAMA_MODEL**: Model name to use
  - Default: `phi3:mini`

When `OLLAMA_ENABLED` is set to `true`, the phi3:mini model will be automatically pulled during `npm install`.

Example configuration:
```env
# Ollama Configuration for local AI model
OLLAMA_ENABLED=true
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=phi3:mini
```

### Email Service