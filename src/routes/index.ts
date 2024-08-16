import { Router } from "express";
import { auth } from "../middlewares/jwt";

import { usersMe, usersUpdate } from "../controllers/users";
import {
  authForgotPassword,
  authLogin,
  authRefreshPassword,
  authRegister,
  authVerifyRequestCode,
} from "../controllers/auth";
import validateBody, {
  authForgotPasswordSchema,
  authLoginSchema,
  authRefreshPasswordSchema,
  authRegisterSchema,
  authVerifyRequestCodeSchema,
} from "../validators";
import { tokenRefresh } from "../validators/schemas/tokenSchema";
import { renewAccessToken } from "../controllers/token";

export const router = Router();

// User Management
router.get("/users/me", auth, usersMe);
router.get("/users/update", auth, usersUpdate);

// Authentication
router.post("/auth/login", validateBody(authLoginSchema), authLogin);
router.post("/auth/register", validateBody(authRegisterSchema), authRegister);
router.post(
  "/auth/forgot-password",
  validateBody(authForgotPasswordSchema),
  authForgotPassword,
);
router.post(
  "/auth/refresh-password",
  validateBody(authRefreshPasswordSchema),
  auth,
  authRefreshPassword,
);
router.post(
  "/auth/verify-request-code",
  validateBody(authVerifyRequestCodeSchema),
  authVerifyRequestCode,
);

// Token Management
router.post("/token/refresh", validateBody(tokenRefresh), renewAccessToken);
