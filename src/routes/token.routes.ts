import { Router } from "express";
import TokenController from "../controllers/token.ctrl";
import validateBody from "../infrastructure/transport/validator";
import { refreshSchema } from "../infrastructure/transport/validator/schemas/token";
import { auth } from "../infrastructure/commons/middlewares/jwt";

class TokenRoutes {
  public router = Router();
  private controller = new TokenController();

  constructor() {
    this.router.get(
      "/refresh",
      validateBody(refreshSchema),
      auth("refresh"),
      this.controller.refresh,
    );
  }
}

export default new TokenRoutes().router;
