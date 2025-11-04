/**
 * Session management utilities
 * Handles server-side session storage and validation
 * SERVER-ONLY: This module uses Prisma and native dependencies
 */

import 'server-only';
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { hashPassword, verifyPassword } from './password';

/**
 * Create a new session for a user
 * @param userId - User ID
 * @returns Promise<{sessionId: string, sessionToken: string}>
 */
export async function createSession(userId: number): Promise<{
  sessionId: string;
  sessionToken: string;
}> {
  try {
    // Generate secure session token
    const sessionToken = randomBytes(32).toString('hex');
    const sessionTokenHash = await hashPassword(sessionToken);
    
    // Set expiration to 7 days from now
    const expires = new Date();
    expires.setDate(expires.getDate() + 7);
    
    // Create session in database
    const session = await prisma.session.create({
      data: {
        userId,
        sessionToken: sessionTokenHash,
        expires,
      },
    });
    
    return {
      sessionId: session.id,
      sessionToken, // Return unhashed token for cookie
    };
  } catch (error) {
    throw new Error('Failed to create session');
  }
}

/**
 * Validate a session token
 * @param sessionToken - Session token to validate
 * @returns Promise<{userId: number, sessionId: string} | null>
 */
export async function validateSession(sessionToken: string): Promise<{
  userId: number;
  sessionId: string;
  user: {
    id: number;
    email: string;
    name: string;
    role: string;
    isEmailVerified: boolean;
  };
} | null> {
  try {
    // Get all active sessions (not expired)
    const sessions = await prisma.session.findMany({
      where: {
        expires: {
          gt: new Date(),
        },
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isEmailVerified: true,
            lockedUntil: true,
          },
        },
      },
    });
    
    // Find matching session by verifying token hash
    for (const session of sessions) {
      const isValid = await verifyPassword(sessionToken, session.sessionToken);
      
      if (isValid) {
        // Check if user account is locked
        if (session.user.lockedUntil && session.user.lockedUntil > new Date()) {
          throw new Error('Account is locked');
        }
        
        // Update session last accessed time
        await prisma.session.update({
          where: { id: session.id },
          data: { updatedAt: new Date() },
        });
        
        return {
          userId: session.userId,
          sessionId: session.id,
          user: {
            id: session.user.id,
            email: session.user.email,
            name: session.user.name,
            role: session.user.role,
            isEmailVerified: session.user.isEmailVerified,
          },
        };
      }
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

/**
 * Invalidate a specific session
 * @param sessionId - Session ID to invalidate
 * @returns Promise<boolean>
 */
export async function invalidateSession(sessionId: string): Promise<boolean> {
  try {
    await prisma.session.delete({
      where: { id: sessionId },
    });
    
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Invalidate all sessions for a user
 * @param userId - User ID
 * @returns Promise<number> - Number of sessions invalidated
 */
export async function invalidateAllUserSessions(userId: number): Promise<number> {
  try {
    const result = await prisma.session.deleteMany({
      where: { userId },
    });
    
    return result.count;
  } catch (error) {
    return 0;
  }
}

/**
 * Clean up expired sessions
 * @returns Promise<number> - Number of sessions cleaned up
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
    
    return result.count;
  } catch (error) {
    return 0;
  }
}

/**
 * Get active sessions for a user
 * @param userId - User ID
 * @returns Promise<Array> - Array of active sessions
 */
export async function getUserActiveSessions(userId: number) {
  try {
    return await prisma.session.findMany({
      where: {
        userId,
        expires: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        expires: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  } catch (error) {
    return [];
  }
}

/**
 * Extend session expiration
 * @param sessionId - Session ID
 * @param days - Number of days to extend (default: 7)
 * @returns Promise<boolean>
 */
export async function extendSession(sessionId: string, days: number = 7): Promise<boolean> {
  try {
    const newExpiration = new Date();
    newExpiration.setDate(newExpiration.getDate() + days);
    
    await prisma.session.update({
      where: { id: sessionId },
      data: {
        expires: newExpiration,
        updatedAt: new Date(),
      },
    });
    
    return true;
  } catch (error) {
    return false;
  }
}
