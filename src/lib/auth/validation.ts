/**
 * Validation schemas for authentication endpoints
 * Using Zod for type-safe validation
 */

import { z } from 'zod';

// Email validation schema
export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(1, 'Email is required')
  .max(255, 'Email must be less than 255 characters')
  .transform(email => email.toLowerCase().trim());

// Password validation schema
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must be less than 128 characters long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, 'Password must contain at least one special character');

// Name validation schema
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(255, 'Name must be less than 255 characters')
  .regex(/^[a-zA-ZÀ-ÿ\s]+$/, 'Name can only contain letters and spaces')
  .transform(name => name.trim());

// Register request schema
export const registerSchema = z.object({
  // Required fields
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
  confirmPassword: z.string(),
  
  // Optional representative fields
  phone: z.string().optional(),
  position: z.string().optional(),
  
  // Optional company fields
  companyName: z.string().optional(),
  companyTaxId: z.string().optional(),
  companyAddress: z.string().optional(),
  companyCity: z.string().optional(),
  companyState: z.string().optional(),
  companyCountry: z.string().optional(),
  companyZipCode: z.string().optional(),
  companyPhone: z.string().optional(),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  
  // Optional payment fields
  paymentMethod: z.string().optional(),
  cardNumber: z.string().optional(),
  cardHolder: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Login request schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Email verification schema
export const emailVerificationSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

// Password reset request schema
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

// Password reset schema
export const passwordResetSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Change password schema
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Refresh token schema
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

// Role validation
export const roleSchema = z.enum(['user', 'admin'], {
  errorMap: () => ({ message: 'Role must be either user or admin' }),
});

// User update schema
export const updateUserSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema.optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

// Rate limiting validation
export const rateLimitSchema = z.object({
  identifier: z.string().min(1, 'Identifier is required'),
  action: z.enum(['login', 'register', 'reset', 'verify'], {
    errorMap: () => ({ message: 'Invalid action type' }),
  }),
});

// IP address validation
export const ipAddressSchema = z
  .string()
  .ip({ message: 'Invalid IP address format' })
  .optional();

// User agent validation
export const userAgentSchema = z
  .string()
  .max(500, 'User agent must be less than 500 characters')
  .optional();

// Generic error response schema
export const errorResponseSchema = z.object({
  error: z.string(),
  message: z.string(),
  details: z.record(z.any()).optional(),
});

// Success response schema
export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.record(z.any()).optional(),
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().min(1, 'Page must be at least 1').default(1),
  limit: z.coerce.number().min(1, 'Limit must be at least 1').max(100, 'Limit cannot exceed 100').default(10),
});

// Audit log query schema
export const auditLogQuerySchema = z.object({
  userId: z.coerce.number().positive().optional(),
  action: z.string().optional(),
  resource: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
}).merge(paginationSchema);

// Export types for TypeScript
export type RegisterRequest = z.infer<typeof registerSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;
export type EmailVerificationRequest = z.infer<typeof emailVerificationSchema>;
export type PasswordResetRequestRequest = z.infer<typeof passwordResetRequestSchema>;
export type PasswordResetRequest = z.infer<typeof passwordResetSchema>;
export type ChangePasswordRequest = z.infer<typeof changePasswordSchema>;
export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>;
export type UpdateUserRequest = z.infer<typeof updateUserSchema>;
export type RateLimitRequest = z.infer<typeof rateLimitSchema>;
export type AuditLogQuery = z.infer<typeof auditLogQuerySchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
