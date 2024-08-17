import { type Application } from "express";

import UsersRoutes from "./users.routes";
import AuthRoutes from "./auth.routes";
import TokenRoutes from "./token.routes";

export default class Routes {
  constructor(app: Application) {
    app.use("/api/users", UsersRoutes);
    app.use("/api/auth", AuthRoutes);
    app.use("/api/token", TokenRoutes);
  }
}
