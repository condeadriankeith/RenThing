# User Profile Enhancements Migration

This migration adds new fields to the User model to support the enhanced profile features:

- `bio`: User biography/description
- `location`: User's location
- `socialLinks`: Social media links (JSON)
- `responseTime`: Average response time in hours
- `isVerified`: Verification status
- `theme`: Profile theme preference
- `background`: Profile background image URL

Additionally, this migration creates the Achievement model for tracking user accomplishments.