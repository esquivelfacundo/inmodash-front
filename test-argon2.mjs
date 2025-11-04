// Test argon2 directly
import { hashPassword } from './src/lib/auth/password.ts';

try {
  const hash = await hashPassword('Test1234!');
  console.log('Hash successful:', hash);
} catch (error) {
  console.error('Error:', error.message);
  console.error('Stack:', error.stack);
}
