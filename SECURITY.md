# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 6.x     | :white_check_mark: |
| < 6.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to adriankeithconde@gmail.com. All security vulnerabilities will be promptly addressed.

## Security Best Practices

### Environment Variables
- Never commit actual API keys or secrets to version control
- Use `.env.local` for local development (this file should be in `.gitignore`)
- Use `.env.example` as a template for other developers
- Use Vercel's secrets management for production deployments

### Sensitive Data Handling
- All sensitive data should be stored in environment variables
- Use `process.env` to access sensitive information in your code
- Never log sensitive information
- Rotate keys regularly

### Authentication
- Use strong, randomly generated secrets for NextAuth
- Implement proper session management
- Use HTTPS in production
- Implement rate limiting for authentication endpoints

### Database Security
- Use parameterized queries to prevent SQL injection
- Implement proper access controls
- Regularly update database software
- Use strong authentication for database access

### API Security
- Implement rate limiting
- Validate all input data
- Use proper authentication and authorization
- Implement CORS policies appropriately

### Frontend Security
- Sanitize user input before displaying
- Implement Content Security Policy (CSP)
- Use secure headers
- Prevent XSS attacks through proper escaping

## Key Files to Protect
- `.env.local`
- `.env.production`
- `vercel.json` (if it contains environment variables)
- Any configuration files containing secrets

## Immediate Actions After Secret Exposure
1. Rotate the exposed keys immediately
2. Revoke the exposed credentials
3. Audit logs for unauthorized access
4. Update all affected systems
5. Monitor for suspicious activity