# Vercel Project ID

This file contains the Vercel project ID for future reference when making changes to the project configuration.

**Project ID:** prj_tI76KlJgYUYZU5CjIZZ1x6ZQNctQ

Use this ID when:
- Updating environment variables
- Making changes to project settings
- Configuring deployments
- Troubleshooting deployment issues

# Supabase Configuration

**Project URL:** https://aphczgukfgfbvgjwferw.supabase.co

**API Key:** [REDACTED FOR SECURITY]

## JavaScript Implementation

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
```

## Environment Variables for Vercel Deployment

For Vercel deployments, you need to set the following environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://aphczgukfgfbvgjwferw.supabase.co
SUPABASE_KEY=your-actual-supabase-service-key
```

## Security Notes

- Never commit actual API keys or secrets to version control
- Always use environment variables for sensitive information
- Use Vercel's secrets management for production deployments