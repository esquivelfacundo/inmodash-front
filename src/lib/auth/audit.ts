/**
 * Audit logging utilities for security events
 * Following OWASP logging recommendations
 */

import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';

const prisma = new PrismaClient();

export type AuditAction = 
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'LOGIN_LOCKED'
  | 'LOGOUT'
  | 'REGISTER'
  | 'EMAIL_VERIFIED'
  | 'PASSWORD_RESET_REQUESTED'
  | 'PASSWORD_RESET_COMPLETED'
  | 'PASSWORD_CHANGED'
  | 'ACCOUNT_LOCKED'
  | 'ACCOUNT_UNLOCKED'
  | 'SESSION_CREATED'
  | 'SESSION_INVALIDATED'
  | 'PERMISSION_DENIED'
  | 'SUSPICIOUS_ACTIVITY';

export type AuditResource = 
  | 'USER'
  | 'SESSION'
  | 'AUTH'
  | 'BUILDING'
  | 'APARTMENT'
  | 'CONTRACT'
  | 'TENANT'
  | 'GUARANTOR';

interface AuditLogData {
  userId?: number;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Log an audit event
 * @param data - Audit log data
 * @returns Promise<void>
 */
export async function logAuditEvent(data: AuditLogData): Promise<void> {
  try {
    // Get request headers for IP and User-Agent
    const headersList = await headers();
    const ipAddress = data.ipAddress || 
      headersList.get('x-forwarded-for') || 
      headersList.get('x-real-ip') || 
      'unknown';
    
    const userAgent = data.userAgent || 
      headersList.get('user-agent') || 
      'unknown';

    // Sanitize details to prevent logging sensitive information
    const sanitizedDetails = sanitizeAuditDetails(data.details);

    await prisma.auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        resource: data.resource,
        resourceId: data.resourceId,
        details: sanitizedDetails ? JSON.stringify(sanitizedDetails) : null,
        ipAddress: ipAddress.substring(0, 45), // Limit IP address length
        userAgent: userAgent.substring(0, 500), // Limit user agent length
      },
    });
  } catch (error) {
    // Log to console if database logging fails
    console.error('Failed to log audit event:', {
      action: data.action,
      resource: data.resource,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

/**
 * Log authentication success
 * @param userId - User ID
 * @param email - User email
 */
export async function logLoginSuccess(userId: number, email: string): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'LOGIN_SUCCESS',
    resource: 'AUTH',
    details: { email },
  });
}

/**
 * Log authentication failure
 * @param email - Attempted email
 * @param reason - Failure reason
 */
export async function logLoginFailure(email: string, reason: string): Promise<void> {
  await logAuditEvent({
    action: 'LOGIN_FAILED',
    resource: 'AUTH',
    details: { email, reason },
  });
}

/**
 * Log account lockout
 * @param userId - User ID
 * @param email - User email
 * @param reason - Lockout reason
 */
export async function logAccountLocked(userId: number, email: string, reason: string): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'ACCOUNT_LOCKED',
    resource: 'USER',
    resourceId: userId.toString(),
    details: { email, reason },
  });
}

/**
 * Log user registration
 * @param userId - User ID
 * @param email - User email
 */
export async function logUserRegistration(userId: number, email: string): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'REGISTER',
    resource: 'USER',
    resourceId: userId.toString(),
    details: { email },
  });
}

/**
 * Log email verification
 * @param userId - User ID
 * @param email - User email
 */
export async function logEmailVerification(userId: number, email: string): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'EMAIL_VERIFIED',
    resource: 'USER',
    resourceId: userId.toString(),
    details: { email },
  });
}

/**
 * Log password reset request
 * @param email - User email
 */
export async function logPasswordResetRequest(email: string): Promise<void> {
  await logAuditEvent({
    action: 'PASSWORD_RESET_REQUESTED',
    resource: 'AUTH',
    details: { email },
  });
}

/**
 * Log password reset completion
 * @param userId - User ID
 * @param email - User email
 */
export async function logPasswordResetCompleted(userId: number, email: string): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'PASSWORD_RESET_COMPLETED',
    resource: 'AUTH',
    details: { email },
  });
}

/**
 * Log suspicious activity
 * @param userId - User ID (optional)
 * @param activity - Description of suspicious activity
 * @param details - Additional details
 */
export async function logSuspiciousActivity(
  userId: number | undefined,
  activity: string,
  details?: Record<string, any>
): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'SUSPICIOUS_ACTIVITY',
    resource: 'AUTH',
    details: { activity, ...details },
  });
}

/**
 * Get audit logs for a user
 * @param userId - User ID
 * @param limit - Number of logs to retrieve (default: 50)
 * @returns Promise<Array> - Array of audit logs
 */
export async function getUserAuditLogs(userId: number, limit: number = 50) {
  try {
    return await prisma.auditLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        action: true,
        resource: true,
        resourceId: true,
        details: true,
        ipAddress: true,
        createdAt: true,
      },
    });
  } catch (error) {
    return [];
  }
}

/**
 * Get recent security events
 * @param hours - Number of hours to look back (default: 24)
 * @param limit - Number of events to retrieve (default: 100)
 * @returns Promise<Array> - Array of security events
 */
export async function getRecentSecurityEvents(hours: number = 24, limit: number = 100) {
  try {
    const since = new Date();
    since.setHours(since.getHours() - hours);

    return await prisma.auditLog.findMany({
      where: {
        createdAt: { gte: since },
        action: {
          in: [
            'LOGIN_FAILED',
            'ACCOUNT_LOCKED',
            'SUSPICIOUS_ACTIVITY',
            'PERMISSION_DENIED',
          ],
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        userId: true,
        action: true,
        resource: true,
        details: true,
        ipAddress: true,
        createdAt: true,
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });
  } catch (error) {
    return [];
  }
}

/**
 * Sanitize audit details to prevent logging sensitive information
 * @param details - Details object to sanitize
 * @returns Sanitized details object
 */
function sanitizeAuditDetails(details?: Record<string, any>): Record<string, any> | null {
  if (!details) return null;

  const sanitized = { ...details };
  
  // Remove sensitive fields
  const sensitiveFields = [
    'password',
    'passwordHash',
    'token',
    'refreshToken',
    'sessionToken',
    'secret',
    'key',
    'authorization',
  ];

  for (const field of sensitiveFields) {
    if (field in sanitized) {
      sanitized[field] = '[REDACTED]';
    }
  }

  // Truncate long strings
  Object.keys(sanitized).forEach(key => {
    if (typeof sanitized[key] === 'string' && sanitized[key].length > 1000) {
      sanitized[key] = sanitized[key].substring(0, 1000) + '...';
    }
  });

  return sanitized;
}
