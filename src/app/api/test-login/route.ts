import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Test login endpoint called');
    
    const body = await request.json();
    console.log('📝 Request body:', body);
    
    // Test 1: Basic response
    console.log('✅ Test 1: Basic response - OK');
    
    // Test 2: Prisma import
    try {
      const { prisma } = await import('@/lib/prisma');
      console.log('✅ Test 2: Prisma import - OK');
      
      // Test 3: Database connection
      await prisma.$connect();
      console.log('✅ Test 3: Database connection - OK');
      
      // Test 4: Find user
      const user = await prisma.user.findUnique({
        where: { email: body.email },
        select: { id: true, email: true, passwordHash: true }
      });
      console.log('✅ Test 4: User found:', !!user);
      
      if (user) {
        // Test 5: Password verification import
        try {
          const { verifyPassword } = await import('@/lib/auth/password');
          console.log('✅ Test 5: Password module import - OK');
          
          // Test 6: Password verification
          const isValid = await verifyPassword(body.password, user.passwordHash);
          console.log('✅ Test 6: Password verification result:', isValid);
          
          return NextResponse.json({
            success: true,
            tests: {
              basicResponse: true,
              prismaImport: true,
              databaseConnection: true,
              userFound: !!user,
              passwordImport: true,
              passwordValid: isValid
            }
          });
        } catch (passwordError) {
          console.error('❌ Test 5/6: Password error:', passwordError);
          return NextResponse.json({
            success: false,
            error: 'Password verification failed',
            details: passwordError instanceof Error ? passwordError.message : 'Unknown error'
          });
        }
      } else {
        return NextResponse.json({
          success: false,
          error: 'User not found'
        });
      }
      
    } catch (dbError) {
      console.error('❌ Test 2/3/4: Database error:', dbError);
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: dbError instanceof Error ? dbError.message : 'Unknown error'
      });
    }
    
  } catch (error) {
    console.error('❌ Test 1: Basic error:', error);
    return NextResponse.json({
      success: false,
      error: 'Basic endpoint error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
