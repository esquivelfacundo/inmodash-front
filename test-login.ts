import { PrismaClient } from '@prisma/client';
import { verifyPassword } from '@/lib/auth/password';

const prisma = new PrismaClient();

async function testLogin() {
  try {
    console.log('🔍 Probando login con credenciales exactas...');
    
    const email = 'facundoesquivel01@gmail.com';
    const password = 'Lidius@2001';
    
    // Buscar el usuario
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
      console.log('❌ Usuario no encontrado');
      return;
    }

    console.log('✅ Usuario encontrado:');
    console.log('   Email:', user.email);
    console.log('   Intentos fallidos:', user.failedLoginAttempts);
    console.log('   Bloqueado hasta:', user.lockedUntil);
    console.log('   Hash (primeros 30 chars):', user.passwordHash.substring(0, 30) + '...');

    // Verificar si está bloqueado
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      console.log('❌ Cuenta bloqueada hasta:', user.lockedUntil);
      return;
    }

    // Verificar contraseña
    console.log('🔐 Verificando contraseña...');
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    
    if (isPasswordValid) {
      console.log('✅ Contraseña correcta!');
    } else {
      console.log('❌ Contraseña incorrecta');
    }

  } catch (error) {
    console.error('❌ Error en test de login:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();
