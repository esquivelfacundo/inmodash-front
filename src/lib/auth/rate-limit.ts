/**
 * Rate limiting utilities for authentication endpoints
 * Implements sliding window rate limiting with Redis-like behavior using in-memory storage
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  attempts: number[];
}

// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configurations
export const RATE_LIMITS = {
  LOGIN: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxAttempts: 5,            // 5 attempts per window
    blockDurationMs: 30 * 60 * 1000, // 30 minutes block
  },
  REGISTER: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 3,            // 3 attempts per window
    blockDurationMs: 60 * 60 * 1000, // 1 hour block
  },
  PASSWORD_RESET: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 3,            // 3 attempts per window
    blockDurationMs: 60 * 60 * 1000, // 1 hour block
  },
  EMAIL_VERIFICATION: {
    windowMs: 60 * 60 * 1000,  // 1 hour
    maxAttempts: 5,            // 5 attempts per window
    blockDurationMs: 30 * 60 * 1000, // 30 minutes block
  },
} as const;

export type RateLimitType = keyof typeof RATE_LIMITS;

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

/**
 * Check if a request is within rate limits
 * @param identifier - Unique identifier (IP address, user ID, etc.)
 * @param type - Type of rate limit to apply
 * @returns RateLimitResult
 */
export function checkRateLimit(identifier: string, type: RateLimitType): RateLimitResult {
  const config = RATE_LIMITS[type];
  const key = `${type}:${identifier}`;
  const now = Date.now();
  
  // Clean up expired entries periodically
  cleanupExpiredEntries();
  
  let entry = rateLimitStore.get(key);
  
  if (!entry) {
    // First request
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
      attempts: [now],
    };
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: entry.resetTime,
    };
  }
  
  // Check if we're still in the block period
  if (entry.resetTime > now && entry.count >= config.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }
  
  // Reset if window has expired
  if (entry.resetTime <= now) {
    entry = {
      count: 1,
      resetTime: now + config.windowMs,
      attempts: [now],
    };
    rateLimitStore.set(key, entry);
    
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: entry.resetTime,
    };
  }
  
  // Increment counter
  entry.count++;
  entry.attempts.push(now);
  
  // Keep only recent attempts (sliding window)
  entry.attempts = entry.attempts.filter(time => time > now - config.windowMs);
  entry.count = entry.attempts.length;
  
  const allowed = entry.count <= config.maxAttempts;
  
  if (!allowed) {
    // Extend block time
    entry.resetTime = now + config.blockDurationMs;
  }
  
  rateLimitStore.set(key, entry);
  
  return {
    allowed,
    remaining: Math.max(0, config.maxAttempts - entry.count),
    resetTime: entry.resetTime,
    retryAfter: allowed ? undefined : Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Reset rate limit for a specific identifier and type
 * @param identifier - Unique identifier
 * @param type - Type of rate limit
 */
export function resetRateLimit(identifier: string, type: RateLimitType): void {
  const key = `${type}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Get current rate limit status without incrementing
 * @param identifier - Unique identifier
 * @param type - Type of rate limit
 * @returns RateLimitResult
 */
export function getRateLimitStatus(identifier: string, type: RateLimitType): RateLimitResult {
  const config = RATE_LIMITS[type];
  const key = `${type}:${identifier}`;
  const now = Date.now();
  
  const entry = rateLimitStore.get(key);
  
  if (!entry) {
    return {
      allowed: true,
      remaining: config.maxAttempts,
      resetTime: now + config.windowMs,
    };
  }
  
  // Check if we're still in the block period
  if (entry.resetTime > now && entry.count >= config.maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.resetTime - now) / 1000),
    };
  }
  
  // Reset if window has expired
  if (entry.resetTime <= now) {
    return {
      allowed: true,
      remaining: config.maxAttempts,
      resetTime: now + config.windowMs,
    };
  }
  
  const allowed = entry.count < config.maxAttempts;
  
  return {
    allowed,
    remaining: Math.max(0, config.maxAttempts - entry.count),
    resetTime: entry.resetTime,
    retryAfter: allowed ? undefined : Math.ceil((entry.resetTime - now) / 1000),
  };
}

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries(): void {
  const now = Date.now();
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime <= now) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get rate limit headers for HTTP responses
 * @param result - Rate limit result
 * @returns Record<string, string> - HTTP headers
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  const headers: Record<string, string> = {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };
  
  if (result.retryAfter) {
    headers['Retry-After'] = result.retryAfter.toString();
  }
  
  return headers;
}

/**
 * Create rate limit middleware for Next.js API routes
 * @param type - Type of rate limit
 * @param getIdentifier - Function to extract identifier from request
 * @returns Middleware function
 */
export function createRateLimitMiddleware(
  type: RateLimitType,
  getIdentifier: (req: Request) => string
) {
  return (req: Request) => {
    const identifier = getIdentifier(req);
    const result = checkRateLimit(identifier, type);
    
    return {
      result,
      headers: getRateLimitHeaders(result),
    };
  };
}

/**
 * Get IP address from request headers
 * @param req - Request object
 * @returns string - IP address
 */
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  const remoteAddr = req.headers.get('remote-addr');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || remoteAddr || 'unknown';
}

/**
 * Clear all rate limit entries (for testing)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}
