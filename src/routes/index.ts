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
import validateBody, {
    authForgotPasswordSchema,
    authLoginSchema,
    authRefreshPasswordSchema,
    authRegisterSchema,
    authVerifyRequestCodeSchema,
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
