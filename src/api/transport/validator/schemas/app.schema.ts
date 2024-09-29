import { z } from 'zod';

export const categories = {
  addSchema: z.object({
    code: z
      .string()
      .min(1, { message: 'Code must be at least 1 characters long' })
      .max(20, { message: 'Code must be at most 20 characters long' })
      .regex(/^\S*$/, { message: 'Code cannot contain spaces' }),
    name: z
      .string()
      .min(1, { message: 'Name must be at least 1 characters long' })
      .max(20, { message: 'Name must be at most 20 characters long' }),
    iconURL: z.string(),
  }),
  removeSchema: z.object({
    code: z
      .string()
      .min(1, { message: 'Code must be at least 1 characters long' })
      .max(20, { message: 'Code must be at most 20 characters long' })
      .regex(/^\S*$/, { message: 'Code cannot contain spaces' }),
  }),
  subCategory: {
    addSchema: z.object({
      cat: z
        .string()
        .min(1, { message: 'Code must be at least 1 characters long' })
        .max(20, { message: 'Code must be at most 20 characters long' })
        .regex(/^\S*$/, { message: 'Code cannot contain spaces' }),
      code: z
        .string()
        .min(1, { message: 'Code must be at least 1 characters long' })
        .max(20, { message: 'Code must be at most 20 characters long' })
        .regex(/^\S*$/, { message: 'Code cannot contain spaces' }),
      name: z
        .string()
        .min(1, { message: 'Name must be at least 1 characters long' })
        .max(20, { message: 'Name must be at most 20 characters long' }),
      iconURL: z.string(),
    }),
    removeSchema: z.object({
      cat: z
        .string()
        .min(1, { message: 'Code must be at least 1 characters long' })
        .max(20, { message: 'Code must be at most 20 characters long' })
        .regex(/^\S*$/, { message: 'Code cannot contain spaces' }),
      code: z
        .string()
        .min(1, { message: 'Code must be at least 1 characters long' })
        .max(20, { message: 'Code must be at most 20 characters long' })
        .regex(/^\S*$/, { message: 'Code cannot contain spaces' }),
    }),
  },
};
