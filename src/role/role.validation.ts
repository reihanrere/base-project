import { z } from 'zod';

export const RoleValidation = {
  CREATE: z.object({
    name: z.string().min(1, 'Name is required').max(100),
  }),
  UPDATE: z.object({
    id: z.string().min(1).max(100),
    name: z.string().min(1, 'Name is required').max(100),
  }),
};
