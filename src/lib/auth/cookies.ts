/**
 * Secure cookie utilities for authentication
 * Following OWASP recommendations for cookie security
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// Cookie configuration
export const COOKIE_CONFIG = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
};

// Cookie names
export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'auth-token',
  REFRESH_TOKEN: 'refresh-token',
  SESSION_ID: 'session-id',
} as const;

// Cookie expiration times (in seconds)
export const COOKIE_MAX_AGE = {
  ACCESS_TOKEN: 15 * 60,        // 15 minutes
  REFRESH_TOKEN: 7 * 24 * 60 * 60, // 7 days
  SESSION_ID: 7 * 24 * 60 * 60,    // 7 days
} as const;

/**
 * Set authentication cookies
 * @param response - NextResponse object
 * @param accessToken - Access token
 * @param refreshToken - Refresh token
 * @param sessionId - Session ID (optional)
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
  sessionId?: string
): void {
  // Set access token cookie
  response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...COOKIE_CONFIG,
    maxAge: COOKIE_MAX_AGE.ACCESS_TOKEN,
  });

  // Set refresh token cookie
  response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...COOKIE_CONFIG,
    maxAge: COOKIE_MAX_AGE.REFRESH_TOKEN,
  });

  // Set session ID cookie if provided
  if (sessionId) {
    response.cookies.set(COOKIE_NAMES.SESSION_ID, sessionId, {
      ...COOKIE_CONFIG,
      maxAge: COOKIE_MAX_AGE.SESSION_ID,
    });
  }
}

/**
 * Clear authentication cookies
 * @param response - NextResponse object
 */
export function clearAuthCookies(response: NextResponse): void {
  const expiredConfig = {
    ...COOKIE_CONFIG,
    maxAge: 0,
    expires: new Date(0),
  };

  response.cookies.set(COOKIE_NAMES.ACCESS_TOKEN, '', expiredConfig);
  response.cookies.set(COOKIE_NAMES.REFRESH_TOKEN, '', expiredConfig);
  response.cookies.set(COOKIE_NAMES.SESSION_ID, '', expiredConfig);
}

/**
 * Get authentication cookies
 * @returns Object with token values
 */
export async function getAuthCookies(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  sessionId: string | null;
}> {
  try {
    const cookieStore = await cookies();
    
    return {
      accessToken: cookieStore.get(COOKIE_NAMES.ACCESS_TOKEN)?.value || null,
      refreshToken: cookieStore.get(COOKIE_NAMES.REFRESH_TOKEN)?.value || null,
      sessionId: cookieStore.get(COOKIE_NAMES.SESSION_ID)?.value || null,
    };
  } catch (error) {
    return {
      accessToken: null,
      refreshToken: null,
      sessionId: null,
    };
  }
}

/**
 * Validate cookie security settings
 * @returns boolean - True if cookies are configured securely
 */
export function validateCookieSecurity(): boolean {
  const isProduction = process.env.NODE_ENV === 'production';
  
  // In production, cookies must be secure
  if (isProduction && !COOKIE_CONFIG.secure) {
    return false;
  }
  
  // HttpOnly must always be true for auth cookies
  if (!COOKIE_CONFIG.httpOnly) {
    return false;
  }
  
  // SameSite should be strict for auth cookies
  if (COOKIE_CONFIG.sameSite !== 'strict') {
    return false;
  }
  
  return true;
}

/**
 * Create a secure cookie string for Set-Cookie header
 * @param name - Cookie name
 * @param value - Cookie value
 * @param maxAge - Max age in seconds
 * @returns string - Cookie string
 */
export function createSecureCookieString(
  name: string,
  value: string,
  maxAge: number
): string {
  const parts = [
    `${name}=${value}`,
    `Max-Age=${maxAge}`,
    `Path=${COOKIE_CONFIG.path}`,
    `SameSite=${COOKIE_CONFIG.sameSite}`,
  ];

  if (COOKIE_CONFIG.httpOnly) {
    parts.push('HttpOnly');
  }

  if (COOKIE_CONFIG.secure) {
    parts.push('Secure');
  }

  return parts.join('; ');
}
