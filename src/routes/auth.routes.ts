import { Router } from "express";
import AuthController from "../controllers/auth.ctrl";
import {
  forgotPasswordSchema,
  loginSchema,
  refreshPasswordSchema,
  registerSchema,
  codeSchema,
} from "../infrastructure/transport/validator/schemas/auth";
import validateBody from "../infrastructure/transport/validator";
import { auth } from "../infrastructure/commons/middlewares/jwt";

class AuthRoutes {
  public router = Router();
  private controller = new AuthController();

  constructor() {
    this.router.post(
      "/login",
      validateBody(loginSchema),
      this.controller.login,
    );
    this.router.post(
      "/register",
      validateBody(registerSchema),
      this.controller.register,
    );
    this.router.post(
      "/forgot-password",
      validateBody(forgotPasswordSchema),
      this.controller.forgotPassword,
    );
    this.router.post(
      "/refresh-password",
      validateBody(refreshPasswordSchema),
      auth("access"),
      this.controller.refreshPassword,
    );
    this.router.post("/code", validateBody(codeSchema), this.controller.code);
  }
}

export default new AuthRoutes().router;
