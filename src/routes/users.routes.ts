import { Router } from 'express';
import { auth } from '../middlewares/authenticate';
import validateBody, { userSchema } from '../api/transport/validator';
import UsersMeController from '../controllers/users/me/index.ctrl';
import UsersPublicController from '../controllers/users/public/index.ctrl';
import UsersConnectionsController from '../controllers/users/connections/index.ctrl';

class UsersRoutes {
  public router = Router();
  private controller = {
    me: new UsersMeController(),
    connections: new UsersConnectionsController(),
    public: new UsersPublicController(),
  };
  private schema = userSchema;

  constructor() {
    /**
     * Public Routes
     */
    this.router.get('/public/:user_id', this.controller.public._user_id);

    /**
     * Me Routes
     */
    this.router.get('/@me', auth, this.controller.me.index);
    this.router.post('/@me/update', validateBody(this.schema.me.updateSchema), auth, this.controller.me.update);
    this.router.get('/@me/connections', auth, this.controller.me.connections);

    /**
     * Connections Routes
     */
    this.router.get('/connections/discord', auth, this.controller.connections.discord);
    this.router.get('/connections/disconnect', auth, this.controller.connections.disconnect);
  }
}

export default new UsersRoutes().router;
