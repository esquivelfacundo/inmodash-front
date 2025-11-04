/**
 * Client-side password validation utilities
 * No server-side dependencies (argon2)
 */

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns object with validation result and errors
 */
export function validatePasswordStrength(password: string) {
  const errors: string[] = [];
  let score = 0;

  // Check minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 20;
  }

  // Check maximum length
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters long');
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 20;
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 20;
  }

  // Check for numbers
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 20;
  }

  // Check for special characters
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 20;
  }

  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    errors.push('Password cannot contain repeated characters');
    score -= 10;
  }

  // Check for common patterns
  const commonPatterns = [
    'password', 'admin', 'qwerty', '123456', 'abc123',
    'letmein', 'welcome', 'monkey', 'dragon', 'master'
  ];
  
  const lowerPassword = password.toLowerCase();
  if (commonPatterns.some(pattern => lowerPassword.includes(pattern))) {
    errors.push('Password cannot contain common patterns');
    score -= 20;
  }

  // Bonus for length
  if (password.length >= 12) {
    score += 10;
  }
  if (password.length >= 16) {
    score += 10;
  }

  // Ensure score is between 0 and 100
  score = Math.max(0, Math.min(100, score));

  return {
    isValid: errors.length === 0,
    score,
    errors,
  };
}
