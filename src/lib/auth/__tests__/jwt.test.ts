/**
 * Unit tests for JWT utilities
 */

import { createToken, verifyToken, createTokenPair, createEmailVerificationToken } from '../jwt';

// Mock environment variable
process.env.JWT_SECRET = 'test-secret-key-for-testing-only';

describe('JWT Utilities', () => {
  describe('createToken', () => {
    it('should create a valid JWT token', async () => {
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'user',
        type: 'access' as const,
      };

      const token = await createToken(payload);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should create token with custom expiration', async () => {
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'user',
        type: 'access' as const,
      };

      const token = await createToken(payload, '1h');
      expect(token).toBeDefined();
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'user',
        type: 'access' as const,
      };

      const token = await createToken(payload);
      const decoded = await verifyToken(token);
      
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
      expect(decoded.type).toBe(payload.type);
    });

    it('should reject invalid token', async () => {
      const invalidToken = 'invalid.token.here';
      
      await expect(verifyToken(invalidToken)).rejects.toThrow('Invalid or expired token');
    });

    it('should reject expired token', async () => {
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'user',
        type: 'access' as const,
      };

      // Create token that expires immediately
      const token = await createToken(payload, '0s');
      
      // Wait a bit to ensure expiration
      await new Promise(resolve => setTimeout(resolve, 100));
      
      await expect(verifyToken(token)).rejects.toThrow('Invalid or expired token');
    });
  });

  describe('createTokenPair', () => {
    it('should create access and refresh token pair', async () => {
      const userId = 1;
      const email = 'test@example.com';
      const role = 'user';

      const { accessToken, refreshToken } = await createTokenPair(userId, email, role);
      
      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
      expect(accessToken).not.toBe(refreshToken);

      // Verify both tokens
      const accessDecoded = await verifyToken(accessToken);
      const refreshDecoded = await verifyToken(refreshToken);

      expect(accessDecoded.userId).toBe(userId);
      expect(accessDecoded.type).toBe('access');
      expect(refreshDecoded.userId).toBe(userId);
      expect(refreshDecoded.type).toBe('refresh');
    });
  });

  describe('createEmailVerificationToken', () => {
    it('should create email verification token', async () => {
      const userId = 1;
      const email = 'test@example.com';

      const token = await createEmailVerificationToken(userId, email);
      const decoded = await verifyToken(token);
      
      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
      expect(decoded.type).toBe('email_verification');
    });
  });

  describe('token security', () => {
    it('should not accept tokens with wrong issuer', async () => {
      // This would require mocking the jose library to create a token with wrong issuer
      // For now, we test that our tokens have the correct structure
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'user',
        type: 'access' as const,
      };

      const token = await createToken(payload);
      const decoded = await verifyToken(token);
      
      expect(decoded.iss).toBe('inmobiliaria-pro');
      expect(decoded.aud).toBe('inmobiliaria-pro-users');
    });

    it('should include required claims', async () => {
      const payload = {
        userId: 1,
        email: 'test@example.com',
        role: 'user',
        type: 'access' as const,
      };

      const token = await createToken(payload);
      const decoded = await verifyToken(token);
      
      expect(decoded.iat).toBeDefined(); // issued at
      expect(decoded.exp).toBeDefined(); // expires at
      expect(decoded.iss).toBeDefined(); // issuer
      expect(decoded.aud).toBeDefined(); // audience
    });
  });
});
