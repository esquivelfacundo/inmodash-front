/**
 * Email verification endpoint
 * GET /api/auth/verify?token=...
 * POST /api/auth/verify
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth/jwt';
import { emailVerificationSchema } from '@/lib/auth/validation';
import { checkRateLimit, getClientIP, getRateLimitHeaders } from '@/lib/auth/rate-limit';
import { logEmailVerification, logSuspiciousActivity } from '@/lib/auth/audit';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  return handleVerification(request);
}

export async function POST(request: NextRequest) {
  return handleVerification(request);
}

async function handleVerification(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(clientIP, 'EMAIL_VERIFICATION');
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many verification attempts',
          message: 'Please try again later',
          retryAfter: rateLimitResult.retryAfter 
        },
        { 
          status: 429,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    // Get token from query params or request body
    let token: string;
    
    if (request.method === 'GET') {
      const { searchParams } = new URL(request.url);
      token = searchParams.get('token') || '';
    } else {
      const body = await request.json();
      const validationResult = emailVerificationSchema.safeParse(body);
      
      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Validation failed',
            message: 'Invalid input data',
            details: validationResult.error.flatten().fieldErrors,
          },
          { 
            status: 400,
            headers: getRateLimitHeaders(rateLimitResult)
          }
        );
      }
      
      token = validationResult.data.token;
    }

    if (!token) {
      return NextResponse.json(
        {
          error: 'Missing token',
          message: 'Verification token is required',
        },
        { 
          status: 400,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    // Verify JWT token
    let tokenPayload;
    try {
      tokenPayload = await verifyToken(token);
      
      if (tokenPayload.type !== 'email_verification') {
        throw new Error('Invalid token type');
      }
    } catch (error) {
      await logSuspiciousActivity(
        undefined,
        'Invalid email verification token',
        { token: token.substring(0, 20) + '...', ip: clientIP }
      );
      
      return NextResponse.json(
        {
          error: 'Invalid token',
          message: 'The verification token is invalid or has expired',
        },
        { 
          status: 400,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    // Find user with matching token
    const user = await prisma.user.findFirst({
      where: {
        email: tokenPayload.email,
        emailVerificationToken: token,
        emailVerificationExpires: {
          gt: new Date(),
        },
        isEmailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isEmailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: 'Invalid token',
          message: 'The verification token is invalid, expired, or already used',
        },
        { 
          status: 400,
          headers: getRateLimitHeaders(rateLimitResult)
        }
      );
    }

    // Update user as verified and clear verification token
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        isEmailVerified: true,
      },
    });

    // Log successful verification
    await logEmailVerification(user.id, user.email);

    return NextResponse.json(
      {
        success: true,
        message: 'Email verified successfully. You can now log in.',
        data: {
          user: updatedUser,
        },
      },
      { 
        status: 200,
        headers: getRateLimitHeaders(rateLimitResult)
      }
    );

  } catch (error) {
    console.error('Email verification error:', error);

    // Log suspicious activity for unexpected errors
    const clientIP = getClientIP(request);
    await logSuspiciousActivity(
      undefined,
      'Email verification endpoint error',
      { 
        error: error instanceof Error ? error.message : 'Unknown error',
        ip: clientIP,
      }
    );

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed', message: 'Only GET and POST requests are supported' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed', message: 'Only GET and POST requests are supported' },
    { status: 405 }
  );
}
