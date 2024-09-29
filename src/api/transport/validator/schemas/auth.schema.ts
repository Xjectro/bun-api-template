import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(7, 'Password must be at least 7 characters long'),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')
    .regex(/^\S*$/, { message: 'Username cannot contain spaces' }),
  firstName: z.string().min(2, 'First name is required').max(20, 'First name must be at most 20 characters long'),
  lastName: z.string().min(2, 'Last name is required').max(20, 'Last name must be at most 20 characters long'),
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(7, 'Password must be at least 7 characters long')
    .max(20, 'Password must be at most 20 characters long'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email format'),
  ref: z.string().min(1, 'Ref is required'),
});

export const refreshPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(7, 'Password must be at least 7 characters long')
    .max(20, 'Password must be at most 20 characters long'),
});

export const codeSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  action: z.string().min(1, 'Action is required'),
});

export const modificationPassword = z.object({
  newPassword: z
    .string()
    .min(7, 'Password must be at least 7 characters long')
    .max(20, 'Password must be at most 20 characters long'),
  currentPassword: z
    .string()
    .min(7, 'Password must be at least 7 characters long')
    .max(20, 'Password must be at most 20 characters long'),
});

export const modificationEmail = z.object({
  newEmail: z.string().email('Invalid email format'),
});

export const twoFactorSchema = z.object({
  enabled: z.boolean(),
});
