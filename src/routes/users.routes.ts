import { Router } from "express";
import { auth } from "../middlewares/auth";
import validateBody, { userSchema } from "../validator";
import UsersMeController from "../controllers/users/me.ctrl";
import UsersConnectionsController from "../controllers/users/connections/index.ctrl";

class UsersRoutes {
  public router = Router();
  private controller = {
    me: new UsersMeController(),
    connections: new UsersConnectionsController(),
  };
  private schema = userSchema;

  constructor() {
    /**
     * Me Routes
     */
    this.router.get("/@me", auth, this.controller.me.index);
    this.router.post(
      "/@me/update",
      validateBody(this.schema.meUpdateSchema),
      auth,
      this.controller.me.update,
    );
    this.router.get("/@me/connections", auth, this.controller.me.connections);

    /**
     * Connections Routes
     */
    this.router.get(
      "/connections/discord",
      auth,
      this.controller.connections.discord,
    );
    this.router.get(
      "/connections/disconnect",
      auth,
      this.controller.connections.disconnect,
    );
  }
}

export default new UsersRoutes().router;
