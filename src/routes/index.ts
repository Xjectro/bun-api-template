import { Router } from "express";
import { auth } from "../middlewares/jwt";

import { me } from "../controllers/users";
import {
    login,
    register,
    forgotPassword,
    refreshPassword,
    verifyRequestCode,
} from "../controllers/auth";
import {
    createPost,
    deletePost,
    deletePostComment,
    sendPostComment,
    updatePost,
} from "../controllers/posts";
import validateBody, {
    authForgotPasswordSchema,
    authLoginSchema,
    authRefreshPasswordSchema,
    authRegisterSchema,
    authVerifyRequestCodeSchema,
    createPostSchema,
    updatePostSchema,
    deletePostCommentSchema,
    deletePostSchema,
    sendPostCommentSchema,
} from "../validators";

export const router = Router();

// Users
router.get("/users/me", auth, me);

// Auth
router.post("/auth/login", validateBody(authLoginSchema), login);
router.post("/auth/register", validateBody(authRegisterSchema), register);
router.post(
    "/auth/forgot-password",
    validateBody(authForgotPasswordSchema),
    forgotPassword
);
router.post(
    "/auth/refresh-password",
    validateBody(authRefreshPasswordSchema),
    refreshPassword
);
router.post(
    "/auth/verify-request-code",
    validateBody(authVerifyRequestCodeSchema),
    verifyRequestCode
);

// Posts
router.post("/posts/create", validateBody(createPostSchema), auth, createPost);
router.post("/posts/update", validateBody(updatePostSchema), auth, updatePost);
router.post("/posts/delete", validateBody(deletePostSchema), auth, deletePost);
router.post(
    "/posts/send-comment",
    validateBody(sendPostCommentSchema),
    auth,
    sendPostComment
);
router.post(
    "/posts/delete-comment",
    validateBody(deletePostCommentSchema),
    auth,
    deletePostComment
);
