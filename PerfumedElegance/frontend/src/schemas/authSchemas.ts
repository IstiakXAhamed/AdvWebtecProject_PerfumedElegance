import { z } from 'zod';

// 1. Blueprint for the Registration form
export const registerSchema = z.object({
  fullName: z
    .string()
    .min(4, { message: 'Full name must be at least 4 characters' }),
  email: z
    .string()       
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  securityQuestion: z
    .string()
    .min(1, { message: 'Security question is required' }),
  securityAnswer: z
    .string()
    .min(1, { message: 'Security answer is required' }),
});

// 2. Blueprint for the Login form
export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Password is required' }),
});

// 3. Automatically extract TypeScript types from the blueprints
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
