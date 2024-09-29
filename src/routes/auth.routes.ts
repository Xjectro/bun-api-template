import { Router } from 'express';
import AuthController from '../controllers/auth/index.ctrl';
import AuthModificationController from '../controllers/auth/modification/index.ctrl';
import { validateBody } from '../middlewares/validate';
import { auth } from '../middlewares/authenticate';
import * as schema from "../controllers/auth/schema"

class AuthRoutes {
  public router = Router();
  private controller = {
    ...new AuthController(),
    modification: new AuthModificationController(),
  };

  constructor() {
    this.router.post('/login', validateBody(schema.login), this.controller.login);
    this.router.post('/register', validateBody(schema.register), this.controller.register);
    this.router.post(
      '/forgot-password',
      validateBody(schema.forgot_password),
      this.controller.forgotPassword,
    );
    this.router.post(
      '/refresh-password',
      validateBody(schema.refresh_password),
      auth,
      this.controller.refreshPassword,
    );

    /**
     * Modification
     */
    this.router.post(
      '/modification/email',
      validateBody(schema.modification.email),
      auth,
      this.controller.modification.email,
    );
    this.router.post(
      '/modification/password',
      validateBody(schema.modification.password),
      auth,
      this.controller.modification.password,
    );

    /**
     * Two Factor
     */
    this.router.post('/tfa', validateBody(schema.tfa.index), auth, this.controller.tfa.index);
    this.router.post('/tfa/verify', validateBody(schema.tfa.verify), this.controller.tfa.verify);
  }
}

export default new AuthRoutes().router;
