import { z } from 'zod';

export const me = {
  updateSchema: z.object({
    username: z
      .string()
      .min(3, { message: 'Username must be at least 3 characters long' })
      .max(20, { message: 'Username must be at most 20 characters long' })
      .regex(/^\S*$/, { message: 'Username cannot contain spaces' })
      .optional(),
    description: z
      .string()
      .min(10, { message: 'Description must be at least 10 characters long' })
      .max(180, { message: 'Description must be at most 180 characters long' })
      .optional(),
    avatarURL: z.string().optional(),
  }),
};
