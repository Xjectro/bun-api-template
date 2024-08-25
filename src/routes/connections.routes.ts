import { Router } from "express";
import ConnectionsController from "../controllers/connections.ctrl";
import { auth } from "../middlewares/auth";
import validateBody, { connectionSchemas } from "../validator";

class ConnectionsRoutes {
  public router = Router();
  private controller = new ConnectionsController();
  private schema = connectionSchemas;

  constructor() {
    /**
     * X Routes
     */
    this.router.post(
      "/x",
      validateBody(this.schema.XSchema),
      auth,
      this.controller.X.index,
    );
    this.router.get("/x/auth-link", this.controller.X.authLink);
  }
}

export default new ConnectionsRoutes().router;
