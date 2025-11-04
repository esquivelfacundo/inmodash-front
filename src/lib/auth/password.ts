/**
 * Password hashing utilities with fallback support
 * Supports both Argon2id and bcrypt for compatibility
 * SERVER-ONLY: This module uses native Node.js dependencies
 */

import 'server-only';
import * as bcrypt from 'bcryptjs';

// Try to import argon2, fallback to bcrypt if not available
let argon2: any = null;
try {
  argon2 = require('argon2');
} catch (error) {
  console.warn('Argon2 not available, using bcrypt as fallback');
}

// bcrypt configuration
const BCRYPT_ROUNDS = 12;

// Argon2id configuration (if available)
const ARGON2_CONFIG = argon2 ? {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 MB
  timeCost: 3,         // 3 iterations
  parallelism: 1,      // 1 thread
  hashLength: 32,      // 32 bytes output
} : null;

/**
 * Hash a password using bcrypt (more compatible)
 * @param password - Plain text password
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, BCRYPT_ROUNDS);
  } catch (error) {
    throw new Error('Failed to hash password');
  }
}

/**
 * Verify a password against its hash
 * Supports both Argon2id and bcrypt hashes
 * @param password - Plain text password
 * @param hash - Hashed password
 * @returns Promise<boolean> - True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    // Check if it's an Argon2 hash
    if (hash.startsWith('$argon2') && argon2) {
      try {
        return await argon2.verify(hash, password);
      } catch (error) {
        console.warn('Argon2 verification failed, trying bcrypt');
        return false;
      }
    }
    
    // Check if it's a bcrypt hash
    if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
      return await bcrypt.compare(password, hash);
    }
    
    // If neither format is recognized, return false
    console.warn('Unknown hash format:', hash.substring(0, 10));
    return false;
  } catch (error) {
    console.error('Password verification error:', error);
    return false;
  }
}
