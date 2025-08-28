import { z } from 'zod';

export const UserValidation = {
  REGISTER: z.object({
    username: z.string().min(1, 'Username is required').max(100),
    password: z.string().min(1, 'Password is required').max(100),
    email: z.email().min(1, 'Email is required').max(100),
    phoneNumber: z.string().min(1, 'Phone Number is required').max(100),
  }),
  LOGIN: z.object({
    emailOrUsername: z
      .string()
      .min(1, 'Email or Password is required')
      .max(100),
    password: z.string().min(1, 'Password is required').max(100),
  }),
  CREATE: z.object({
    username: z.string().min(1, 'Username is required').max(100),
    password: z.string().min(1, 'Password is required').max(100),
    email: z.email().min(1, 'Email is required').max(100),
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    roleId: z.string().min(1, 'Role is required').max(100),
  }),
  UPDATE: z.object({
    id: z.string().min(1, 'ID is required').max(100),
    username: z.string().optional(),
    password: z.string().optional(),
    email: z.email().optional(),
    fullName: z.string().optional(),
    phoneNumber: z.string().optional(),
    roleId: z.string().optional(),
  }),
};
