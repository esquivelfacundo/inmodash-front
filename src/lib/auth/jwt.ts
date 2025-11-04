/**
 * JWT utilities using jose library for secure token handling
 * Following OWASP recommendations for JWT security
 */

import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

// JWT Configuration
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
);

const JWT_ISSUER = 'inmobiliaria-pro';
const JWT_AUDIENCE = 'inmobiliaria-pro-users';

// Token expiration times
export const TOKEN_EXPIRY = {
  ACCESS_TOKEN: '15m',    // 15 minutes
  REFRESH_TOKEN: '7d',    // 7 days
  EMAIL_VERIFICATION: '24h', // 24 hours
  PASSWORD_RESET: '1h',   // 1 hour
};

export interface TokenPayload extends JWTPayload {
  userId: number;
  email: string;
  role: string;
  name?: string;
  companyName?: string;
  type: 'access' | 'refresh' | 'email_verification' | 'password_reset';
}

/**
 * Create a JWT token
 * @param payload - Token payload
 * @param expiresIn - Token expiration time
 * @returns Promise<string> - Signed JWT token
 */
export async function createToken(
  payload: Omit<TokenPayload, 'iat' | 'exp' | 'iss' | 'aud'>,
  expiresIn: string = TOKEN_EXPIRY.ACCESS_TOKEN
): Promise<string> {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER)
      .setAudience(JWT_AUDIENCE)
      .setExpirationTime(expiresIn)
      .sign(JWT_SECRET);
  } catch (error) {
    throw new Error('Failed to create token');
  }
}

/**
 * Verify and decode a JWT token
 * @param token - JWT token to verify
 * @returns Promise<TokenPayload> - Decoded token payload
 */
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
    });
    
    return payload as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Create access and refresh token pair
 * @param userId - User ID
 * @param email - User email
 * @param role - User role
 * @param name - User name (optional)
 * @param companyName - Company name (optional)
 * @returns Promise<{accessToken: string, refreshToken: string}>
 */
export async function createTokenPair(
  userId: number, 
  email: string, 
  role: string,
  name?: string,
  companyName?: string
) {
  const [accessToken, refreshToken] = await Promise.all([
    createToken(
      { userId, email, role, name, companyName, type: 'access' },
      TOKEN_EXPIRY.ACCESS_TOKEN
    ),
    createToken(
      { userId, email, role, name, companyName, type: 'refresh' },
      TOKEN_EXPIRY.REFRESH_TOKEN
    ),
  ]);

  return { accessToken, refreshToken };
}

/**
 * Create email verification token
 * @param userId - User ID
 * @param email - User email
 * @returns Promise<string> - Email verification token
 */
export async function createEmailVerificationToken(userId: number, email: string): Promise<string> {
  return createToken(
    { userId, email, role: 'user', type: 'email_verification' },
    TOKEN_EXPIRY.EMAIL_VERIFICATION
  );
}

/**
 * Create password reset token
 * @param userId - User ID
 * @param email - User email
 * @returns Promise<string> - Password reset token
 */
export async function createPasswordResetToken(userId: number, email: string): Promise<string> {
  return createToken(
    { userId, email, role: 'user', type: 'password_reset' },
    TOKEN_EXPIRY.PASSWORD_RESET
  );
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns string | null - Extracted token or null
 */
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.substring(7);
}

/**
 * Get token from cookies
 * @param tokenName - Cookie name
 * @returns string | null - Token value or null
 */
export async function getTokenFromCookies(tokenName: string): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(tokenName);
    return cookie?.value || null;
  } catch (error) {
    return null;
  }
}
