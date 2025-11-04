/**
 * User registration endpoint
 * POST /api/auth/register
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth/password';
import { registerSchema } from '@/lib/auth/validation';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          message: 'Invalid input data',
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password, name, confirmPassword, ...optionalFields } = validationResult.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'User already exists',
          message: 'An account with this email already exists',
        },
        { status: 400 }
      );
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Calculate trial end date (30 days from now)
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 30);

    // Create user with all fields
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        isEmailVerified: false,
        // Representative data
        phone: optionalFields.phone,
        position: optionalFields.position,
        // Company data
        companyName: optionalFields.companyName,
        companyTaxId: optionalFields.companyTaxId,
        companyAddress: optionalFields.companyAddress,
        companyCity: optionalFields.companyCity,
        companyState: optionalFields.companyState,
        companyCountry: optionalFields.companyCountry || 'Argentina',
        companyZipCode: optionalFields.companyZipCode,
        companyPhone: optionalFields.companyPhone,
        companyWebsite: optionalFields.companyWebsite,
        // Subscription data
        subscriptionStatus: 'trial',
        subscriptionPlan: 'professional',
        subscriptionStartDate: new Date(),
        trialEndsAt,
        paymentMethod: optionalFields.paymentMethod || 'trial',
      },
      select: {
        id: true,
        email: true,
        name: true,
        companyName: true,
        subscriptionStatus: true,
        trialEndsAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        data: { user },
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}
