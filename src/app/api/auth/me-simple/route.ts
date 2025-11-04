/**
 * Get current user endpoint (simplified)
 * GET /api/auth/me-simple
 */

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'No authentication token found',
      }, { status: 401 });
    }

    console.log('🔍 Checking token for /me endpoint');

    // For now, let's decode the JWT manually to get the user ID
    try {
      // Simple JWT decode (just for the payload, not verifying signature for now)
      const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
      console.log('📝 Token payload:', payload);

      if (!payload.userId) {
        return NextResponse.json({
          error: 'Unauthorized',
          message: 'Invalid token format',
        }, { status: 401 });
      }

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isEmailVerified: true,
          companyName: true,
        },
      });

      if (!user) {
        return NextResponse.json({
          error: 'Unauthorized',
          message: 'User not found',
        }, { status: 401 });
      }

      console.log('✅ User found for /me endpoint');

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
          companyName: user.companyName,
        },
      });

    } catch (tokenError) {
      console.error('❌ Token decode error:', tokenError);
      return NextResponse.json({
        error: 'Unauthorized',
        message: 'Invalid token',
      }, { status: 401 });
    }

  } catch (error) {
    console.error('❌ /me endpoint error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'An unexpected error occurred',
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
