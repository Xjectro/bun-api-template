import z from "zod";

const me = {
    update: z.object({
        username: z
            .string()
            .min(3, { message: 'Username must be at least 3 characters long.' })
            .max(20, { message: 'Username cannot exceed 20 characters.' })
            .regex(/^\S*$/, { message: 'Username cannot contain spaces.' })
            .optional(),
        description: z
            .string()
            .min(10, { message: 'Description must be at least 10 characters long.' })
            .max(180, { message: 'Description cannot exceed 180 characters.' })
            .optional(),
        avatarURL: z.string().optional(),
    }),
};

export { me };
