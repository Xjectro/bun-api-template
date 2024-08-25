import { Router } from "express";
import TokenController from "../controllers/token.ctrl";
import validateBody, { tokenSchemas } from "../validator";

class TokenRoutes {
  public router = Router();
  private controller = new TokenController();
  private schema = tokenSchemas;

  constructor() {
    this.router.get(
      "/refresh",
      validateBody(this.schema.refreshSchema),
      this.controller.refresh,
    );
  }
}

export default new TokenRoutes().router;
