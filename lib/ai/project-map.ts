/**
 * Project Map for REN AI - Complete directory structure and available pages/endpoints
 * This file provides REN with comprehensive knowledge of the project structure
 */

export interface ProjectRoute {
  path: string;
  description: string;
  type: 'page' | 'api' | 'directory';
  authRequired?: boolean;
  children?: ProjectRoute[];
}

export const PROJECT_MAP: ProjectRoute[] = [
  {
    path: '/',
    description: 'Homepage - Main landing page with search functionality',
    type: 'page'
  },
  {
    path: '/about',
    description: 'About page - Information about RenThing platform',
    type: 'page'
  },
  {
    path: '/ai-demo',
    description: 'AI Demo page - Demonstration of REN AI capabilities',
    type: 'page'
  },
  {
    path: '/browse',
    description: 'Browse page - Search and filter rental listings',
    type: 'page'
  },
  {
    path: '/chat',
    description: 'Chat page - Real-time messaging with other users',
    type: 'page',
    authRequired: true
  },
  {
    path: '/checkout',
    description: 'Checkout page - Complete rental bookings and payments',
    type: 'page',
    authRequired: true
  },
  {
    path: '/community',
    description: 'Community page - User community and discussions',
    type: 'page'
  },
  {
    path: '/contact',
    description: 'Contact page - Contact information and support',
    type: 'page'
  },
  {
    path: '/help',
    description: 'Help center - Comprehensive help and documentation',
    type: 'page',
    children: [
      {
        path: '/help/booking-guide',
        description: 'Booking guide - How to book rental items',
        type: 'page'
      },
      {
        path: '/help/browsing-items',
        description: 'Browsing items guide - How to search and browse listings',
        type: 'page'
      },
      {
        path: '/help/cancellation-policy',
        description: 'Cancellation policy - Rental cancellation rules',
        type: 'page'
      },
      {
        path: '/help/create-account',
        description: 'Create account guide - How to create a user account',
        type: 'page'
      },
      {
        path: '/help/creating-listings',
        description: 'Creating listings guide - How to list items for rent',
        type: 'page'
      },
      {
        path: '/help/identity-verification',
        description: 'Identity verification - User verification process',
        type: 'page'
      },
      {
        path: '/help/insurance-protection',
        description: 'Insurance protection - Rental insurance information',
        type: 'page'
      },
      {
        path: '/help/item-guidelines',
        description: 'Item guidelines - Rules for listing items',
        type: 'page'
      },
      {
        path: '/help/managing-bookings',
        description: 'Managing bookings guide - How to manage rentals',
        type: 'page'
      },
      {
        path: '/help/maximizing-earnings',
        description: 'Maximizing earnings - Tips for owners to earn more',
        type: 'page'
      },
      {
        path: '/help/payment-help',
        description: 'Payment help - Information about payment methods',
        type: 'page'
      },
      {
        path: '/help/pricing-guide',
        description: 'Pricing guide - How to price rental items',
        type: 'page'
      },
      {
        path: '/help/reporting-issues',
        description: 'Reporting issues - How to report problems',
        type: 'page'
      },
      {
        path: '/help/safety-guide',
        description: 'Safety guide - Safety tips for renting',
        type: 'page'
      },
      {
        path: '/help/service-fees',
        description: 'Service fees - Information about platform fees',
        type: 'page'
      },
      {
        path: '/help/setup-profile',
        description: 'Setup profile guide - How to configure user profile',
        type: 'page'
      }
    ]
  },
  {
    path: '/inbox',
    description: 'Inbox page - View and manage messages',
    type: 'page',
    authRequired: true
  },
  {
    path: '/list-item',
    description: 'List item page - Create new rental listings',
    type: 'page',
    authRequired: true
  },
  {
    path: '/listing',
    description: 'Listing detail page - View specific rental item details',
    type: 'page',
    children: [
      {
        path: '/listing/[id]',
        description: 'Specific listing page - View details of a specific item',
        type: 'page'
      }
    ]
  },
  {
    path: '/my-bookings',
    description: 'My bookings page - View and manage personal bookings',
    type: 'page',
    authRequired: true
  },
  {
    path: '/notes',
    description: 'Notes page - Internal documentation and notes',
    type: 'page'
  },
  {
    path: '/privacy',
    description: 'Privacy policy page - Platform privacy policy',
    type: 'page'
  },
  {
    path: '/profile',
    description: 'User profile page - View and edit personal profile',
    type: 'page',
    authRequired: true,
    children: [
      {
        path: '/profile/[id]',
        description: 'User profile page - View another user\'s public profile',
        type: 'page'
      }
    ]
  },
  {
    path: '/terms',
    description: 'Terms of service page - Platform terms and conditions',
    type: 'page'
  },
  {
    path: '/wishlist',
    description: 'Wishlist page - View saved favorite items',
    type: 'page',
    authRequired: true
  },
  {
    path: '/auth',
    description: 'Authentication pages - User login and registration',
    type: 'directory',
    children: [
      {
        path: '/auth/login',
        description: 'Login page - User authentication',
        type: 'page'
      },
      {
        path: '/auth/register',
        description: 'Registration page - Create new user account',
        type: 'page'
      },
      {
        path: '/auth/forgot-password',
        description: 'Forgot password page - Password reset functionality',
        type: 'page'
      }
    ]
  },
  {
    path: '/api',
    description: 'API endpoints - Backend services and data access',
    type: 'directory',
    children: [
      {
        path: '/api/admin',
        description: 'Admin API - Administrative functions',
        type: 'api'
      },
      {
        path: '/api/ai',
        description: 'AI API - Artificial intelligence services',
        type: 'api',
        children: [
          {
            path: '/api/ai/chat',
            description: 'AI Chat API - Process chat messages with AI',
            type: 'api'
          },
          {
            path: '/api/ai/live-data',
            description: 'AI Live Data API - Get real-time database information',
            type: 'api'
          },
          {
            path: '/api/ai/recommendations',
            description: 'AI Recommendations API - Get personalized recommendations',
            type: 'api'
          },
          {
            path: '/api/ai/suggestions',
            description: 'AI Suggestions API - Get contextual suggestions',
            type: 'api'
          }
        ]
      },
      {
        path: '/api/auth',
        description: 'Authentication API - User authentication services',
        type: 'api'
      },
      {
        path: '/api/bookings',
        description: 'Bookings API - Manage rental bookings',
        type: 'api'
      },
      {
        path: '/api/chat',
        description: 'Chat API - Real-time messaging services',
        type: 'api'
      },
      {
        path: '/api/health',
        description: 'Health API - System health checks',
        type: 'api'
      },
      {
        path: '/api/listings',
        description: 'Listings API - Manage rental listings',
        type: 'api'
      },
      {
        path: '/api/payments',
        description: 'Payments API - Process payments and transactions',
        type: 'api'
      },
      {
        path: '/api/reviews',
        description: 'Reviews API - Manage user reviews',
        type: 'api'
      },
      {
        path: '/api/scrape',
        description: 'Web Scraping API - Import listings from external sites',
        type: 'api'
      },
      {
        path: '/api/socket',
        description: 'Socket API - Real-time communication services',
        type: 'api'
      },
      {
        path: '/api/transactions',
        description: 'Transactions API - Manage payment transactions',
        type: 'api'
      },
      {
        path: '/api/upload',
        description: 'Upload API - File upload services',
        type: 'api'
      },
      {
        path: '/api/users',
        description: 'Users API - User management services',
        type: 'api'
      },
      {
        path: '/api/wishlist',
        description: 'Wishlist API - Manage user wishlists',
        type: 'api'
      }
    ]
  }
];

/**
 * Get all available routes as a flat array
 */
export function getAllRoutes(): ProjectRoute[] {
  const routes: ProjectRoute[] = [];
  
  function traverse(route: ProjectRoute) {
    routes.push(route);
    if (route.children) {
      route.children.forEach(traverse);
    }
  }
  
  PROJECT_MAP.forEach(traverse);
  return routes;
}

/**
 * Find a route by path
 */
export function findRouteByPath(path: string): ProjectRoute | undefined {
  const allRoutes = getAllRoutes();
  return allRoutes.find(route => route.path === path);
}

/**
 * Get all page routes
 */
export function getPageRoutes(): ProjectRoute[] {
  const allRoutes = getAllRoutes();
  return allRoutes.filter(route => route.type === 'page');
}

/**
 * Get all API routes
 */
export function getApiRoutes(): ProjectRoute[] {
  const allRoutes = getAllRoutes();
  return allRoutes.filter(route => route.type === 'api');
}