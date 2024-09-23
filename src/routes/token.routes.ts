import { Router } from "express";
import TokenController from "../controllers/token/index.ctrl";
import validateBody, { tokenSchema } from "../validator";

class TokenRoutes {
  public router = Router();
  private controller = new TokenController();
  private schema = tokenSchema;

  constructor() {
    this.router.post(
      "/refresh",
      validateBody(this.schema.refreshSchema),
      this.controller.refresh,
    );
  }
}

export default new TokenRoutes().router;
