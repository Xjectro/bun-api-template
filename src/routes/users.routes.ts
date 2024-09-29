import { Router } from 'express';
import { auth } from '../middlewares/authenticate';
import UsersController from '../controllers/users/index.ctrl';
import * as schema from "../controllers/users/schema"
import { validateBody } from '../middlewares/validate';

class UsersRoutes {
  public router = Router();
  private controller = new UsersController();

  constructor() {
    /**
     * Me Routes
     */
    this.router.get('/@me', auth, this.controller.me.index);
    this.router.post('/@me/update', validateBody(schema.me.update), auth, this.controller.me.update);
    this.router.get('/@me/connections', auth, this.controller.me.connections);

    /**
     * Connections Routes
     */
    this.router.get('/connections/discord', auth, this.controller.connections.discord);
    this.router.get('/connections/disconnect', auth, this.controller.connections.disconnect);
  }
}

export default new UsersRoutes().router;
