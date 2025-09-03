import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import rateLimit from '@/lib/rate-limit';

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Add HSTS header for HTTPS
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Set CORS headers for all responses
  response.headers.append('Access-Control-Allow-Origin', '*');
  response.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  response.headers.append('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  response.headers.append('Access-Control-Allow-Credentials', 'true');

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const limiter = rateLimit({
      uniqueTokenPerInterval: 500,
      interval: 60000
    });

    try {
      await limiter.check(response, 10, identifier);
      response.headers.set('X-RateLimit-Limit', '10');
      response.headers.set('X-RateLimit-Remaining', '9');
      response.headers.set('X-RateLimit-Reset', '60');
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: 60 },
        { status: 429 }
      );
    }
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { status: 200, headers: response.headers });
  }

  return response;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};