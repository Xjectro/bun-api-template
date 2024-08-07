import { Router } from "express";
import {
    login,
    register,
    forgotPassword,
    refreshPassword,
    verifyRequestCode,
} from "./routes/auth";
import validateBody, {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    refreshPasswordSchema,
    verifyRequestCodeSchema,
} from "./validator";
import { getUser } from "./routes/users";
import { auth } from "./middleware/jwt";

export const v1 = Router();

v1.get("/users/get", auth, getUser);

v1.post("/auth/login", validateBody(loginSchema), login);
v1.post("/auth/register", validateBody(registerSchema), register);
v1.post(
    "/auth/forgot-password",
    validateBody(forgotPasswordSchema),
    forgotPassword
);
v1.post(
    "/auth/refresh-password",
    validateBody(refreshPasswordSchema),
    refreshPassword
);
v1.post(
    "/auth/verify-request-code",
    validateBody(verifyRequestCodeSchema),
    verifyRequestCode
);
