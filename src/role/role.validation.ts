import { z } from 'zod';

export const RoleValidation = {
  CREATE: z.object({
    name: z.string().min(1).max(100),
  }),
};
