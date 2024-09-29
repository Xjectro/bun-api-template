import { Router } from 'express';
import AuthController from '../controllers/auth/index.ctrl';
import AuthModificationController from '../controllers/auth/modification/index.ctrl';
import validateBody, { authSchema } from '../api/transport/validator';
import { auth } from '../middlewares/authenticate';

class AuthRoutes {
  public router = Router();
  private controller = {
    ...new AuthController(),
    modification: new AuthModificationController(),
  };
  private schema = authSchema;

  constructor() {
    this.router.post('/login', validateBody(this.schema.loginSchema), this.controller.login);
    this.router.post('/register', validateBody(this.schema.registerSchema), this.controller.register);
    this.router.post(
      '/forgot-password',
      validateBody(this.schema.forgotPasswordSchema),
      this.controller.forgotPassword,
    );
    this.router.post(
      '/refresh-password',
      validateBody(this.schema.refreshPasswordSchema),
      auth,
      this.controller.refreshPassword,
    );
    this.router.post('/code', validateBody(this.schema.codeSchema), this.controller.code);

    /**
     * Modification
     */
    this.router.post(
      '/modification/password',
      validateBody(this.schema.modificationPassword),
      auth,
      this.controller.modification.password,
    );
    this.router.post(
      '/modification/email',
      validateBody(this.schema.modificationEmail),
      auth,
      this.controller.modification.email,
    );

    /**
     * Two Factor
     */
    this.router.post('/two-factor', validateBody(this.schema.twoFactorSchema), auth, this.controller.twoFactor);
  }
}

export default new AuthRoutes().router;
