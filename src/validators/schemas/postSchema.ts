import { z } from "zod";

export const createPostSchema = z.object({
    authorId: z.string().min(1, "Author id is required"),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(10, "Content is required"),
    tags: z
        .array(z.string().min(1, "Invalid tag format"))
        .min(0, "Tags is required"),
});

export const updatePostSchema = z.object({
    postId: z.string().min(1, "Author id is required"),
    title: z.string().min(1, "Title is required"),
    content: z.string().min(10, "Content is required"),
    tags: z
        .array(z.string().min(1, "Invalid tag format"))
        .min(0, "Tags is required"),
});

export const deletePostSchema = z.object({
    postId: z.string().min(1, "Author id is required"),
});

export const sendPostCommentSchema = z.object({
    postId: z.string().min(1, "Author id is required"),
    authorId: z.string().min(1, "Author id is required"),
    content: z.string().min(10, "Content is required"),
});

export const deletePostCommentSchema = z.object({
    postId: z.string().min(1, "Author id is required"),
    authorId: z.string().min(1, "Author id is required"),
    content: z.string().min(10, "Content is required"),
});
