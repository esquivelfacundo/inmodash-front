import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyPassword } from '@/lib/auth/password';

export async function POST(request: NextRequest) {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Simple login attempt...');
    
    // Parse request body
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      }, { status: 400 });
    }
    
    console.log('📧 Looking for user:', email);
    
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: true,
        isEmailVerified: true,
        failedLoginAttempts: true,
        lockedUntil: true,
      },
    });

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    console.log('✅ User found, checking password...');

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      console.log('🔒 Account is locked');
      return NextResponse.json({
        error: 'Account locked',
        message: 'Account is temporarily locked'
      }, { status: 423 });
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    console.log('🔐 Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return NextResponse.json({
        error: 'Authentication failed',
        message: 'Invalid email or password'
      }, { status: 401 });
    }

    // Reset failed login attempts
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    console.log('✅ Login successful');

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isEmailVerified: user.isEmailVerified,
        },
      },
    });

  } catch (error) {
    console.error('❌ Simple login error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      message: 'An unexpected error occurred. Please try again later.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
