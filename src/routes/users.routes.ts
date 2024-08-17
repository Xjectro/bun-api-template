import { Router } from "express";
import { auth } from "../infrastructure/commons/middlewares/jwt";
import UsersController from "../controllers/users.ctrl";

class UsersRoutes {
  public router = Router();
  private controller = new UsersController();

  constructor() {
    this.router.get("/@me", auth("access"), this.controller.me);
    this.router.get("/@me/update", auth("access"), this.controller.meUpdate);
  }
}

export default new UsersRoutes().router;
