# Security Action Plan

## 1. Immediate Actions (Within 24 hours)

### 1.1 Identify and Remove Hardcoded Secrets
- Scan entire codebase for hardcoded credentials
- Remove any exposed secrets from code
- Rotate any compromised credentials

### 1.2 Implement Environment Variables
- Create `.env.example` template file
- Move all sensitive configuration to environment variables
- Update code to use environment variables instead of hardcoded values

### 1.3 Update Git Configuration
- Add `.env` and `.env.local` to `.gitignore`
- Ensure no sensitive files are tracked by Git

## 2. Short-term Actions (Within 1 week)

### 2.1 Security Policy Documentation
- Create `SECURITY.md` file with security policy
- Document responsible disclosure process
- Define security contact information

### 2.2 Key Rotation Helper Script
- Create script to help rotate API keys and secrets
- Include instructions for updating environment variables
- Provide validation checks

### 2.3 Monitoring and Auditing
- Set up automated secret scanning in CI/CD pipeline
- Implement log monitoring for suspicious activities
- Schedule regular security audits

## 3. Long-term Actions (Within 1 month)

### 3.1 Production System Updates
- Deploy updated code with environment variables
- Update production systems with new secure configuration
- Test all functionality with new configuration

### 3.2 Team Training
- Conduct security best practices training
- Establish coding standards for secret management
- Create documentation for secure development practices

### 3.3 Compliance and Validation
- Verify compliance with data protection regulations
- Conduct penetration testing
- Implement security monitoring tools

## 4. Implementation Steps

### Step 1: Remove Hardcoded Credentials
1. Scan codebase for hardcoded secrets:
   ```bash
   grep -r "sk_live\|sk_test\|xnd_\|api_key" .
   ```
2. Remove exposed secrets from code
3. Rotate any compromised credentials

### Step 2: Implement Environment Variables
1. Create `.env.example`:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/renthing
   
   # NextAuth
   NEXTAUTH_SECRET=your-nextauth-secret
   NEXTAUTH_URL=http://localhost:3000
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # Meilisearch
   MEILISEARCH_HOST=http://localhost:7700
   MEILISEARCH_MASTER_KEY=your-master-key
   ```
2. Update `.gitignore`:
   ```gitignore
   .env
   .env.local
   .env.production
   ```
3. Update code to use environment variables:
   ```typescript
   // Before
   const cloudinary = require('cloudinary').v2
   cloudinary.config({
     cloud_name: 'hardcoded-name',
     api_key: 'hardcoded-key',
     api_secret: 'hardcoded-secret'
   })
   
   // After
   const cloudinary = require('cloudinary').v2
   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET
   })
   ```

### Step 3: Create Security Policy
Create `SECURITY.md`:
```markdown
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please send an email to [security@renthing.com](mailto:security@renthing.com). All security vulnerabilities will be promptly addressed.

Please do not publicly disclose the vulnerability until it has been addressed by the team.

## Security Best Practices

1. Never commit secrets to the repository
2. Use environment variables for all sensitive configuration
3. Regularly rotate API keys and secrets
4. Implement proper authentication and authorization
5. Keep dependencies up to date
6. Validate and sanitize all user input
7. Use HTTPS in production
8. Implement proper error handling
9. Regularly audit code for security issues
10. Follow the principle of least privilege
```

### Step 4: Create Key Rotation Script
Create `scripts/rotate-keys.js`:
```javascript
#!/usr/bin/env node

console.log('=== API Key Rotation Helper ===\n');

console.log('1. Cloudinary Keys:');
console.log('   - Log into your Cloudinary dashboard');
console.log('   - Navigate to Settings > Account');
console.log('   - Generate new API Key and Secret');
console.log('   - Update environment variables:\n');
console.log('     CLOUDINARY_CLOUD_NAME=your-new-cloud-name');
console.log('     CLOUDINARY_API_KEY=your-new-api-key');
console.log('     CLOUDINARY_API_SECRET=your-new-api-secret\n');

console.log('2. NextAuth Secret:');
console.log('   - Generate new secret:\n');
console.log('     openssl rand -base64 32\n');
console.log('   - Update environment variable:\n');
console.log('     NEXTAUTH_SECRET=your-new-secret\n');

console.log('4. Database Credentials:');
console.log('   - Rotate database password');
console.log('   - Update environment variable:\n');
console.log('     DATABASE_URL=your-new-database-url\n');

console.log('After updating keys, restart your application to apply changes.');
```

### Step 5: Set Up Monitoring
1. Add secret scanning to CI/CD pipeline:
   ```yaml
   # GitHub Actions example
   - name: Scan for secrets
     uses: zricethezav/gitleaks-action@v1.6.0
   ```
2. Implement log monitoring:
   ```javascript
   // Log suspicious activities
   app.use((req, res, next) => {
     if (req.headers.authorization && req.headers.authorization.includes('sk_live')) {
       console.warn('Potential secret exposure detected', {
         ip: req.ip,
         userAgent: req.get('User-Agent'),
         path: req.path
       });
     }
     next();
   });
   ```

## 5. Validation Checklist

Before considering this task complete, ensure:

- [ ] All hardcoded secrets have been removed from code
- [ ] All sensitive configuration uses environment variables
- [ ] `.env` files are in `.gitignore`
- [ ] `SECURITY.md` file has been created
- [ ] Key rotation script has been implemented
- [ ] CI/CD pipeline includes secret scanning
- [ ] Production systems have been updated
- [ ] Functionality has been tested with new configuration
- [ ] GitGuardian or similar tool shows no active issues