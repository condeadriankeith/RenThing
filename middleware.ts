import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import rateLimit from '@/lib/rate-limit';

const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
};

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  );

  // This will refresh session if expired - required for Server Components
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    supabaseResponse.headers.set(key, value);
  });

  // Add HSTS header for HTTPS
  if (process.env.NODE_ENV === 'production') {
    supabaseResponse.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Set CORS headers for all responses
  supabaseResponse.headers.append('Access-Control-Allow-Origin', '*');
  supabaseResponse.headers.append('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT');
  supabaseResponse.headers.append('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  supabaseResponse.headers.append('Access-Control-Allow-Credentials', 'true');

  // Rate limiting for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous';
    const limiter = rateLimit({
      uniqueTokenPerInterval: 500,
      interval: 60000
    });

    try {
      await limiter.check(supabaseResponse, 10, identifier);
      supabaseResponse.headers.set('X-RateLimit-Limit', '10');
      supabaseResponse.headers.set('X-RateLimit-Remaining', '9');
      supabaseResponse.headers.set('X-RateLimit-Reset', '60');
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many requests', retryAfter: 60 },
        { status: 429 }
      );
    }
  }

  // Protect API routes - check for admin role in user metadata
  if (request.nextUrl.pathname.startsWith('/api/admin')) {
    if (!user || user.user_metadata?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Protect authenticated routes
  if (request.nextUrl.pathname.startsWith('/my-bookings') ||
      request.nextUrl.pathname.startsWith('/chat') ||
      request.nextUrl.pathname.startsWith('/inbox') ||
      request.nextUrl.pathname.startsWith('/list-item')) {
    if (!user) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { status: 200, headers: supabaseResponse.headers });
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
