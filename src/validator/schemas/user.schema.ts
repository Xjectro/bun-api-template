import { z } from "zod";

export const meUpdateSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(20, { message: "Username must be at most 20 characters long" })
    .regex(/^\S*$/, { message: "Username cannot contain spaces" })
    .optional(),
  avatarURL: z.string().optional(),
});
