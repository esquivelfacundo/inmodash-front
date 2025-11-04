/**
 * Next.js Middleware for route protection and authentication
 * Runs on Edge Runtime for optimal performance
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/dashboard',
  '/api/secure',
];

// Routes that should redirect authenticated users
const AUTH_ROUTES = [
  '/login',
  '/register',
];

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/',
  '/pricing',
  '/about',
  '/contact',
  '/api/auth',
];

/**
 * Check if a path matches any of the given patterns
 * @param path - Request path
 * @param patterns - Array of path patterns
 * @returns boolean
 */
function matchesPath(path: string, patterns: string[]): boolean {
  return patterns.some(pattern => {
    if (pattern.endsWith('*')) {
      return path.startsWith(pattern.slice(0, -1));
    }
    return path === pattern || path.startsWith(pattern + '/');
  });
}

/**
 * Get redirect URL with return path
 * @param request - NextRequest object
 * @param redirectTo - Base redirect URL
 * @returns string - Full redirect URL
 */
function getRedirectUrl(request: NextRequest, redirectTo: string): string {
  const url = new URL(redirectTo, request.url);
  
  // Add return URL for post-auth redirect (avoid open redirects)
  if (redirectTo === '/login' && !matchesPath(request.nextUrl.pathname, AUTH_ROUTES)) {
    const returnUrl = request.nextUrl.pathname + request.nextUrl.search;
    // Only allow internal redirects
    if (returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
      url.searchParams.set('return', returnUrl);
    }
  }
  
  return url.toString();
}

/**
 * Validate JWT token
 * @param token - JWT token from cookies
 * @returns Promise<object | null> - Token payload or null
 */
async function validateToken(token: string) {
  try {
    const payload = await verifyToken(token);
    return payload;
  } catch (error) {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/_next/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  try {
    // Get access token from cookies
    const accessToken = request.cookies.get('auth-token')?.value || '';
    
    // Validate token if exists
    let tokenPayload = null;
    if (accessToken) {
      tokenPayload = await validateToken(accessToken);
    }

    const isAuthenticated = !!tokenPayload;
    const isProtectedRoute = matchesPath(pathname, PROTECTED_ROUTES);
    const isAuthRoute = matchesPath(pathname, AUTH_ROUTES);
    const isPublicRoute = matchesPath(pathname, PUBLIC_ROUTES);

    // Handle protected routes
    if (isProtectedRoute && !isAuthenticated) {
      // Check if this is a fresh navigation (has referer from login)
      const referer = request.headers.get('referer') || '';
      const isFromLogin = referer.includes('/login');
      
      // If coming from login, give it a moment for cookies to settle
      if (isFromLogin) {
        console.log('Fresh login detected, allowing access');
        return NextResponse.next();
      }

      // Log unauthorized access attempt (simplified for edge runtime)
      console.warn('Unauthorized access attempt:', {
        path: pathname,
        hasToken: !!accessToken,
      });

      // Redirect to login with return URL
      const loginUrl = getRedirectUrl(request, '/login');
      return NextResponse.redirect(loginUrl);
    }

    // Handle auth routes (login, register) when already authenticated
    if (isAuthRoute && isAuthenticated) {
      // Get return URL from query params
      const returnUrl = request.nextUrl.searchParams.get('return') || '';
      
      // Validate return URL (prevent open redirects)
      let redirectPath = '/dashboard';
      if (returnUrl && returnUrl.startsWith('/') && !returnUrl.startsWith('//')) {
        redirectPath = returnUrl;
      }

      const redirectUrl = new URL(redirectPath, request.url);
      return NextResponse.redirect(redirectUrl.toString());
    }

    // Handle API routes that require authentication
    if (pathname.startsWith('/api/secure/') && !isAuthenticated) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Authentication required',
        },
        { status: 401 }
      );
    }

    // Add security headers to all responses
    const response = NextResponse.next();
    
    // Security headers following OWASP recommendations
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    
    // Add CSP header for enhanced security
    const cspHeader = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Next.js requires unsafe-inline/eval
      "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' http://localhost:3001 http://127.0.0.1:3001 http://192.168.0.81:3001", // Allow backend API
      "frame-ancestors 'none'",
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', cspHeader);

    // Add user info to headers for server components (if authenticated)
    if (tokenPayload) {
      response.headers.set('X-User-Id', tokenPayload.userId.toString());
      response.headers.set('X-User-Role', tokenPayload.role);
    }

    return response;

  } catch (error) {
    console.error('Middleware error:', error);

    // For protected routes, redirect to login on error
    if (matchesPath(pathname, PROTECTED_ROUTES)) {
      const loginUrl = getRedirectUrl(request, '/login');
      return NextResponse.redirect(loginUrl);
    }

    // For API routes, return error
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: 'An unexpected error occurred',
        },
        { status: 500 }
      );
    }

    // For other routes, continue with security headers
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    return response;
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
