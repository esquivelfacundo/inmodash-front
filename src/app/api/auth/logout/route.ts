/**
 * User logout endpoint
 * POST /api/auth/logout
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthCookies, clearAuthCookies } from '@/lib/auth/cookies';
import { invalidateSession } from '@/lib/auth/session';
import { logAuditEvent } from '@/lib/auth/audit';

export async function POST(request: NextRequest) {
  try {
    // Get current session from cookies
    const { sessionId, accessToken } = await getAuthCookies();

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );

    // Clear authentication cookies
    clearAuthCookies(response);

    // Invalidate session if exists
    if (sessionId) {
      await invalidateSession(sessionId);
      
      // Log logout event
      await logAuditEvent({
        action: 'LOGOUT',
        resource: 'AUTH',
        details: { sessionId },
      });
    }

    return response;

  } catch (error) {
    console.error('Logout error:', error);

    // Even if there's an error, clear cookies and return success
    // This ensures the client-side logout always works
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );

    clearAuthCookies(response);
    return response;
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed', message: 'Only POST requests are supported' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed', message: 'Only POST requests are supported' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed', message: 'Only POST requests are supported' },
    { status: 405 }
  );
}
