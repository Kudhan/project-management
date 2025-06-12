import {z} from 'zod';

export const signInSchema = z.object({
    email: z.string().email("Invalid email address").min(1, 'Email is required'),
    password: z.string().min(8, 'Password must be at least 6 characters long'),
});

export const signUpSchema = z
  .object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name must be less than 50 characters'),

    email: z.string()
      .email('Invalid email address')
      .min(1, 'Email is required'),

    password: z.string()
      .min(8, 'Password must be at least 8 characters long'),

    confirmPassword: z.string()
      .min(8, 'Confirm Password must be at least 8 characters long'),
  })
.refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
});
