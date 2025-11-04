/**
 * Get current user endpoint
 * GET /api/auth/me
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies } from '@/lib/auth/cookies';
import { validateSession } from '@/lib/auth/session';

export async function GET(request: NextRequest) {
  try {
    // Get session token from cookies
    const { accessToken } = await getAuthCookies();

    if (!accessToken) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'No authentication token found',
        },
        { status: 401 }
      );
    }

    // Validate session
    const sessionData = await validateSession(accessToken);

    if (!sessionData) {
      return NextResponse.json(
        {
          error: 'Unauthorized',
          message: 'Invalid or expired session',
        },
        { status: 401 }
      );
    }

    // Return user data (excluding sensitive information)
    return NextResponse.json(
      {
        success: true,
        user: {
          id: sessionData.user.id,
          email: sessionData.user.email,
          name: sessionData.user.name,
          role: sessionData.user.role,
          isEmailVerified: sessionData.user.isEmailVerified,
        },
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Get current user error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function POST() {
  return NextResponse.json(
    { error: 'Method not allowed', message: 'Only GET requests are supported' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed', message: 'Only GET requests are supported' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed', message: 'Only GET requests are supported' },
    { status: 405 }
  );
}
