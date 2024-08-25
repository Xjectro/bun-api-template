import { Router } from "express";
import { auth } from "../middlewares/auth";
import UsersController from "../controllers/users.ctrl";

class UsersRoutes {
  public router = Router();
  private controller = new UsersController();

  constructor() {
    this.router.get("/@me", auth, this.controller.me.index);
    this.router.post("/@me/update", auth, this.controller.me.update);
    this.router.get("/@me/connections", auth, this.controller.me.connections);
  }
}

export default new UsersRoutes().router;
