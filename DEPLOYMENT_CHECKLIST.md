# RenThing Vercel Deployment Checklist

This checklist ensures all necessary steps are completed for a successful Vercel deployment with PostgreSQL.

## Pre-deployment Checklist

### [ ] Environment Variables Configuration
- [ ] `DATABASE_URL` - Set to PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Generated random string (32+ characters)
- [ ] `NEXTAUTH_URL` - Set to your Vercel deployment URL

### [ ] Database Setup
- [ ] Vercel Postgres database created
- [ ] Database connection tested locally
- [ ] Prisma schema updated for PostgreSQL (if needed)

### [ ] Code Verification
- [ ] All database queries compatible with PostgreSQL
- [ ] No SQLite-specific code in critical paths
- [ ] Environment variable handling verified

### [ ] Testing
- [ ] Admin login test successful
- [ ] Vendor login test successful
- [ ] Regular user login test successful
- [ ] Listing creation test successful
- [ ] All API endpoints tested

## Deployment Process

### [ ] 1. Push Code to Repository
- [ ] Commit all changes
- [ ] Push to main branch

### [ ] 2. Vercel Deployment
- [ ] Connect Vercel to repository
- [ ] Configure build settings
- [ ] Set environment variables in Vercel dashboard
- [ ] Trigger deployment

### [ ] 3. Post-deployment Verification
- [ ] Check deployment logs for errors
- [ ] Verify database connection
- [ ] Test admin login with credentials:
  - Email: admin@renthing.com
  - Password: admin123
- [ ] Test vendor login with credentials:
  - Email: vendor@renthing.com
  - Password: vendor123
- [ ] Test listing creation functionality
- [ ] Verify all environment variables are set correctly

## Troubleshooting

### Common Issues and Solutions

#### Database Connection Errors
- **Issue**: "Unable to open database file" or similar
- **Solution**: Ensure DATABASE_URL is set to PostgreSQL connection string, not SQLite file path

#### Authentication Errors
- **Issue**: "NO_SECRET" or login failures
- **Solution**: Verify NEXTAUTH_SECRET is set and is at least 32 characters long

#### Migration Errors
- **Issue**: Prisma migration failures
- **Solution**: Check database permissions and connection string format

#### Seeding Errors
- **Issue**: Initial data not created
- **Solution**: Run seeding manually with `npx prisma db seed`

## Post-deployment Tasks

### [ ] 1. Verify Admin Access
- [ ] Log in with admin credentials
- [ ] Access admin dashboard (if available)

### [ ] 2. Verify Vendor Functionality
- [ ] Log in with vendor credentials
- [ ] Create a test listing
- [ ] Verify listing appears in browse

### [ ] 3. Verify User Functionality
- [ ] Log in with regular user credentials
- [ ] Browse listings
- [ ] Test booking functionality (if available)

### [ ] 4. Monitor Application
- [ ] Check for runtime errors
- [ ] Monitor database connections
- [ ] Verify performance metrics

## Rollback Plan

If deployment fails:

1. Revert to previous working version
2. Identify and fix the issue
3. Test locally with same environment variables
4. Re-deploy with fixes

## Contact Information

For deployment issues, contact:
- Lead Developer: [Your Name]
- Database Administrator: [DBA Name]
- DevOps Engineer: [DevOps Name]

## Notes

- Always test changes locally before deploying
- Keep environment variables secure
- Monitor application performance after deployment
- Document any issues and solutions for future reference