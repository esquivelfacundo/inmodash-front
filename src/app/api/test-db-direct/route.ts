import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing direct database connection from frontend...');
    
    // Test básico de conexión
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Contar usuarios
    const userCount = await prisma.user.count();
    console.log(`👥 Total users: ${userCount}`);
    
    // Buscar el usuario específico
    const user = await prisma.user.findUnique({
      where: { email: 'facundoesquivel01@gmail.com' },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true,
        createdAt: true
      }
    });
    
    if (user) {
      console.log('✅ User found');
      return NextResponse.json({
        success: true,
        userCount,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          hashPrefix: user.passwordHash.substring(0, 20) + '...',
          createdAt: user.createdAt
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        userCount
      });
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Database connection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
