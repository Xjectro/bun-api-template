import { Router } from "express";
import AuthController from "../controllers/auth/index.ctrl";
import validateBody, { authSchema } from "../validator";
import { auth } from "../middlewares/auth";

class AuthRoutes {
  public router = Router();
  private controller = new AuthController();
  private schema = authSchema;

  constructor() {
    this.router.post(
      "/login",
      validateBody(this.schema.loginSchema),
      this.controller.login,
    );
    this.router.post(
      "/register",
      validateBody(this.schema.registerSchema),
      this.controller.register,
    );
    this.router.post(
      "/forgot-password",
      validateBody(this.schema.forgotPasswordSchema),
      this.controller.forgotPassword,
    );
    this.router.post(
      "/refresh-password",
      validateBody(this.schema.refreshPasswordSchema),
      auth,
      this.controller.refreshPassword,
    );
    this.router.post(
      "/code",
      validateBody(this.schema.codeSchema),
      this.controller.code,
    );
  }
}

export default new AuthRoutes().router;
