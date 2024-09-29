import { z } from 'zod';

export const login = z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(7, 'Password must be at least 7 characters long.'),
});

export const register = z.object({
    username: z
        .string()
        .min(3, 'Username must be at least 3 characters long.')
        .max(20, 'Username must be at most 20 characters long.')
        .regex(/^\S*$/, { message: 'Username cannot contain spaces.' }),
    firstName: z
        .string()
        .min(2, 'First name is required and must be at least 2 characters long.')
        .max(20, 'First name must be at most 20 characters long.'),
    lastName: z
        .string()
        .min(2, 'Last name is required and must be at least 2 characters long.')
        .max(20, 'Last name must be at most 20 characters long.'),
    email: z.string().email('Please enter a valid email address.'),
    password: z
        .string()
        .min(7, 'Password must be at least 7 characters long.')
        .max(20, 'Password must be at most 20 characters long.'),
});

export const forgot_password = z.object({
    email: z.string().email('Please enter a valid email address.'),
    ref: z.string().min(1, 'A reference is required.'),
});

export const refresh_password = z.object({
    newPassword: z
        .string()
        .min(7, 'New password must be at least 7 characters long.')
        .max(20, 'New password must be at most 20 characters long.'),
});

export const modification = {
    email: z.object({
        newEmail: z.string().email('Please enter a valid email address.'),
    }),
    password: z.object({
        newPassword: z
            .string()
            .min(7, 'New password must be at least 7 characters long.')
            .max(20, 'New password must be at most 20 characters long.'),
        currentPassword: z
            .string()
            .min(7, 'Current password must be at least 7 characters long.')
            .max(20, 'Current password must be at most 20 characters long.'),
    }),
};

export const tfa = {
    index: z.object({
        enabled: z.boolean(),
    }),
    verify: z.object({
        usage_code: z.string().min(1, 'Usage code is required.'),
    }),
};
