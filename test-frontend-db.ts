import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testFrontendDatabase() {
  try {
    console.log('🔍 Probando conexión desde el frontend...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
    
    // Test básico de conexión
    await prisma.$connect();
    console.log('✅ Conexión exitosa desde frontend');
    
    // Contar usuarios
    const userCount = await prisma.user.count();
    console.log(`👥 Total de usuarios: ${userCount}`);
    
    // Buscar el usuario
    const user = await prisma.user.findUnique({
      where: { email: 'facundoesquivel01@gmail.com' },
      select: {
        id: true,
        email: true,
        name: true,
        passwordHash: true
      }
    });
    
    if (user) {
      console.log('✅ Usuario encontrado desde frontend');
      console.log('   ID:', user.id);
      console.log('   Email:', user.email);
    } else {
      console.log('❌ Usuario no encontrado desde frontend');
    }
    
  } catch (error) {
    console.error('❌ Error desde frontend:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testFrontendDatabase();
